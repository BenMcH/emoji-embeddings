import json
import pinecone
import openai
import os

openai_client = openai.Client(os.environ["OPENAI_API_KEY"])
pinecone_client = pinecone.Pinecone(api_key=os.environ["PINECONE_API_KEY"])


def lambda_handler(event):
    query = event["queryStringParameters"]["query"]

    embedding = openai_client.embeddings.create(query, model="text-embedding-3-small").data[0].embedding

    results = pinecone_client.Index("emoji").query(vector=embedding, top_k=10, include_metadata=True, include_values=False)

    return {
        "statusCode": 200,
        "body": json.dumps([{
            "emoji": e.metadata["emoji"]
        } for e in results]),
    }
