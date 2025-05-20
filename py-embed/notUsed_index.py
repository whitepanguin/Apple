import os
import uuid
import requests
import pymongo
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from elasticsearch import Elasticsearch 
from sentence_transformers import SentenceTransformer

# 1. 환경 변수 로드
load_dotenv()

# 2. MongoDB 연결
mongo = pymongo.MongoClient(os.getenv("MONGO_URL"))
db = mongo[os.getenv("MONGO_DB")]
posts = db[os.getenv("MONGO_COLLECTION")]

# 3. Qdrant 연결
qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)
# 차원 변경
qdrant.recreate_collection(
    collection_name="apple_collection",
    vectors_config={"size": 384, "distance": "Cosine"}
)


es = Elasticsearch(
    os.getenv("ES_URL"),
    basic_auth=(os.getenv("ES_USERNAME"), os.getenv("ES_PASSWORD"))
)

# 5. 모델 로딩 (768차원 임베딩)
# bi_encoder = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

# 5. 모델 로딩 (384차원 모델 사용)
bi_encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L12-v2")



# 6. 설정
COLLECTION = "vector_collection"
INDEX = "apple_index"  # ❌ ES용 상수 제거

# 7. 인덱싱 시작
for post in posts.find():
    # 중복 인덱싱 방지 (필요시 주석 해제)
    if post.get("vectorId"):
        print(f"✅ 이미 인덱싱됨: {post['_id']}")
        continue

    # 텍스트 임베딩
    try:
        vector = bi_encoder.encode(post["text"]).tolist()
    except Exception as e:
        print("❌ 임베딩 실패:", e)
        continue

    # vectorId 가져오기 또는 새로 생성
    vector_id = post.get("vectorId")
    if not vector_id:
        vector_id = str(uuid.uuid4())
        posts.update_one({"_id": post["_id"]}, {"$set": {"vectorId": vector_id}})

    # 저장할 Qdrant payload
    payload = {
        "tittle": post.get("tittle", ""),
        "text": post.get("text", ""),
        "category": post.get("category", ""),
        "price": post.get("price", 0),
        "userid": post.get("userid", ""),
        "img": post.get("img", ""),
        "createdAt": post.get("createdAt", ""),
        "updatedAt": post.get("updatedAt", "")
    }

    # Qdrant 업서트
    try:
        qdrant.upsert(collection_name=COLLECTION, points=[
            {
                "id": vector_id,
                "vector": vector,
                "payload": payload
            }
        ])
    except Exception as e:
        print("❌ Qdrant 업서트 실패:", e)
        continue

    print(f"✅ Qdrant 인덱싱 완료: {post['_id']} → {vector_id}")
