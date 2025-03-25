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

  // Преобразуем сообщения в нужный формат, учитывая N последних сообщений пользователя
  const getMessageHistory = () => {
    // Находим индексы последних N сообщений пользователя
    const userMessageIndices = messages
      .map((msg, index) => msg.type === 'user' ? index : -1)
      .filter(index => index !== -1)
      .slice(-CHAT_CONFIG.historyMessages);

    // Если нет сообщений пользователя, возвращаем пустой массив
    if (userMessageIndices.length === 0) {
      return [];
    }

    // Берём все сообщения, начиная с первого из N последних сообщений пользователя
    const relevantMessages = messages.slice(userMessageIndices[0]);
    
    console.log('История сообщений:', relevantMessages);
    
    return relevantMessages.map(msg => {
      // Базовый объект сообщения
      const messageObj = {
        role: msg.type === 'user' ? 'user' : (msg.role === 'function_call' ? 'function' : (msg.role || 'assistant')),
        content: msg.content || ''
      };
      // Добавляем function_call только если он есть и это объект
      if (msg.function_call && typeof msg.function_call === 'object') {
        messageObj.function_call = msg.function_call;
      }
      return messageObj;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Формируем список сообщений: N последних + текущее
      const allMessages = [
        ...getMessageHistory(),
        { 
          role: 'user', 
          content: input
        }
      ];

      console.log('Отправляем запрос на:', API_ENDPOINTS.chat);
      console.log('Тело запроса:', JSON.stringify({
        messages: allMessages
      }, null, 2));

      const response = await fetch(API_ENDPOINTS.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          messages: allMessages
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка сервера:', response.status, errorText);
        throw new Error(`Ошибка сервера: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Получен ответ:', JSON.stringify(data, null, 2));
      
      // Проверяем наличие поля answer в ответе
      if (data.answer && Array.isArray(data.answer)) {
        // Обрабатываем список сообщений из поля answer
        data.answer.forEach(message => {
          // Добавляем сообщение в чат
          const agentMessage = {
            type: message.role === 'user' ? 'user' : 'agent',
            content: message.content || '',
            // Если роль была function_call, меняем на function
            role: message.role === 'function_call' ? 'function' : message.role,
            timestamp: new Date().toISOString()
          };
          
          // Добавляем function_call только если он есть и это объект
          if (message.function_call && typeof message.function_call === 'object') {
            agentMessage.function_call = message.function_call;
          }
          
          setMessages(prev => [...prev, agentMessage]);
        });
      } else {
        throw new Error('Некорректный формат ответа от сервера');
      }

    } catch (error) {
      console.error('Error:', error);
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
        {messages
          .filter(message => 
            (message.role === 'assistant' || message.type === 'user') && 
            message.content && 
            message.content.trim() !== ''
          )
          .map((message, index) => (
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
                  : 'bg-white text-dark-800 border border-dark-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
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