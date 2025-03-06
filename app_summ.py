from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from langgraph.graph import StateGraph, END, START
from dotenv import load_dotenv
import easyocr
import spacy
import re
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = "AIzaSyAEqCEpjV4_6nZFKGQv8cxiyffiUNdDjGE"
llm = ChatGoogleGenerativeAI(api_key=GOOGLE_API_KEY, model="gemini-2.0-flash", temperature=0.1)

# Initialize Flask
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "uploads"
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Define the LangGraph Workflow
def ocr(state):
    path = state["path"]
    reader = easyocr.Reader(['en'])
    result = reader.readtext(path)
    response_text = '\n'.join([detection[1] for detection in result])
    return {"report": response_text}

def report(state):
    report_text = state["report"]
    response = llm.invoke(f"Correct this medical report grammatically: {report_text}").content
    return {"generation": response}

def remove_details(state):
    report = state["generation"]
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(report)
    redacted_text = re.sub(r'\b\d{10}\b', '[REDACTED]', report)
    return {"generation": redacted_text}

def generate_summary(state):
    generation = state["generation"]
    response = llm.invoke(f"Summarize the following medical report in layman terms: {generation}").content
    return {"summary": response}

def Translate_Summary(state):
    summary = state["summary"]
    response = llm.invoke(f"Translate the following summary into Hindi: {summary}").content
    return {"translation": response}

workflow = StateGraph({})
workflow.add_node("ocr_node", ocr)
workflow.add_node("report_node", report)
workflow.add_node("remove_details", remove_details)
workflow.add_node("generate_summary_node", generate_summary)
workflow.add_node("translation_node", Translate_Summary)
workflow.add_edge(START, "ocr_node")
workflow.add_edge("ocr_node", "report_node")
workflow.add_edge("report_node", "remove_details")
workflow.add_edge("remove_details", "generate_summary_node")
workflow.add_edge("generate_summary_node", "translation_node")
workflow.add_edge("translation_node", END)
app_workflow = workflow.compile()

@app.route('/process', methods=['POST'])
def process_report():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
    file.save(filepath)
    
    inputs = {"path": filepath}
    result = {}
    for output in app_workflow.stream(inputs):
        result.update(output)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)