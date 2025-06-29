'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Menu, X, Search, FileText, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

// Dummy data
const dummyMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    content: 'I need help understanding machine learning concepts.',
    role: 'user',
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: '3',
    content: 'I\'d be happy to help you understand machine learning! Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.\n\nHere are the key concepts:\n\n**Supervised Learning**: Learning from labeled examples\n**Unsupervised Learning**: Finding patterns in unlabeled data\n**Reinforcement Learning**: Learning through trial and error with rewards\n\nWhat specific aspect would you like to explore further?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 3400000),
  },
];

const dummyNotes: Note[] = [
  {
    id: '1',
    title: 'Machine Learning Basics',
    content: 'Key concepts and definitions for ML fundamentals...',
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '2',
    title: 'Project Ideas',
    content: 'Collection of interesting project concepts to explore...',
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: '3',
    title: 'Research Notes',
    content: 'Important findings and references from recent papers...',
    updatedAt: new Date(Date.now() - 259200000),
  },
  {
    id: '4',
    title: 'Algorithm Analysis',
    content: 'Performance comparisons and optimization strategies...',
    updatedAt: new Date(Date.now() - 345600000),
  },
  {
    id: '5',
    title: 'Data Processing Pipeline',
    content: 'ETL processes and data transformation workflows...',
    updatedAt: new Date(Date.now() - 432000000),
  },
];

export default function MinimalChatApp() {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notes] = useState<Note[]>(dummyNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${inputValue}". This is a simulated response that demonstrates the sleek dark theme interface design. The actual implementation would connect to your preferred AI service with sophisticated processing capabilities.`,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#1A1B1E]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden metallic-gradient border-r border-[#4A6FA5]/20`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#4A6FA5]/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#E5E5E5] tracking-tight">Notes</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-sm hover:bg-white/5 text-[#B0B0B0] hover:text-[#E5E5E5] tech-shadow"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" size={14} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#1A1B1E]/50 border border-[#4A6FA5]/20 rounded-sm text-[#E5E5E5] placeholder-[#B0B0B0] focus:border-[#4A6FA5]/50 focus:bg-[#1A1B1E]/80 tech-shadow"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-sm hover:bg-white/5 cursor-pointer group metallic-border hover:border-[#4A6FA5]/30 tech-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <FileText size={14} className="text-[#B0B0B0] group-hover:text-[#4A6FA5] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#E5E5E5] truncate group-hover:text-white">
                        {note.title}
                      </h3>
                      <p className="text-xs text-[#B0B0B0] mt-1 line-clamp-2 leading-relaxed">
                        {note.content}
                      </p>
                      <p className="text-xs text-[#B0B0B0]/70 mt-2">
                        {note.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="metallic-gradient border-b border-[#4A6FA5]/20 px-6 py-4 tech-shadow">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-sm hover:bg-white/5 text-[#B0B0B0] hover:text-[#E5E5E5] mr-4 tech-shadow"
            >
              <Menu size={16} />
            </button>
            <div className="flex items-center space-x-3">
              <MessageSquare size={18} className="text-[#4A6FA5]" />
              <h1 className="text-lg font-medium text-[#E5E5E5] tracking-tight">AI Assistant</h1>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#4A6FA5] rounded-full subtle-glow"></div>
              <span className="text-xs text-[#B0B0B0]">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-[#1A1B1E]">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="space-y-8">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-sm px-5 py-4 ${
                        message.role === 'user'
                          ? 'bg-[#4A6FA5] text-white tech-shadow-lg'
                          : 'metallic-border text-[#E5E5E5] tech-shadow'
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap font-normal">
                        {message.content}
                      </div>
                    </div>
                    <div className={`text-xs text-[#B0B0B0] mt-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="metallic-border rounded-sm px-5 py-4 max-w-xs tech-shadow">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-[#4A6FA5] rounded-full animate-bounce opacity-60" />
                      <div className="w-2 h-2 bg-[#4A6FA5] rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-[#4A6FA5] rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="metallic-gradient border-t border-[#4A6FA5]/20 p-6 tech-shadow">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 pr-14 bg-[#1A1B1E]/50 border border-[#4A6FA5]/20 rounded-sm resize-none text-[#E5E5E5] placeholder-[#B0B0B0] focus:border-[#4A6FA5]/50 focus:bg-[#1A1B1E]/80 max-h-32 tech-shadow"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 bottom-2 p-2.5 rounded-sm bg-[#4A6FA5] hover:bg-[#4A6FA5]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all tech-shadow-lg hover:accent-glow"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3 text-xs text-[#B0B0B0]">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span className="tabular-nums">{inputValue.length} characters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}