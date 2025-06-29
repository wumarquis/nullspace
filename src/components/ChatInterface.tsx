'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';
import { Note } from '../types/notes';
import ChatMessage from './ChatMessage';
import VoiceRecorder from './VoiceRecorder';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  canAddToNote?: boolean;
}

interface ChatInterfaceProps {
  note: Note;
  autoNoteMode: boolean;
  onNoteUpdate: (note: Note) => void;
  showNoteEditor: boolean;
  onToggleNoteEditor: () => void;
}

// Dummy conversation data
const dummyMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I see you\'re working on AI Research Notes. How can I help you expand on this topic?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 3600000),
    canAddToNote: true
  },
  {
    id: '2',
    content: 'Can you help me understand the latest trends in multimodal AI?',
    role: 'user',
    timestamp: new Date(Date.now() - 3500000)
  },
  {
    id: '3',
    content: 'Multimodal AI is indeed a fascinating area! Here are the key trends:\n\n1. **Vision-Language Models**: Models like GPT-4V and DALL-E 3 are becoming more sophisticated at understanding and generating both text and images.\n\n2. **Audio Integration**: Real-time speech processing and generation are being integrated into AI systems.\n\n3. **Video Understanding**: AI systems are getting better at processing and understanding video content.\n\n4. **Cross-modal Learning**: Models are learning to transfer knowledge between different modalities more effectively.',
    role: 'assistant',
    timestamp: new Date(Date.now() - 3400000),
    canAddToNote: true
  }
];

export default function ChatInterface({
  note,
  autoNoteMode,
  onNoteUpdate,
  showNoteEditor,
  onToggleNoteEditor
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${inputValue}". This is a simulated response that would normally come from your AI model. In a real implementation, this would connect to your OpenAI or Anthropic API.`,
        role: 'assistant',
        timestamp: new Date(),
        canAddToNote: true
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

      // Auto-add to note if enabled
      if (autoNoteMode) {
        handleAddToNote(aiResponse);
      }
    }, 1500);
  };

  const handleAddToNote = (message: Message) => {
    const updatedContent = note.content + `\n\n## AI Insight - ${message.timestamp.toLocaleString()}\n\n${message.content}`;
    const updatedNote: Note = {
      ...note,
      content: updatedContent,
      updatedAt: new Date()
    };
    onNoteUpdate(updatedNote);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/30">
      {/* Header */}
      <div className="p-4 border-b border-white/10 glass-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleNoteEditor}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title={showNoteEditor ? 'Hide note editor' : 'Show note editor'}
            >
              {showNoteEditor ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <div>
              <h2 className="font-semibold text-white">AI Assistant</h2>
              <p className="text-sm text-gray-400">Connected to {note.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 pulse-glow' : 'bg-green-400'}`} />
            <span className="text-xs text-gray-400">
              {isLoading ? 'Thinking...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onAddToNote={handleAddToNote}
            autoNoteMode={autoNoteMode}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl p-4 max-w-xs">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 glass-dark">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your notes..."
              className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-2xl resize-none focus:border-purple-500/50 transition-colors max-h-32"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          
          <VoiceRecorder
            onTranscription={(text) => setInputValue(text)}
            isRecording={isRecording}
            onRecordingChange={setIsRecording}
          />
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className={`flex items-center ${autoNoteMode ? 'text-purple-400' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${autoNoteMode ? 'bg-purple-400' : 'bg-gray-500'}`} />
            Auto-note {autoNoteMode ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  );
}