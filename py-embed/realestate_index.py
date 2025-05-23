import os
from dotenv import load_dotenv
from pymongo import MongoClient
from elasticsearch import Elasticsearch, helpers

# ✅ 1. 환경 변수 로드
load_dotenv()

# ✅ 2. MongoDB 연결
mongo_url = os.getenv("MONGO_URL")
mongo_db = os.getenv("MONGO_DB")
mongo_collection = os.getenv("MONGO_COLLECTION_REALESTATE")

mongo_client = MongoClient(mongo_url)
db = mongo_client[mongo_db]
collection = db[mongo_collection]

# ✅ 3. Elasticsearch 연결
es = Elasticsearch(
    os.getenv("ES_URL"),
    basic_auth=(os.getenv("ES_USERNAME"), os.getenv("ES_PASSWORD"))
)

index_name = "realestate_index"

# ✅ 4. 기존 인덱스 삭제
if es.indices.exists(index=index_name):
    es.indices.delete(index=index_name)
    print(f"🗑️ 기존 인덱스 '{index_name}' 삭제 완료")

# ✅ 5. 인덱스 생성
es.indices.create(
    index=index_name,
    body={
        "settings": {
            "analysis": {
                "analyzer": {
                    "korean": {
                        "type": "custom",
                        "tokenizer": "nori_tokenizer"
                    }
                }
            }
        },
        "mappings": {
            "properties": {
                "mongoId": { "type": "keyword" },
                "price": { "type": "text", "analyzer": "korean" },
                "building_usage": { "type": "text", "analyzer": "korean" },
                "sale": { "type": "text", "analyzer": "korean" },
                "deposit": { "type": "text", "analyzer": "korean" },
                "monthly_rent": { "type": "text", "analyzer": "korean" },
                "img": { "type": "text" }
            }
        }
    }
)
print(f"✅ 인덱스 '{index_name}' 생성 완료")

# ✅ 6. Mongo → Elasticsearch 인덱싱
def generate_actions():
    for doc in collection.find():
        yield {
            "_index": index_name,
            "_id": str(doc["_id"]),
            "_source": {
                "mongoId": str(doc["_id"]),
                "price": doc.get("price", ""),
                "building_usage": doc.get("building_usage", ""),
                "sale": doc.get("sale", ""),
                "deposit": doc.get("deposit", ""),
                "monthly_rent": doc.get("monthly_rent", ""),
                "img": doc.get("img", "")
            }
        }

# ✅ 7. bulk 인덱싱
helpers.bulk(es, generate_actions())
print("🚀 부동산 데이터 인덱싱 완료")
