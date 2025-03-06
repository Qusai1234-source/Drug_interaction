import pandas as pd
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_astradb import AstraDBVectorStore
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from langchain_core.output_parsers import StrOutputParser
from langchain import hub
from langchain.schema import Document
from langgraph.graph import START, StateGraph, END
from typing import Literal, List
from typing_extensions import TypedDict
from dotenv import load_dotenv
import easyocr
import os
import spacy
import re

load_dotenv()
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")
llm=ChatGoogleGenerativeAI(api_key=GOOGLE_API_KEY,model="gemini-2.0-flash",temperature = 0.1)


class GraphState(TypedDict):
    report : str
    generation : str    
    summary : str
    translation: str
    Anamoly : str
    root_cause : str
    path : str
def ocr(state):
    path = state["path"]
    reader = easyocr.Reader(['en'])
    result = reader.readtext(path)
    response = [detection[1] for detection in result]
    response_text = '\n'.join(response)
    print("HI")
    return {"report" : response_text}
def report(state):
    report = state["report"]
    response = llm.invoke(f"You are being provided a medical report correct this grammatically{report} Note: Do not add anything extra. Just return the report as it is.").content
    print("INSIDE REPORT")
    return {"generation" : response}
def redact_sensitive_info(report, doc):
    redacted_text = report  
    for ent in doc.ents:
        if ent.label_ == "PERSON":  
            redacted_text = redacted_text.replace(ent.text, "[REDACTED]")
    
    redacted_text = re.sub(r'\b\d{10}(?:/\d{10})?\b', '[REDACTED]', redacted_text)
    redacted_text = re.sub(
        r'(?i)(?:deliver to|patient address|sample collected at)[:\s].(?:\n|$)',
        '[REDACTED]\n',
        redacted_text
    )

    return redacted_text

def remove_details(state):
    report = state["generation"]
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(report)
    redacted_text = redact_sensitive_info(report, doc)

    print(redacted_text)
    return {"generation" : redacted_text}
def generate_summary(state):
    generation = state["generation"]

    response = llm.invoke(f"""You are an Expert in Evaluating medical Reports.You are given the report, 
                          Based on the report Devise a comprehensive of the report in not more than 150 words.
                          Note: The summary you generate should be generated in layman terms. Keep the summary as 
                          simple as possible. report {generation}""").content
    print("INSIDE SUMMARY")
    print(response)
    
    return {"summary" : response}
def Translate_Summary(state):
    lang = "telugu"
    summary = state["summary"]
    response = llm.invoke(f"""
    You are a professional translator. Your task is to translate the following English summary into {lang}. 
    Ensure that any numbers, dates, and proper nouns remain in English. 
    Here is the summary to translate:"{summary}".""").content
    print(response)
    return {"translation" : response}
def anamoly_detection(state):#this is an edge
    print("Inside anamoly detection")
    summary = state["summary"]

    class Route_Anamoly(BaseModel):
        Binary_Score: str = Field(..., description="Does this report contain abnormal values? Yes or No")

    structured_llm = llm.with_structured_output(Route_Anamoly)

    system = """
    You are provided with a summary of a medical report containing various measurements and observations. 
    Your task is to identify any abnormal values or measurements. A value is considered abnormal if it is described as "elevated," "low," "absent," or if it falls outside the reference range.
    If any abnormal values are found, respond with 'Yes'. If no abnormal values are found, or if the summary lacks numerical data, respond with 'No'.
    """

    binary_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            ("human", "report:{report}")
        ]
    )

    grader_chain = binary_prompt | structured_llm

    llm_response = grader_chain.invoke({"report": summary})
    print("Detecting anamoly")
    if llm_response.Binary_Score == "Yes":
        print("Anamoly present")
        return "Anamoly"
    else:
        print("Anamoly Not present")
        state["Anamoly"]="Normal"
        return state["Anamoly"]
def value_extractor(state):
    summary = state["summary"]

    system = """
    You are given a medical report summary that includes various measurements and observations. 
    Your task is to identify and extract all values or measurements that are described as abnormal. 
    A value is considered abnormal if it is described as "elevated," "low," "absent," or if it is outside the reference range.
    Return the abnormal values along with the associated measurement.
    If no abnormal values are found, respond with 'None'.
    """
    print("hey")
    extraction_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            ("human", f"summary: {summary}")
        ]
    )

    chain = extraction_prompt | llm
    extracted_values = chain.invoke({summary : summary})
    extracted_values = extracted_values.content
    print("Exiting the extacted values node")
    print(extracted_values)
    return {"Anamoly": extracted_values}
def root_cause(state):#THIS IS A NODE
    # return " "
    anamoly = state["Anamoly"]
    response = llm.invoke(f"""From the given extracted values find out the root causes.
                          NOTE: Only find out root cause and nothing else. Values{anamoly}""")
    response = response.content

    print(response)
    return {"root_cause" : response}
def root_cause_1(state):
    # return " "
    print("inside root cause 1")
    anamoly = state["Anamoly"]

    response_1 = llm.invoke(f"""From the given extracted values find out the root causes.
                            NOTE: Only find out root cause and nothing else. Values{anamoly}""")
    response_1 = response_1.content

    print(response_1)
    return {"root_cause" : response_1}
workflow = StateGraph(GraphState)

workflow.add_node("ocr_node", ocr)
workflow.add_node("report_node", report)
workflow.add_node("generate_summary_node", generate_summary)
workflow.add_node("Translation_node",Translate_Summary)
workflow.add_node("value_extractor_node", value_extractor)
workflow.add_node("root_cause_node", root_cause)
workflow.add_node("root_cause_1_node", root_cause_1)
workflow.add_node("remove_details", remove_details)

workflow.add_edge(START, "ocr_node")
workflow.add_edge("ocr_node", "report_node")
workflow.add_edge("report_node","remove_details")
workflow.add_edge("remove_details", "generate_summary_node")
workflow.add_edge("generate_summary_node","Translation_node")
workflow.add_edge("Translation_node",END)

workflow.add_conditional_edges("Translation_node", anamoly_detection,{
        "Anamoly" : "value_extractor_node",
        "Normal": "root_cause_1_node"
    })

workflow.add_edge("root_cause_1_node", END)

workflow.add_edge("value_extractor_node", "root_cause_node")
workflow.add_edge("root_cause_node", END)

app = workflow.compile()

from IPython.display import Image, display

try:
    display(Image(app.get_graph().draw_mermaid_png()))
except Exception:
    pass
from pprint import pprint
inputs = {
    "path": r"C:\Projects\Drug_interaction\Data\WhatsApp Image 2025-03-06 at 19.45.22_1341e2fa.jpg"
}
for output in app.stream(inputs):
    for key, value in output.items():
        pprint(f"Node '{key}':")
    pprint("\n---\n")