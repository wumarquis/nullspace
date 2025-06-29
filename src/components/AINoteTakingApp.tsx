'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Menu, X, Search, FileText, Plus, Edit3, Save, Trash2, MessageSquare, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  noteId?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

// Dummy notes data
const dummyNotes: Note[] = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals',
    content: '# Machine Learning Fundamentals\n\n## Key Concepts\n- Supervised Learning: Learning from labeled data\n- Unsupervised Learning: Finding patterns in unlabeled data\n- Reinforcement Learning: Learning through rewards and penalties\n\n## Common Algorithms\n- Linear Regression\n- Decision Trees\n- Neural Networks\n- Support Vector Machines\n\n## Applications\n- Image recognition\n- Natural language processing\n- Recommendation systems\n- Autonomous vehicles',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
    tags: ['ml', 'ai', 'algorithms']
  },
  {
    id: '2',
    title: 'Project Planning Notes',
    content: '# Web Development Project Plan\n\n## Phase 1: Planning & Design\n- [ ] Requirements gathering\n- [ ] User research and personas\n- [ ] Wireframing\n- [ ] UI/UX design mockups\n\n## Phase 2: Development\n- [ ] Frontend setup (React/Next.js)\n- [ ] Backend API development\n- [ ] Database schema design\n- [ ] Authentication system\n\n## Phase 3: Testing & Deployment\n- [ ] Unit testing\n- [ ] Integration testing\n- [ ] Performance optimization\n- [ ] CI/CD pipeline setup',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 7200000),
    tags: ['project', 'planning', 'web-dev']
  },
  {
    id: '3',
    title: 'React Best Practices',
    content: '# React Best Practices\n\n## Component Design\n- Keep components small and focused\n- Use functional components with hooks\n- Implement proper prop validation with TypeScript\n- Follow single responsibility principle\n\n## State Management\n- Use local state when possible\n- Lift state up when sharing between components\n- Consider Context API for global state\n- Use reducers for complex state logic\n\n## Performance Optimization\n- Use React.memo for expensive components\n- Implement useMemo for expensive calculations\n- Use useCallback for function references\n- Avoid inline objects and functions in JSX',
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 14400000),
    tags: ['react', 'javascript', 'best-practices']
  }
];

// Initial conversation messages
const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I\'m your AI assistant. I can help you with your notes, answer questions, and even create new notes based on our conversations. How can I assist you today?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 1800000),
  }
];

