import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager

logger = logging.getLogger("api")

from .routers import (
    health,
    companies,
    screener,
    sectors,
    peers,
    valuation,
    portfolio,
    documents
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect SQLite on startup if needed
    print("Starting up API server...")
    yield
    print("Shutting down API server...")

app = FastAPI(
    title="Nifty100 API",
    description="API for Nifty100 project",
    version="1.0.0",
    lifespan=lifespan
)

# Configure middleware

# CORS Middleware
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8501",  # Streamlit
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:8501",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    logger.info(f"{request.method} {request.url.path} - {process_time:.0f} ms")
    return response

# Register routers
api_prefix = "/api/v1"
app.include_router(health.router, prefix=api_prefix)
app.include_router(companies.router, prefix=api_prefix)
app.include_router(screener.router, prefix=api_prefix)
app.include_router(sectors.router, prefix=api_prefix)
app.include_router(peers.router, prefix=api_prefix)
app.include_router(valuation.router, prefix=api_prefix)
app.include_router(portfolio.router, prefix=api_prefix)
app.include_router(documents.router, prefix=api_prefix)

@app.get("/")
def read_root():
    return {"message": "Welcome to Nifty100 API"}

if __name__ == "__main__":
    uvicorn.run("src.api.main:app", host="0.0.0.0", port=8000, reload=True)
