import React, { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! I'm the SafeAccessATX assistant. How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: messages.length + 1, content: input, isBot: false };
    setMessages([...messages, userMessage]);

    // Simulate bot response (in a real app, this would call an API)
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        content: "I'm looking up information about safety resources for you. In a real application, this would connect to our backend services.",
        isBot: true
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Chat header */}
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">SafeAccessATX Assistant</h1>
          <div className="bg-green-100 px-3 py-1 rounded-full text-sm text-green-800 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Online
          </div>
        </div>
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`flex items-start max-w-3/4 ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${message.isBot ? 'bg-blue-100' : 'bg-slate-200'}`}>
                {message.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div
                className={`p-3 rounded-lg ${message.isBot
                  ? 'bg-white border border-gray-200 text-gray-800'
                  : 'bg-blue-600 text-white'
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center bg-slate-100 rounded-lg">
          <textarea
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none p-3"
            placeholder="Type a message..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="p-2 rounded-full bg-blue-600 text-white mr-2"
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
