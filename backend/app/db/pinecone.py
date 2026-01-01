import os
from pinecone import Pinecone

# Create Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Connect to index
index = pc.Index("brightly-memories")
