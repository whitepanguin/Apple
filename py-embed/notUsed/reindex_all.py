import os
import uuid
import pymongo
from dotenv import load_dotenv
# from qdrant_client import QdrantClient
from elasticsearch import Elasticsearch
# from sentence_transformers import SentenceTransformer

# 1. 환경 변수 로드
load_dotenv()

# 2. MongoDB 연결
mongo = pymongo.MongoClient(os.getenv("MONGO_URL"))
db = mongo[os.getenv("MONGO_DB")]
posts = db[os.getenv("MONGO_COLLECTION")]

# 3. Qdrant 연결 (비활성화)
# qdrant = QdrantClient(
#     url=os.getenv("QDRANT_URL"),
#     api_key=os.getenv("QDRANT_API_KEY")
# )

# Qdrant 컬렉션 재생성 (비활성화)
# qdrant.recreate_collection(
#     collection_name="image_collection",
#     vectors_config={"size": 384, "distance": "Cosine"}
# )

# 4. Elasticsearch 연결
es = Elasticsearch(
    os.getenv("ES_URL"),
    basic_auth=(os.getenv("ES_USERNAME"), os.getenv("ES_PASSWORD"))
)

# Elasticsearch 인덱스 삭제 후 재생성
if es.indices.exists(index="text_index"):
    es.indices.delete(index="text_index")
    print("✅ Elasticsearch 인덱스 삭제 완료")

es.indices.create(index="text_index", body={
    "mappings": {
        "properties": {
            "tittle": {"type": "text"},
            "text": {"type": "text"},
            "category": {"type": "keyword"},
            "price": {"type": "float"},
            "userid": {"type": "keyword"},
            "img": {"type": "keyword"},
            "createdAt": {"type": "keyword"},
            "updatedAt": {"type": "keyword"},
            "elasticId": {"type": "keyword"}
        }
    }
})
print("✅ Elasticsearch 인덱스 생성 완료")

# 5. SentenceTransformer 모델 로딩 (비활성화)
# bi_encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L12-v2")

# 6. MongoDB 문서에 elasticId 항상 덮어쓰기
updated_count = 0
for post in posts.find():
    new_elastic_id = str(uuid.uuid4())
    posts.update_one(
        {"_id": post["_id"]},
        {"$set": {"elasticId": new_elastic_id}}
    )
    print(f"🔄 elasticId 갱신: {post['_id']} → {new_elastic_id}")
    updated_count += 1
print(f"\n✅ 총 {updated_count}개 문서에 elasticId 재할당 완료")

# 7. Elasticsearch에 인덱싱 (elasticId 기준)
for post in posts.find():
    doc_id = post.get("elasticId")  # 필수

    try:
        es.index(index="text_index", id=doc_id, document={
            "tittle": post.get("tittle", ""),
            "text": post.get("text", ""),
            "category": post.get("category", ""),
            "price": post.get("price", 0),
            "userid": post.get("userid", ""),
            "img": post.get("img", ""),
            "createdAt": post.get("createdAt", ""),
            "updatedAt": post.get("updatedAt", ""),
            "elasticId": doc_id  # ES 필드에도 포함
        })
        print(f"✅ ES 인덱싱 완료: {doc_id}")
    except Exception as e:
        print(f"❌ ES 인덱싱 실패: {doc_id}, {e}")

# ✅ Qdrant 관련 코드는 전체 주석처리됨
# if post.get("img"):
#     try:
#         vector = bi_encoder.encode(post["text"]).tolist()
#     except Exception as e:
#         print(f"❌ 임베딩 실패: {doc_id}, {e}")
#         continue

#     vector_id = post.get("vectorId") or str(uuid.uuid4())
#     posts.update_one({"_id": post["_id"]}, {"$set": {"vectorId": vector_id}})

#     payload = {
#         "tittle": post.get("tittle", ""),
#         "text": post.get("text", ""),
#         "category": post.get("category", ""),
#         "price": post.get("price", 0),
#         "userid": post.get("userid", ""),
#         "img": post.get("img", ""),
#         "createdAt": post.get("createdAt", ""),
#         "updatedAt": post.get("updatedAt", "")
#     }

#     try:
#         qdrant.upsert(collection_name="image_collection", points=[{
#             "id": vector_id,
#             "vector": vector,
#             "payload": payload
#         }])
#         print(f"✅ Qdrant 인덱싱 완료: {doc_id} → {vector_id}")
#     except Exception as e:
#         print(f"❌ Qdrant 업서트 실패: {doc_id}, {e}")
