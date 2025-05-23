import os
from dotenv import load_dotenv
from pymongo import MongoClient
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk, BulkIndexError

# 1. 환경 변수 로드
load_dotenv()

# 2. MongoDB 연결
mongo_client = MongoClient(os.getenv("MONGO_URL"))
db = mongo_client[os.getenv("MONGO_DB")]
collection = db[os.getenv("MONGO_COLLECTION")]

# 3. Elasticsearch 연결
es = Elasticsearch(
    os.getenv("ES_URL"),
    basic_auth=(os.getenv("ES_USERNAME"), os.getenv("ES_PASSWORD"))
)

index_name = "posts_index"

# 4. 기존 인덱스 삭제
# if es.indices.exists(index=index_name):
#     es.indices.delete(index=index_name)

# 5. 새로운 인덱스 생성
es.indices.create(
    index=index_name,
    body={
        "settings": {
            "analysis": {
                "tokenizer": {
                    "nori_tokenizer": {
                        "type": "nori_tokenizer"
                    }
                },
                "filter": {
                    "nori_pos_filter": {
                        "type": "nori_part_of_speech",
                        "stoptags": [
                            "VV", "VA", "VX", "VCP", "VCN",
                            "XR", "SF", "SE", "SSO", "SSC",
                            "SC", "SY", "XPN", "XSN", "XSV",
                            "XSA", "UNKNOWN", "NA"
                        ]
                    }
                },
                "analyzer": {
                    "korean_noun_analyzer": {
                        "type": "custom",
                        "tokenizer": "nori_tokenizer",
                        "filter": ["nori_pos_filter"]
                    }
                }
            }
        },
        "mappings": {
            "properties": {
                "tittle": {
                    "type": "text",
                    "analyzer": "korean_noun_analyzer"
                },
                "text": {
                    "type": "text",
                    "analyzer": "korean_noun_analyzer"
                },
                "category": {
                    "type": "text",
                    "analyzer": "korean_noun_analyzer"
                },
                "img": {"type": "keyword"},
                "price": {"type": "integer"},
                "userid": {"type": "keyword"},
                "createdAt": {"type": "keyword"},
                "updatedAt": {"type": "keyword"},
                "mongoId": {"type": "keyword"},
                "vectorId": {"type": "keyword"}
            }
        }
    }
)

# 6. MongoDB → Elasticsearch 색인
actions = []
for doc in collection.find():
    mongo_id_str = str(doc["_id"])  # ObjectId → 문자열 변환
    es_id = doc.get("elasticId", mongo_id_str)

    actions.append({
        "_index": index_name,
        "_id": es_id,
        "_source": {
            "mongoId": mongo_id_str,
            "tittle": doc.get("tittle", ""),
            "text": doc.get("text", ""),
            "category": doc.get("category", ""),
            "img": doc.get("img", ""),
            "price": doc.get("price", 0),
            "userid": doc.get("userid", ""),
            "createdAt": doc.get("createdAt", ""),
            "updatedAt": doc.get("updatedAt", ""),
            "vectorId": doc.get("vectorId", "")  # 없는 경우 빈 문자열
        }
    })

try:
    bulk(es, actions)
    print(f"✅ 색인 완료: {len(actions)}개")
except BulkIndexError as e:
    print(f"❌ 색인 실패: {len(e.errors)}개 문서")
    for i, err in enumerate(e.errors[:5]):
        print(f"\n▶ 실패 #{i + 1}")
        error_info = err.get("index", {})
        print(f"- ID: {error_info.get('_id')}")
        print(f"- 상태코드: {error_info.get('status')}")
        print(f"- 오류 유형: {error_info.get('error', {}).get('type')}")
        print(f"- 이유: {error_info.get('error', {}).get('reason')}")
        caused_by = error_info.get("error", {}).get("caused_by", {})
        if caused_by:
            print(f"  ↳ 상세 원인: {caused_by.get('reason')}")
