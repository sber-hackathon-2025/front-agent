import React from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

function App() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Боковая панель */}
      <Sidebar />
      
      {/* Основная область чата */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white/5 backdrop-blur-sm">
        <Chat />
      </div>
    </div>
  );
}

export default App; 