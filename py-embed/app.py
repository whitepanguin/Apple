from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from embed_server import router as embed_router
from search_router import router as search_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(embed_router)
app.include_router(search_router)

@app.get("/")
def root():
    return {"message": "서버 정상 작동 중 ✅"}
