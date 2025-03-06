import pandas as pd
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader,DirectoryLoader
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
import cv2
from pymongo import MongoClient
load_dotenv()
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")

llm=ChatGoogleGenerativeAI(api_key=GOOGLE_API_KEY,model="gemini-2.0-flash",temperature=0.1)

class GrapState(TypedDict):
    path:str
    text:str
    prescribed:str
    patient_id:str
    prev_med:list
def OCR(state):
    image_path = state["path"]
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    reader = easyocr.Reader(['en'])
    results = reader.readtext(image)
    final = " ".join([res[1] for res in results])
    return {"text":final}
def refiner(state):
    text=state["text"]
    response=llm.invoke(f"""You are being provided with an easyocr text of a medical prescription where there are medicine names adn other information.
                        refine the text and extract only the medicine name. Note:only extract the medicine name and doasge and nothing else dont give anything extra.text:{text}""").content
    print(response)
    return{"prescribed":response}
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
def drug_interact(state):
    prev_med=state["prev_med"]
    presc_med=state["prescribed"]
    
    response=llm.invoke(f"""You are an expert in assessing potential drug interactions. Given a patient's medical history, including the medications they have been taking, and a newly prescribed drug, your task is to determine if there are any possible conflicts.
If an interaction is detected, advise the patient to consult their doctor and suggest possible dosage adjustments if applicable.If there are no potential side effects of taking the drugs together then just tell theres no conflict
Important: This is only an AI-generated suggestion and should not be relied upon for medical decisions. Consulting a healthcare professional is essential.
Newly Prescribed Medication: {presc_med}
Previous Medications: {prev_med}
""").content
    print(response)
    return {"interaction":response}
workflow=StateGraph(GrapState)

workflow.add_node("OCR",OCR)
workflow.add_node("Refine",refiner)
# workflow.add_node("Mongo",mongoconnect)
workflow.add_node("Drug Interaction",drug_interact)

workflow.add_edge(START,"OCR")
workflow.add_edge("OCR","Refine")
workflow.add_edge("Refine","Drug Interaction")
workflow.add_edge("Drug Interaction",END)

app=workflow.compile()
from IPython.display import Image, display

display(Image(app.get_graph().draw_mermaid_png()))
from pprint import pprint
inputs={
    "path":r"C:\Projects\Quotation_generator\1_3xUyINxRtDf2qowd-kkGQA.jpg",
    "prev_med":["Dolo 650","crocin"]
}
for output in app.stream(inputs):
    for key, value in output.items():
        pprint(f"Node '{key}':")
    pprint("\n---\n")