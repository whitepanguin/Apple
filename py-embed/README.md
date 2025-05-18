# py-embed - 검색엔진 서비스

이 디렉토리는 Qdrant와 Elasticsearch 기반의 **문장 임베딩 검색엔진 API 서버**입니다.  
FastAPI로 작성되어 있으며, Node.js 백엔드에서 이 검색 서버에 HTTP 요청을 보내어 검색 기능을 활용합니다.

---

## 구성 기술

- Python 3.10 이상
- FastAPI
- SentenceTransformers (임베딩 생성)
- Qdrant (벡터 검색 DB)
- Elasticsearch (메타데이터 검색)
- REST API 기반 통신

---

## 디렉토리 구조

```bash
apple/
├── py-embed/
│   ├── embed_server.py   # FastAPI 서버
│   ├── init_store.py     # [⚠️1회] 저장소 생성
│   ├── index.py          # [⚠️1회] MongoDB 전체 데이터 인덱싱
│   ├── config.py         # dotenv 불러오기
│   ├── requirements.txt  # Python 의존성 목록
│   └── venv/             # Python 가상환경 (Git 포함X)
│
├── route/
│   ├── routes/index.js   # 단일 포스트 인덱싱 API
│   └── ...

```

- ⚠️ 는 실행하지 마세요.

---

## DB 소개

해당 db의 개념과 사용 기능 소개, 사용 방법과 단계를 안내.

### Elasticsearch

1. 사용 방법

   - 이미 배포된 서버나 클라우드 사용 : 유료
   - 로컬에서 직접 설치하여 사용 : ✅ 이 방법 선택
     - localhost:9200

2. 실행 방법 (로컬)

- 컴퓨터에서 설치한 경로로 접근
  - elasticsearch -> bin
  - cmd에서 해당 경로로 이동 `cd .../bin`
  - 서버 실행 `elasticsearch.bat`
    - 첫 실행 시 비밀번호를 알려줌. 복사
    - 아이디는 elasticsearch
  - 브라우저 `http://localhost:9200` 들어가서 아이디와 복사한 비밀번호 입력

### Qdrant

---

## 개발 환경 세팅

### 1. 초기 세팅 (가상환경, 패키지)

1. 루트에서 이 파일로 이동 `cd py-embed`
2. 가상환경 설치 `python -m venv venv`
   - 권한 문제로 설치 안되면, 파일 닫고
   - 윈도우로 vs코드 검색 후 우클릭하여 관리자 모드로 실행.
3. 가상환경 실행 `.\venv\Scripts\activate`
   - `(venv)` 앞에 떠 있으면 실행 상태
   - 비활성화 : `deactivate`
4. 파이썬 없으면 설치
5. 필요한 패키지 한번에 설치 `pip install -r requirements.txt`

### 2. 실행

1. 서버 활성화 `cd py-embed` 이동 후

---

## 상세 기능

1. \embed_server.js :
