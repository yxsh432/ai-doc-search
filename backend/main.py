import os
import shutil
import traceback
from tempfile import NamedTemporaryFile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Load environment variables (API keys)
load_dotenv()

app = FastAPI(title="PDF RAG Chatbot API")

# Add CORS Middleware to allow Next.js frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # For production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup ChromaDB persistence directory
DB_DIR = os.path.join(os.path.dirname(__file__), "db")

# Initialize embeddings
# Using 'models/text-embedding-004' for high-quality vectorization
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

# Initialize LLM
# Using Gemini 1.5 Flash (optimized for speed and RAG context windows)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the PDF RAG Chatbot API"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Handles PDF upload, splits text into chunks, creates embeddings, 
    and persists them to ChromaDB with metadata.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Save the uploaded file temporarily
        with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_path = tmp_file.name

        # 1. Load PDF and extract metadata (page numbers included by default)
        loader = PyPDFLoader(tmp_path)
        docs = loader.load()

        # Add source filename to metadata for citation support
        for doc in docs:
            doc.metadata["source_filename"] = file.filename

        # 2. Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = text_splitter.split_documents(docs)

        # 3. Create embeddings and persist to ChromaDB
        Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=DB_DIR
        )

        # Cleanup
        os.remove(tmp_path)

        return {
            "message": "File processed and added to knowledge base",
            "filename": file.filename,
            "chunks": len(chunks)
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Retrieves relevant document chunks and uses Gemini Flash to answer queries.
    Uses LCEL (LangChain Expression Language) - compatible with LangChain 1.x.
    """
    try:
        # 1. Connect to the existing Vector Store
        vectorstore = Chroma(
            persist_directory=DB_DIR,
            embedding_function=embeddings
        )
        retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

        # 2. Define a RAG Prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a professional assistant. Use the following context to answer the user's question accurately.
If you don't know the answer based on the context, say that you don't have enough information.
Always reference the source and page number when stating facts.

Context:
{context}"""),
            ("human", "{question}"),
        ])

        # 3. Fetch source docs for citations (separate from the chain)
        source_docs = retriever.invoke(request.message)
        context_text = "\n\n".join(doc.page_content for doc in source_docs)

        # 4. Build LCEL chain: prompt | llm | parser
        chain = prompt | llm | StrOutputParser()

        # 5. Generate answer
        answer = chain.invoke({"context": context_text, "question": request.message})

        # 6. Extract and format citations
        citations = []
        for doc in source_docs:
            cit = {
                "source": doc.metadata.get("source_filename", "Unknown"),
                "page": doc.metadata.get("page", 0) + 1,  # PyPDF uses 0-indexed pages
                "snippet": doc.page_content[:150] + "..."
            }
            if cit not in citations:
                citations.append(cit)

        return {
            "answer": answer,
            "citations": citations
        }

    except Exception as e:
        print(f"Error in /chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
