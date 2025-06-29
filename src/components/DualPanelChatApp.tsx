'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Menu, X, Search, MessageSquare, Plus, MoreVertical, Archive } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: string;
  updatedAt: Date;
  isArchived?: boolean;
}

// Dummy conversations data
const dummyConversations: Conversation[] = [
  {
    id: '1',
    title: 'Machine Learning Discussion',
    lastMessage: 'Can you explain neural networks?',
    updatedAt: new Date(Date.now() - 3600000),
    messages: [
      {
        id: '1-1',
        content: 'Can you explain neural networks?',
        role: 'user',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '1-2',
        content: 'Neural networks are computational models inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information through weighted connections.\n\nKey components:\n• **Input Layer**: Receives data\n• **Hidden Layers**: Process information\n• **Output Layer**: Produces results\n• **Weights & Biases**: Determine connection strength\n\nThey learn by adjusting these weights through training on data.',
        role: 'assistant',
        timestamp: new Date(Date.now() - 3500000),
      },
    ],
  },
  {
    id: '2',
    title: 'Project Planning',
    lastMessage: 'What are the key milestones?',
    updatedAt: new Date(Date.now() - 7200000),
    messages: [
      {
        id: '2-1',
        content: 'I need help planning a web development project.',
        role: 'user',
        timestamp: new Date(Date.now() - 8000000),
      },
      {
        id: '2-2',
        content: 'I\'d be happy to help you plan your web development project! Let\'s break it down into phases:\n\n**Phase 1: Planning & Design**\n• Requirements gathering\n• User research\n• Wireframing\n• UI/UX design\n\n**Phase 2: Development**\n• Frontend development\n• Backend development\n• Database setup\n• API integration\n\n**Phase 3: Testing & Deployment**\n• Unit testing\n• Integration testing\n• Performance optimization\n• Deployment setup\n\nWhat type of web application are you building?',
        role: 'assistant',
        timestamp: new Date(Date.now() - 7800000),
      },
      {
        id: '2-3',
        content: 'What are the key milestones?',
        role: 'user',
        timestamp: new Date(Date.now() - 7200000),
      },
    ],
  },
  {
    id: '3',
    title: 'Code Review Help',
    lastMessage: 'Thanks for the optimization tips!',
    updatedAt: new Date(Date.now() - 14400000),
    messages: [
      {
        id: '3-1',
        content: 'Can you review this React component for performance issues?',
        role: 'user',
        timestamp: new Date(Date.now() - 15000000),
      },
      {
        id: '3-2',
        content: 'I\'d be happy to help review your React component! Here are some common performance optimization strategies:\n\n**Memoization**\n• Use React.memo for component memoization\n• Use useMemo for expensive calculations\n• Use useCallback for function references\n\n**State Management**\n• Minimize state updates\n• Use local state when possible\n• Consider state colocation\n\n**Rendering Optimization**\n• Avoid inline objects and functions\n• Use keys properly in lists\n• Implement virtual scrolling for large lists\n\nCould you share the specific component code?',
        role: 'assistant',
        timestamp: new Date(Date.now() - 14800000),
      },
      {
        id: '3-3',
        content: 'Thanks for the optimization tips!',
        role: 'user',
        timestamp: new Date(Date.now() - 14400000),
      },
    ],
  },
];

// AI Chat messages
const aiChatMessages: Message[] = [
  {
    id: 'ai-1',
    content: 'Hello! I\'m your AI assistant. How can I help you today?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: 'ai-2',
    content: 'I\'d like to learn about React best practices.',
    role: 'user',
    timestamp: new Date(Date.now() - 1700000),
  },
  {
    id: 'ai-3',
    content: 'Great choice! React best practices help you write maintainable, performant applications. Here are the key areas:\n\n**Component Design**\n• Keep components small and focused\n• Use functional components with hooks\n• Implement proper prop validation\n\n**State Management**\n• Use local state when possible\n• Lift state up when needed\n• Consider context for global state\n\n**Performance**\n• Implement code splitting\n• Use React.memo strategically\n• Optimize re-renders\n\nWhich area would you like to explore further?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 1600000),
  },
];

