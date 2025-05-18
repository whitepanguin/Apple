import os
from dotenv import load_dotenv
import requests
import pymongo

from qdrant_client import QdrantClient
from elasticsearch import Elasticsearch

load_dotenv()

# MongoDB 연결
mongo = pymongo.MongoClient(os.getenv("MONGODB"))
db = mongo[os.getenv("MONGODB")]
posts = db[os.getenv("MONGO_COLLECTION")]

# Qdrant 연결
qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

# Elasticsearch 연결
es = Elasticsearch(
    os.getenv("ES_URL"),
    basic_auth=(os.getenv("ES_USERNAME"), os.getenv("ES_PASSWORD"))
)

COLLECTION = "apple_collection"
INDEX = "apple_index"

for post in posts.find():
    if post.get("vectorId") and post.get("elasticId"):
        print(f"✅ 이미 인덱싱됨: {post['_id']}")
        continue

    res = requests.post(os.getenv("EMBEDDING_API_URL"), json={"text": post["text"]})
    if res.status_code != 200:
        print("❌ 임베딩 실패:", res.text)
        continue

    vector = res.json()["vector"]
    vector_id = str(post["_id"])  # 중복 방지용 고정 ID

    qdrant.upsert(COLLECTION, points=[
        {
            "id": vector_id,
            "vector": vector,
            "payload": {
                "tittle": post["tittle"],
                "text": post["text"],
                "category": post["category"],
                "price": post["price"],
                "userid": post["userid"]
            }
        }
    ])

    es.index(index=INDEX, id=vector_id, document={
        "tittle": post["tittle"],
        "text": post["text"],
        "category": post["category"],
        "price": post["price"],
        "userid": post["userid"]
    })

    posts.update_one(
        {"_id": post["_id"]},
        {"$set": {
            "vectorId": vector_id,
            "elasticId": vector_id
        }}
    )

    print(f"✅ 인덱싱 완료: {post['_id']}")
