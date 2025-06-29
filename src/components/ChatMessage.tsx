'use client';

import { useState } from 'react';
import { Plus, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  canAddToNote?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onAddToNote: (message: Message) => void;
  autoNoteMode: boolean;
}

export default function ChatMessage({ message, onAddToNote, autoNoteMode }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [addedToNote, setAddedToNote] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToNote = () => {
    onAddToNote(message);
    setAddedToNote(true);
    setTimeout(() => setAddedToNote(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl p-4 ${
            isUser
              ? 'bg-purple-600 text-white'
              : 'glass text-white'
          } relative`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
          
          {/* Message actions */}
          <div className={`absolute top-2 ${isUser ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1`}>
            <button
              onClick={handleCopy}
              className="p-1 rounded bg-black/20 hover:bg-black/40 transition-colors"
              title="Copy message"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
            
            {message.canAddToNote && !autoNoteMode && (
              <button
                onClick={handleAddToNote}
                className={`p-1 rounded transition-colors ${
                  addedToNote 
                    ? 'bg-green-600 text-white' 
                    : 'bg-black/20 hover:bg-black/40'
                }`}
                title="Add to note"
              >
                {addedToNote ? <Check size={12} /> : <Plus size={12} />}
              </button>
            )}
          </div>
        </div>
        
        <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {format(message.timestamp, 'h:mm a')}
          {message.canAddToNote && autoNoteMode && (
            <span className="ml-2 text-purple-400">• Auto-added to note</span>
          )}
        </div>
      </div>
    </div>
  );
}