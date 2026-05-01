import langchain
import langchain_core
try:
    from langchain.chains import RetrievalQA
    print("langchain.chains.RetrievalQA exists")
except ImportError:
    print("langchain.chains.RetrievalQA MISSING")

try:
    from langchain_community.chains import RetrievalQA
    print("langchain_community.chains.RetrievalQA exists")
except ImportError:
    print("langchain_community.chains.RetrievalQA MISSING")

print(f"Langchain version: {langchain.__version__}")
