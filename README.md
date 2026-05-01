# 🧠 AI Doc Search: Premium RAG Chatbot

![Project Banner](https://github.com/user-attachments/assets/thumbnail-placeholder)

An intelligent, full-stack Document Search & Analysis platform powered by **Retrieval-Augmented Generation (RAG)**. This application allows users to upload PDF documents and engage in context-aware conversations with an AI that cites specific sources and page numbers.

---

## ✨ Features

- **🚀 Advanced RAG Engine**: Uses LangChain and Google Gemini 1.5 Flash for high-speed, accurate document analysis.
- **📑 Multi-Document Support**: Upload and process multiple PDFs; the system chunks and indexes them into a persistent ChromaDB vector store.
- **🎨 Premium UI/UX**: A state-of-the-art interface built with Next.js 15, featuring:
  - **Glassmorphism**: Transparent, frosted-glass components with dynamic blurs.
  - **Animated Backgrounds**: Smoothly shifting gradients for a professional feel.
  - **Interactive Pointer Trail**: A custom "Target Cursor" that follows user interaction.
- **📍 Precise Citations**: Every answer includes clickable citations showing the source filename and exact page number.
- **⚡ Real-time Feedback**: Instant document processing and streaming-ready chat architecture.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Orchestration**: LangChain
- **LLM**: Google Gemini 1.5 Flash
- **Embeddings**: Google Generative AI Embeddings
- **Vector Database**: ChromaDB

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Python 3.10+
- A Google AI (Gemini) API Key

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend` directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```
Run the server:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start searching!

---

## 📸 Screenshots

| Landing Page | Chat Interface |
| :---: | :---: |
| ![Welcome](https://github.com/user-attachments/assets/screenshot-1) | ![Chat](https://github.com/user-attachments/assets/screenshot-2) |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by the AI Doc Search Team
</p>
"# ai-doc-search" 
