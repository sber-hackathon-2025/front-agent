import React from 'react';
import { CodeBracketIcon, DocumentTextIcon, QuestionMarkCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

function Sidebar() {
  return (
    <div className="w-72 bg-gradient-to-b from-dark-900 to-dark-800 text-white shadow-2xl">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="h-8 w-8 text-accent-purple animate-pulse-slow" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-purple via-accent-pink to-accent-blue bg-clip-text text-transparent">
            Code Search AI
          </h1>
        </div>
      </div>
      
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          <div className="group">
            <div className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-all duration-200 cursor-pointer">
              <CodeBracketIcon className="h-5 w-5 mr-3 text-accent-purple group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Поиск кода</span>
            </div>
          </div>
          
          <div className="group">
            <div className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-all duration-200 cursor-pointer">
              <DocumentTextIcon className="h-5 w-5 mr-3 text-accent-blue group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Документация</span>
            </div>
          </div>
          
          <div className="group">
            <div className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-all duration-200 cursor-pointer">
              <QuestionMarkCircleIcon className="h-5 w-5 mr-3 text-accent-pink group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Помощь</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-72 p-6 border-t border-dark-700">
        <div className="text-sm text-gray-400">
          <p className="font-medium text-white">Версия 1.0.0</p>
          <p className="mt-1">© 2025 Code Search AI</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 