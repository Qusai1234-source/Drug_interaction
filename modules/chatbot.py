import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langgraph.graph import START, StateGraph, END
from langchain_core.prompts import ChatPromptTemplate
from IPython.display import Image,display
from typing import Literal, List
from typing_extensions import TypedDict
from langchain_core.output_parsers import StrOutputParser
load_dotenv()
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(api_key = GOOGLE_API_KEY, model = "gemini-1.5-flash",temperature = 0.1)

loader=PyPDFLoader(r"C:\Projects\Drug_interaction\Data\Stockleys_Drug_Interactions.pdf")
data=loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=5)
all_splits = text_splitter.split_documents(data)

gemini_embedding = GoogleGenerativeAIEmbeddings(google_api_key = GOOGLE_API_KEY, model = "models/embedding-001")
vectorstore = Chroma.from_documents(documents=all_splits, embedding=gemini_embedding)

input=r"Can a patient take warfarin and aspirin together?"
retrieval=vectorstore.as_retriever()
docs=retrieval.get_relevant_documents(input)

class QAState(TypedDict):
    question: str
    context: str
    response: str
def start_node(state: QAState):
    """Starting node that receives the user question."""
    return {"question": state["question"]}
def retrieve_docs(state: QAState):
    """Retrieves relevant documents from the vectorstore."""
    retrieval = vectorstore.as_retriever()
    docs = retrieval.get_relevant_documents(state["question"])
    context = "\n".join([doc.page_content for doc in docs]) if docs else ""
    return {"question": state["question"], "context": context}
def conditional_node(state: QAState):
    """Decides whether to use context or directly answer."""
    if state["context"] and len(state["context"]) > 50: 
        return {"next": "llm_with_context"} 
    return {"next": "llm_without_context"}
def llm_with_context(state: QAState):
    """LLM generates an answer using context."""
    prompt_template = """
    Use the following information to answer the user's question:
    Context: {context}
    Question: {question}
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", prompt_template),
        ("user", "{question}")
    ])
    mess = prompt.invoke({"context": state["context"], "question": state["question"]})
    response = llm.invoke(mess)
    return {"response": response}
def llm_without_context(state: QAState):
    """LLM directly answers without context."""
    response = llm.invoke(state["question"])
    return {"response": response}
def stop_node(state: QAState):
    """Stops execution and returns the response."""
    return state["response"]
graph = StateGraph(QAState)
graph.add_node("start", start_node)
graph.add_node("retrieve_docs", retrieve_docs)
graph.add_node("conditional", conditional_node)
graph.add_node("llm_with_context", llm_with_context)
graph.add_node("llm_without_context", llm_without_context)
graph.add_node("stop", stop_node)

graph.add_edge(START, "start")
graph.add_edge("start", "retrieve_docs")
graph.add_edge("retrieve_docs", "conditional")
graph.add_conditional_edges("conditional", lambda state: state["next"])
graph.add_edge("llm_with_context", "stop")
graph.add_edge("llm_without_context", "stop")
graph.add_edge("stop", END)

graph = graph.compile()
display(Image(graph.get_graph().draw_mermaid_png()))

user_question = r"Can a patient take warfarin and aspirin together?"
initial_state = {"question": user_question, "context": "", "response": ""}
result = graph.invoke(initial_state)
print(result["response"].content)