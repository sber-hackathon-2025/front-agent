import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { API_ENDPOINTS, CHAT_CONFIG } from '../config';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessageHistory = () => {
    const history = [];
    let userMessage = null;
    
    // Проходим по сообщениям в обратном порядке
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      
      if (message.type === 'user') {
        userMessage = message;
      } else if (message.type === 'agent' && userMessage) {
        history.unshift({
          question: userMessage.content,
          answer: message.content,
          timestamp: userMessage.timestamp
        });
        userMessage = null;
      }
      
      // Прерываем цикл, если достигли нужного количества пар
      if (history.length >= CHAT_CONFIG.historyPairs) {
        break;
      }
    }
    
    return history;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Добавляем сообщение пользователя
    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          timestamp: new Date().toISOString(),
          history: getMessageHistory()
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении ответа от сервера');
      }

      const data = await response.json();

      // Добавляем ответ агента
      const agentMessage = {
        type: 'agent',
        content: data.message,
        codeSnippets: data.code ? [{
          file: 'output.py',
          code: data.code
        }] : [],
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Добавляем сообщение об ошибке
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Произошла ошибка при обработке запроса',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-dark-50 to-dark-100">
      {/* Заголовок чата */}
      <div className="bg-white shadow-sm p-6 border-b border-dark-200">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="h-6 w-6 text-accent-purple animate-pulse-slow" />
          <h2 className="text-xl font-semibold text-dark-800">Чат с AI-агентом</h2>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl p-4 shadow-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white'
                  : message.type === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-white text-dark-800 border border-dark-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.codeSnippets && (
                <div className="mt-4 space-y-3">
                  {message.codeSnippets.map((snippet, idx) => (
                    <div key={idx} className="bg-dark-900 text-white p-4 rounded-xl shadow-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-accent-purple font-mono">{snippet.file}</p>
                      </div>
                      <pre className="text-sm font-mono overflow-x-auto">
                        <code className="text-gray-300">{snippet.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Форма ввода */}
      <form onSubmit={handleSubmit} className="bg-white border-t border-dark-200 p-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите ваш запрос..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-dark-200 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all duration-200 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl px-6 py-3 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat; 