export default function DualPanelChatApp() {
  const [conversations, setConversations] = useState<Conversation[]>(dummyConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [aiMessages, setAiMessages] = useState<Message[]>(aiChatMessages);
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);
  const [aiInputValue, setAiInputValue] = useState('');
  const [selectedInputValue, setSelectedInputValue] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSelectedLoading, setIsSelectedLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);
  const selectedMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(aiMessagesEndRef);
  }, [aiMessages]);

  useEffect(() => {
    scrollToBottom(selectedMessagesEndRef);
  }, [selectedMessages]);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setSelectedMessages([...conversation.messages]);
  };

  const handleConversationClose = () => {
    setSelectedConversation(null);
    setSelectedMessages([]);
  };

  const handleAiSendMessage = async () => {
    if (!aiInputValue.trim() || isAiLoading) return;

    const userMessage: Message = {
      id: `ai-${Date.now()}`,
      content: aiInputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiInputValue('');
    setIsAiLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now() + 1}`,
        content: `I understand you're asking about "${aiInputValue}". This is a simulated AI response demonstrating the dual-panel chat interface. The system maintains separate conversation threads while providing seamless interaction across both panels.`,
        role: 'assistant',
        timestamp: new Date(),
      };

      setAiMessages(prev => [...prev, aiResponse]);
      setIsAiLoading(false);
    }, 1500);
  };

  const handleSelectedSendMessage = async () => {
    if (!selectedInputValue.trim() || isSelectedLoading || !selectedConversation) return;

    const userMessage: Message = {
      id: `${selectedConversation.id}-${Date.now()}`,
      content: selectedInputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setSelectedMessages(prev => [...prev, userMessage]);
    setSelectedInputValue('');
    setIsSelectedLoading(true);

    // Update conversation in the list
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, messages: [...conv.messages, userMessage], lastMessage: selectedInputValue, updatedAt: new Date() }
        : conv
    ));

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `${selectedConversation.id}-${Date.now() + 1}`,
        content: `Continuing our conversation about "${selectedConversation.title}". This response demonstrates how the selected chat maintains its own context and conversation flow independently from the main AI chat.`,
        role: 'assistant',
        timestamp: new Date(),
      };

      setSelectedMessages(prev => [...prev, aiResponse]);
      setIsSelectedLoading(false);

      // Update conversation in the list
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, messages: [...conv.messages, userMessage, aiResponse], lastMessage: aiResponse.content.substring(0, 50) + '...', updatedAt: new Date() }
          : conv
      ));
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent, isAiChat: boolean) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isAiChat) {
        handleAiSendMessage();
      } else {
        handleSelectedSendMessage();
      }
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ChatPanel = ({ 
    messages, 
    inputValue, 
    setInputValue, 
    onSendMessage, 
    isLoading, 
    title, 
    messagesEndRef, 
    isAiChat = false,
    onClose 
  }: {
    messages: Message[];
    inputValue: string;
    setInputValue: (value: string) => void;
    onSendMessage: () => void;
    isLoading: boolean;
    title: string;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    isAiChat?: boolean;
    onClose?: () => void;
  }) => (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="metallic-gradient border-b border-[#4A6FA5]/20 px-6 py-4 tech-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare size={16} className="text-[#4A6FA5]" />
            <h2 className="text-sm font-medium text-[#E5E5E5] tracking-tight">{title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            {!isAiChat && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-sm hover:bg-white/5 text-[#B0B0B0] hover:text-[#E5E5E5] tech-shadow"
              >
                <X size={14} />
              </button>
            )}
            <div className="w-1.5 h-1.5 bg-[#4A6FA5] rounded-full subtle-glow"></div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#1A1B1E]">
        <div className="px-4 py-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-sm px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[#4A6FA5] text-white tech-shadow-lg'
                        : 'metallic-border text-[#E5E5E5] tech-shadow'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                  <div className={`text-xs text-[#B0B0B0] mt-1.5 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="metallic-border rounded-sm px-4 py-3 max-w-xs tech-shadow">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-[#4A6FA5] rounded-full animate-bounce opacity-60" />
                    <div className="w-1.5 h-1.5 bg-[#4A6FA5] rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1.5 h-1.5 bg-[#4A6FA5] rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="metallic-gradient border-t border-[#4A6FA5]/20 p-4 tech-shadow">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, isAiChat)}
              placeholder="Type your message..."
              className="w-full px-3 py-2.5 pr-12 bg-[#1A1B1E]/50 border border-[#4A6FA5]/20 rounded-sm resize-none text-[#E5E5E5] placeholder-[#B0B0B0] focus:border-[#4A6FA5]/50 focus:bg-[#1A1B1E]/80 max-h-24 text-sm tech-shadow"
              rows={1}
            />
            <button
              onClick={onSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 rounded-sm bg-[#4A6FA5] hover:bg-[#4A6FA5]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all tech-shadow-lg hover:accent-glow"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#1A1B1E]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden metallic-gradient border-r border-[#4A6FA5]/20`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#4A6FA5]/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#E5E5E5] tracking-tight">Conversations</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-sm hover:bg-white/5 text-[#B0B0B0] hover:text-[#E5E5E5] tech-shadow">
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-sm hover:bg-white/5 text-[#B0B0B0] hover:text-[#E5E5E5] tech-shadow"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" size={14} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#1A1B1E]/50 border border-[#4A6FA5]/20 rounded-sm text-[#E5E5E5] placeholder-[#B0B0B0] focus:border-[#4A6FA5]/50 focus:bg-[#1A1B1E]/80 tech-shadow"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`p-3 rounded-sm cursor-pointer group transition-all ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-[#4A6FA5]/20 border border-[#4A6FA5]/40 tech-shadow-lg'
                      : 'hover:bg-white/5 metallic-border hover:border-[#4A6FA5]/30 tech-shadow'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#E5E5E5] truncate group-hover:text-white">
                        {conversation.title}
                      </h3>
                      <p className="text-xs text-[#B0B0B0] mt-1 line-clamp-2 leading-relaxed">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-[#B0B0B0]/70 mt-2">
                        {conversation.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <button className="p-1 rounded-sm hover:bg-white/10 text-[#B0B0B0] hover:text-[#E5E5E5] opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
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
              <h1 className="text-lg font-medium text-[#E5E5E5] tracking-tight">
                {selectedConversation ? 'Dual Chat Mode' : 'AI Assistant'}
              </h1>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#4A6FA5] rounded-full subtle-glow"></div>
              <span className="text-xs text-[#B0B0B0]">Online</span>
            </div>
          </div>
        </div>

        {/* Chat Panels */}
        <div className="flex-1 flex">
          {/* AI Chat Panel */}
          <div className={`${selectedConversation ? 'w-1/2 border-r border-[#4A6FA5]/20' : 'w-full'} transition-all duration-300 ease-in-out`}>
            <ChatPanel
              messages={aiMessages}
              inputValue={aiInputValue}
              setInputValue={setAiInputValue}
              onSendMessage={handleAiSendMessage}
              isLoading={isAiLoading}
              title="AI Assistant"
              messagesEndRef={aiMessagesEndRef}
              isAiChat={true}
            />
          </div>

          {/* Selected Conversation Panel */}
          {selectedConversation && (
            <div className="w-1/2 transition-all duration-300 ease-in-out">
              <ChatPanel
                messages={selectedMessages}
                inputValue={selectedInputValue}
                setInputValue={setSelectedInputValue}
                onSendMessage={handleSelectedSendMessage}
                isLoading={isSelectedLoading}
                title={selectedConversation.title}
                messagesEndRef={selectedMessagesEndRef}
                onClose={handleConversationClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}