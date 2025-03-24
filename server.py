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
    messages = data.get("messages", [])
    
    print("\n=== Новый запрос ===")
    print("\nПолный JSON входящего сообщения:")
    print(json.dumps(data, indent=2, ensure_ascii=False))
    
    print("\nСписок сообщений:")
    for i, msg in enumerate(messages, 1):
        print(f"\nСообщение {i}:")
        print(f"Role: {msg.get('role', '')}")
        print(f"Content: {msg.get('content', '')}")
    print("\n==================\n")
    
    # Форматируем JSON для красивого отображения
    formatted_json = json.dumps(data, indent=2, ensure_ascii=False)
    
    return [
        {
            "role": "assistant",
            "content": "",
            "function_call": {
                "name": "find_similar",
                "arguments": {
                    "query": "find code",
                    "code": "print('Hello from Python!')"
                }
            }
        },
        {
            "role": "function_call",
            "content": "Hello function_call :)",
        },
        {
            "role": "assistant",
            "content": "Hello user from function_call :)",
        }
    ]
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 