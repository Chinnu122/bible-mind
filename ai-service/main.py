# Bible Mind AI Service
# Python FastAPI microservice for AI features

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Bible Mind AI", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Config
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY_GPT", os.getenv("OPENROUTER_API_KEY", ""))
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "google/gemini-2.0-flash-001"

# Request Models
class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

class VerseRequest(BaseModel):
    book: str
    chapter: int
    verse: int
    text: Optional[str] = None

class StudyRequest(BaseModel):
    topic: str

class TranslateRequest(BaseModel):
    text: str
    target_language: str = "Telugu"

# Response Models
class AIResponse(BaseModel):
    success: bool
    response: str
    cached: bool = False

# AI Call Helper
async def call_ai(system_prompt: str, user_prompt: str) -> str:
    """Call OpenRouter AI API"""
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://biblemind.app",
        "X-Title": "Bible Mind"
    }
    
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "max_tokens": 2000,
        "temperature": 0.7
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(OPENROUTER_URL, json=payload, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"AI API Error: {response.text}")
        
        data = response.json()
        return data["choices"][0]["message"]["content"]

# Routes
@app.get("/")
async def root():
    return {"status": "ok", "service": "Bible Mind AI", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "api_configured": bool(OPENROUTER_API_KEY)}

@app.post("/chat", response_model=AIResponse)
async def chat(request: ChatRequest):
    """General Bible chat/questions"""
    system = """You are a helpful Bible scholar assistant. 
    Answer questions about the Bible accurately and respectfully.
    Provide scripture references when relevant.
    Be concise but thorough."""
    
    prompt = request.message
    if request.context:
        prompt = f"Context: {request.context}\n\nQuestion: {request.message}"
    
    response = await call_ai(system, prompt)
    return AIResponse(success=True, response=response)

@app.post("/explain", response_model=AIResponse)
async def explain_verse(request: VerseRequest):
    """Explain a Bible verse in depth"""
    system = """You are a Bible scholar. Explain verses with:
    1. Historical context
    2. Original language insights (Hebrew/Greek)
    3. Theological significance
    4. Practical application
    Keep explanations clear and educational."""
    
    prompt = f"Explain {request.book} {request.chapter}:{request.verse}"
    if request.text:
        prompt += f'\n\nVerse text: "{request.text}"'
    
    response = await call_ai(system, prompt)
    return AIResponse(success=True, response=response)

@app.post("/study", response_model=AIResponse)
async def generate_study(request: StudyRequest):
    """Generate Bible study notes on a topic"""
    system = """You are a Bible teacher. Create study notes with:
    - Introduction to the topic
    - 3-5 key scripture passages
    - Explanation of each passage
    - Application questions
    - Conclusion
    Format with clear headings."""
    
    prompt = f"Create a Bible study guide on: {request.topic}"
    
    response = await call_ai(system, prompt)
    return AIResponse(success=True, response=response)

@app.post("/translate", response_model=AIResponse)
async def translate_text(request: TranslateRequest):
    """Translate text to Telugu or other languages"""
    system = f"""You are a professional translator specializing in Biblical texts.
    Translate the following text to {request.target_language}.
    Maintain the spiritual meaning and tone.
    Only output the translation, nothing else."""
    
    response = await call_ai(system, request.text)
    return AIResponse(success=True, response=response)

@app.post("/kids-story", response_model=AIResponse)
async def kids_story(request: StudyRequest):
    """Generate a kids Bible story"""
    system = """You are a children's Sunday school teacher.
    Write an engaging, age-appropriate (5-10 years) story about Bible characters.
    Include:
    - A catchy title
    - Simple language
    - A moral lesson
    - A fun ending
    Make it educational and entertaining."""
    
    prompt = f"Write a children's story about: {request.topic}"
    
    response = await call_ai(system, prompt)
    return AIResponse(success=True, response=response)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
