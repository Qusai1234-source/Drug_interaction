import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langgraph.graph import START, StateGraph, END
from langchain_core.prompts import ChatPromptTemplate
from typing_extensions import TypedDict

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Initialize LLM
llm = ChatGoogleGenerativeAI(api_key=GOOGLE_API_KEY, model="gemini-1.5-flash", temperature=0.1)

# Load and process PDF
loader = PyPDFLoader(r"C:\Projects\Drug_interaction\Data\Stockleys_Drug_Interactions.pdf")
data = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=5)
all_splits = text_splitter.split_documents(data)

# Create Vector Store
gemini_embedding = GoogleGenerativeAIEmbeddings(google_api_key=GOOGLE_API_KEY, model="models/embedding-001")
vectorstore = Chroma.from_documents(documents=all_splits, embedding=gemini_embedding)

# Flask app setup
app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# Define chatbot workflow
class QAState(TypedDict):
    question: str
    context: str
    response: str

def retrieve_docs(question: str):
    """Retrieve relevant documents from vectorstore."""
    retrieval = vectorstore.as_retriever()
    docs = retrieval.get_relevant_documents(question)
    return "\n".join([doc.page_content for doc in docs]) if docs else ""

def generate_response(question: str):
    """Process user query and return chatbot response."""
    context = retrieve_docs(question)
    if context and len(context) > 50:
        prompt_template = """
        Use the following information to answer the user's question:
        Context: {context}
        Question: {question}
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", prompt_template),
            ("user", "{question}")
        ])
        mess = prompt.invoke({"context": context, "question": question})
        response = llm.invoke(mess)
    else:
        response = llm.invoke(question)
    
    return response.content if hasattr(response, 'content') else str(response)

# Flask route to handle user queries
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_question = data.get("question", "")
        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        response = generate_response(user_question)
        return jsonify({"response": response})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5000)
