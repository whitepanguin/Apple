import os
from dotenv import load_dotenv
from pymongo import MongoClient
from elasticsearch import Elasticsearch

# 1. 환경변수 로드
load_dotenv()

# 2. 환경변수 읽기
ES_URL = os.getenv("ES_URL")
ES_USERNAME = os.getenv("ES_USERNAME")
ES_PASSWORD = os.getenv("ES_PASSWORD")

MONGO_URL = os.getenv("MONGO_URL")
MONGO_DB = os.getenv("MONGO_DB")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION")

# 3. MongoDB 연결
mongo = MongoClient(MONGO_URL)
mongo_posts = mongo[MONGO_DB][MONGO_COLLECTION]

# 4. Elasticsearch 연결
es = Elasticsearch(ES_URL, basic_auth=(ES_USERNAME, ES_PASSWORD))

# 5. MongoDB에서 _id 수집
mongo_ids = set()
for doc in mongo_posts.find({}, {"_id": 1}):
    mongo_ids.add(str(doc["_id"]))

# 6. Elasticsearch에서 mongoId 수집
es_ids = set()
res = es.search(index="korean_market_index", body={"query": {"match_all": {}}}, scroll="2m", size=1000)

scroll_id = res["_scroll_id"]
hits = res["hits"]["hits"]
while hits:
    for hit in hits:
        es_ids.add(hit["_source"].get("mongoId"))
    res = es.scroll(scroll_id=scroll_id, scroll="2m")
    scroll_id = res["_scroll_id"]
    hits = res["hits"]["hits"]

# 7. 비교
only_in_mongo = mongo_ids - es_ids
only_in_es = es_ids - mongo_ids

print("✅ MongoDB에만 있는 ID 개수:", len(only_in_mongo))
print("✅ Elasticsearch에만 있는 ID 개수:", len(only_in_es)) #py-embed\compare_mongo_es_ids.py