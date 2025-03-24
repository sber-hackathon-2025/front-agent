from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json

app = FastAPI()

# Настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Разрешаем запросы с фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    message = data.get("message", "")
    history = data.get("history", [])
    
    print("\n=== Новый запрос ===")
    print(f"Сообщение: {message}")
    print("\nИстория сообщений:")
    for i, pair in enumerate(history, 1):
        print(f"\nПара {i}:")
        print(f"Вопрос: {pair.get('question', '')}")
        print(f"Ответ: {pair.get('answer', '')}")
        print(f"Время: {pair.get('timestamp', '')}")
    print("\n==================\n")
    
    return {
        "message": "Hello World :)",
        "code": "print('Hello from Python!')"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 