export default function AINoteTakingApp() {
  const [notes, setNotes] = useState<Note[]>(dummyNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [editingNoteTitle, setEditingNoteTitle] = useState('');
  
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
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response with note integration
    setTimeout(() => {
      let aiResponse = '';
      let shouldCreateNote = false;
      let shouldUpdateNote = false;

      // Check if user is asking to create a note
      if (currentInput.toLowerCase().includes('create a note') || 
          currentInput.toLowerCase().includes('make a note') ||
          currentInput.toLowerCase().includes('save this as a note')) {
        shouldCreateNote = true;
        aiResponse = `I'll create a new note for you based on our conversation. Here's what I understand:\n\n"${currentInput}"\n\nI've created a new note with this information. You can find it in your notes sidebar and edit it further if needed.`;
      }
      // Check if user is asking to update current note
      else if (selectedNote && (currentInput.toLowerCase().includes('add to note') || 
               currentInput.toLowerCase().includes('update note') ||
               currentInput.toLowerCase().includes('add this to my note'))) {
        shouldUpdateNote = true;
        aiResponse = `I've added this information to your current note "${selectedNote.title}". The note has been updated with the new content from our conversation.`;
      }
      // Regular AI response
      else {
        aiResponse = generateContextualResponse(currentInput, selectedNote);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        noteId: selectedNote?.id
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);

      // Handle note creation or updates
      if (shouldCreateNote) {
        createNoteFromConversation(currentInput);
      } else if (shouldUpdateNote && selectedNote) {
        updateNoteFromConversation(selectedNote, currentInput);
      }
    }, 1500);
  };

  const generateContextualResponse = (input: string, currentNote: Note | null): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('machine learning') || lowerInput.includes('ml')) {
      return `Machine learning is a fascinating field! Here are some key points:\n\n**Core Concepts:**\n• **Supervised Learning**: Uses labeled data to train models\n• **Unsupervised Learning**: Finds patterns in unlabeled data\n• **Reinforcement Learning**: Learns through trial and error\n\n**Popular Algorithms:**\n• Linear/Logistic Regression\n• Decision Trees and Random Forests\n• Neural Networks and Deep Learning\n• Support Vector Machines\n\n${currentNote ? `I notice you have a note about "${currentNote.title}". Would you like me to add this information to it?` : 'Would you like me to create a note with this information?'}`;
    }
    
    if (lowerInput.includes('react') || lowerInput.includes('javascript')) {
      return `Great question about React! Here are some essential concepts:\n\n**Modern React Patterns:**\n• Functional components with hooks\n• Custom hooks for reusable logic\n• Context API for state management\n• Suspense for data fetching\n\n**Performance Tips:**\n• Use React.memo() for expensive components\n• Implement useMemo() and useCallback() strategically\n• Code splitting with React.lazy()\n• Avoid inline objects in JSX\n\n${currentNote ? `I can add this to your "${currentNote.title}" note if you'd like.` : 'Should I create a new note with these React tips?'}`;
    }
    
    if (lowerInput.includes('project') || lowerInput.includes('planning')) {
      return `Project planning is crucial for success! Here's a structured approach:\n\n**Planning Phase:**\n• Define clear objectives and scope\n• Identify stakeholders and requirements\n• Create timeline and milestones\n• Risk assessment and mitigation\n\n**Execution Phase:**\n• Break down tasks into manageable chunks\n• Set up communication channels\n• Regular progress reviews\n• Adapt and iterate based on feedback\n\n${currentNote ? `This could be a great addition to your "${currentNote.title}" note.` : 'Would you like me to create a project planning template note?'}`;
    }
    
    return `I understand you're asking about "${input}". Based on our conversation context${currentNote ? ` and your current note "${currentNote.title}"` : ''}, here's my response:\n\nThis is a simulated AI response that demonstrates the note-taking integration. In a real implementation, this would connect to advanced AI models that can:\n\n• Understand context from your notes\n• Generate relevant content\n• Suggest note updates\n• Create new notes automatically\n\n${currentNote ? 'I can help update your current note with relevant information.' : 'I can create a new note if this information would be useful to save.'}`;
  };

  const createNoteFromConversation = (content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: `Note from Conversation - ${new Date().toLocaleDateString()}`,
      content: `# AI Generated Note\n\n## From Conversation\n${content}\n\n## AI Response\n${messages[messages.length - 1]?.content || ''}\n\n---\n*Created automatically from AI conversation*`,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['ai-generated', 'conversation']
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
  };

  const updateNoteFromConversation = (note: Note, newContent: string) => {
    const updatedNote: Note = {
      ...note,
      content: `${note.content}\n\n## Added from Conversation - ${new Date().toLocaleString()}\n${newContent}`,
      updatedAt: new Date()
    };

    setNotes(prev => prev.map(n => n.id === note.id ? updatedNote : n));
    setSelectedNote(updatedNote);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setIsEditingNote(false);
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '# New Note\n\nStart writing your note here...',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditingNote(true);
    setEditingNoteTitle(newNote.title);
    setEditingNoteContent(newNote.content);
  };

  const handleEditNote = () => {
    if (selectedNote) {
      setIsEditingNote(true);
      setEditingNoteTitle(selectedNote.title);
      setEditingNoteContent(selectedNote.content);
    }
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      const updatedNote: Note = {
        ...selectedNote,
        title: editingNoteTitle,
        content: editingNoteContent,
        updatedAt: new Date()
      };

      setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n));
      setSelectedNote(updatedNote);
      setIsEditingNote(false);
    }
  };

  const handleDeleteNote = () => {
    if (selectedNote) {
      setNotes(prev => prev.filter(n => n.id !== selectedNote.id));
      setSelectedNote(null);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#1A1B1E]">
      {/* Notes Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden metallic-gradient border-r border-[#4A6FA5]/20`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#4A6FA5]/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#E5E5E5] tracking-tight">Notes</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCreateNote}
                  className="p-2 rounded-sm hover:bg-white/5 text-[#B0B0B0] hover:text-[#E5E5E5] tech-shadow hover:accent-glow"
                  title="Create new note"
                >
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
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#1A1B1E]/50 border border-[#4A6FA5]/20 rounded-sm text-[#E5E5E5] placeholder-[#B0B0B0] focus:border-[#4A6FA5]/50 focus:bg-[#1A1B1E]/80 tech-shadow"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleNoteSelect(note)}
                  className={`p-4 rounded-sm cursor-pointer group transition-all ${
                    selectedNote?.id === note.id
                      ? 'bg-[#4A6FA5]/20 border border-[#4A6FA5]/40 tech-shadow-lg'
                      : 'hover:bg-white/5 metallic-border hover:border-[#4A6FA5]/30 tech-shadow'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <FileText size={16} className={`mt-0.5 flex-shrink-0 ${
                      selectedNote?.id === note.id ? 'text-[#4A6FA5]' : 'text-[#B0B0B0] group-hover:text-[#4A6FA5]'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#E5E5E5] truncate group-hover:text-white">
                        {note.title}
                      </h3>
                      <p className="text-xs text-[#B0B0B0] mt-1 line-clamp-2 leading-relaxed">
                        {note.content.replace(/^#.*$/gm, '').trim().substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-[#B0B0B0]/70">
                          {note.updatedAt.toLocaleDateString()}
                        </p>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-[#4A6FA5]/20 text-[#4A6FA5] rounded-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Note Editor Panel */}
        {selectedNote && (
          <div className="w-1/2 border-r border-[#4A6FA5]/20 flex flex-col">
            {/* Note Header */}
            <div className="metallic-gradient border-b border-[#4A6FA5]/20 px-6 py-4 tech-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText size={16} className="text-[#4A6FA5]" />
                  {isEditingNote ? (
                    <input
                      type="text"
                      value={editingNoteTitle}
                      onChange={(e) => setEditingNoteTitle(e.target.value)}
                      className="text-sm font-medium bg-transparent border-none outline-none text-[#E5E5E5] focus:text-white"
                    />
                  ) : (
                    <h2 className="text-sm font-medium text-[#E5E5E5] tracking-tight">{selectedNote.title}</h2>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {isEditingNote ? (
                    <button
                      onClick={handleSaveNote}
                      className="p-2 rounded-sm hover:bg-white/5 text-[#4A6FA5] hover:text-[#4A6FA5] tech-shadow hover:accent-glow"
                      title="Save note"
                    >
                      <Save size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleEditNote}
                      className="p-2 rounded-sm hover:bg-white/5 text-[#B0B0B0] hover:text-[#E5E5E5] tech-shadow"
                      title="Edit note"
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                  <button
                    onClick={handleDeleteNote}
                    className="p-2 rounded-sm hover:bg-white/5 text-[#B0B0B0] hover:text-red-400 tech-shadow"
                    title="Delete note"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 p-6 bg-[#1A1B1E]">
              {isEditingNote ? (
                <textarea
                  value={editingNoteContent}
                  onChange={(e) => setEditingNoteContent(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-[#E5E5E5] resize-none font-mono text-sm leading-relaxed"
                  placeholder="Write your note here..."
                />
              ) : (
                <div className="h-full overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#E5E5E5] font-mono">
                      {selectedNote.content}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Panel */}
        <div className={`${selectedNote ? 'w-1/2' : 'w-full'} flex flex-col transition-all duration-300 ease-in-out`}>
          {/* Chat Header */}
          <div className="metallic-gradient border-b border-[#4A6FA5]/20 px-6 py-4 tech-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-sm hover:bg-white/5 text-[#B0B0B0] hover:text-[#E5E5E5] mr-2 tech-shadow"
                  >
                    <Menu size={16} />
                  </button>
                )}
                <MessageSquare size={16} className="text-[#4A6FA5]" />
                <h2 className="text-sm font-medium text-[#E5E5E5] tracking-tight">
                  AI Assistant {selectedNote && `• ${selectedNote.title}`}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#4A6FA5] rounded-full subtle-glow"></div>
                <span className="text-xs text-[#B0B0B0]">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-[#1A1B1E]">
            <div className="px-6 py-8">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${message.role === 'user' ? '' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-[#4A6FA5] text-white' 
                        : 'metallic-border text-[#4A6FA5]'
                    } tech-shadow`}>
                      {message.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-[#E5E5E5]">
                          {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <span className="text-xs text-[#B0B0B0]">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-sm leading-relaxed text-[#E5E5E5] whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 metallic-border text-[#4A6FA5] tech-shadow">
                      <Bot size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-[#E5E5E5]">AI Assistant</span>
                      </div>
                      <div className="flex space-x-1">
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
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedNote ? `Ask about "${selectedNote.title}" or request note updates...` : "Ask me anything or request to create a note..."}
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
              <span>Try: "Create a note about...", "Add this to my note", or ask questions</span>
              <span className="tabular-nums">{inputValue.length} characters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}