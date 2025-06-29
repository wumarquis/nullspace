'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, Share, Copy, X, MessageSquare, FileText, Calendar, Hash, Plus } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  week?: string;
}

interface CaptureItem {
  id: string;
  text: string;
  completed: boolean;
}

const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Weekly Planner',
    content: 'Planning content for the week',
    date: '2025',
    week: 'Week 3'
  },
  {
    id: '2',
    title: 'Project Goals',
    content: 'Setting up quarterly objectives',
    date: '2025'
  },
  {
    id: '3',
    title: 'Meeting Notes',
    content: 'Team sync discussion points',
    date: '2025'
  },
  {
    id: '4',
    title: 'Research Ideas',
    content: 'New concepts to explore',
    date: '2025'
  }
];

const samplePosts = [
  {
    id: '1',
    content: `Every goal begins with a gap:

• Where you are now.
• Where you want to be.

What bridges that gap?

Skills, systems, and solutions.

The problems in your way aren't obstacles—they're opportunities.`,
    hasMore: true
  },
  {
    id: '2',
    content: `Here's the logic:

→ Goals create focus.
They give your actions direction.

→ Problems create clarity.
They show you exactly what needs to change.

→ Skills create leverage.
They equip you to solve those problems.`,
    hasMore: true
  },
  {
    id: '3',
    content: `Once you solve your problem, you have something valuable:

→ A Story.
Your process becomes a map for others.

→ A Brand.`,
    hasMore: false
  }
];

const captureItems: CaptureItem[] = [
  { id: '1', text: 'Where you are now', completed: false },
  { id: '2', text: 'Where you want to be', completed: false }
];

export default function ReferenceMatchedApp() {
  const [selectedNote, setSelectedNote] = useState<Note>(sampleNotes[0]);
  const [showCapture, setShowCapture] = useState(true);
  const [captureText, setCaptureText] = useState('');

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-[#e0e0e0]">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#1e1e1e] border-r border-[#3a3a3a] flex flex-col">
        {/* Sidebar Header */}
        <div className="p-3 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-[#3a3a3a] rounded border border-[#4a4a4a] flex items-center justify-center">
              <FileText size={12} className="text-[#a0a0a0]" />
            </div>
            <span className="text-[#e0e0e0] text-sm font-medium">Notes</span>
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center gap-1 p-3 border-b border-[#3a3a3a]">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#2a2a2a] rounded">
            <ChevronLeft size={14} className="text-[#a0a0a0]" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#2a2a2a] rounded">
            <ChevronRight size={14} className="text-[#a0a0a0]" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#2a2a2a] rounded ml-auto">
            <Plus size={14} className="text-[#a0a0a0]" />
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {sampleNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`sidebar-item ${selectedNote.id === note.id ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-[#707070]" />
                <span className="text-xs">{note.date}</span>
                {note.week && <span className="text-xs text-[#707070]">• {note.week}</span>}
              </div>
              <div className="font-medium text-sm mt-1">{note.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Content Panel */}
        <div className="flex-1 content-area">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-[#a0a0a0]" />
              <span className="text-[#e0e0e0] font-medium">{selectedNote.title}</span>
              <span className="text-[#707070]">•</span>
              <span className="text-[#707070] text-sm">{selectedNote.date}</span>
              {selectedNote.week && (
                <>
                  <span className="text-[#707070]">•</span>
                  <span className="text-[#707070] text-sm">{selectedNote.week}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#2a2a2a] rounded">
                <MoreHorizontal size={16} className="text-[#a0a0a0]" />
              </button>
              <button className="p-2 hover:bg-[#2a2a2a] rounded">
                <Share size={16} className="text-[#a0a0a0]" />
              </button>
              <button className="p-2 hover:bg-[#2a2a2a] rounded">
                <Copy size={16} className="text-[#a0a0a0]" />
              </button>
            </div>
          </div>

          {/* Posts Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {samplePosts.map((post) => (
              <div key={post.id} className="post-content">
                <div className="whitespace-pre-line text-[#a0a0a0] text-sm leading-relaxed">
                  {post.content}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="post-button">
                    <MessageSquare size={12} />
                    Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capture Panel */}
        {showCapture && (
          <div className="w-80 bg-[#2a2a2a] border-l border-[#3a3a3a]">
            <div className="capture-header">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#4a9eff] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="capture-title">Capture</span>
              </div>
              <button 
                onClick={() => setShowCapture(false)}
                className="p-1 hover:bg-[#3a3a3a] rounded"
              >
                <X size={14} className="text-[#a0a0a0]" />
              </button>
            </div>

            <div className="capture-content">
              <div className="mb-4">
                <div className="text-[#a0a0a0] text-sm mb-2">Capturing to</div>
                <div className="text-[#e0e0e0] text-sm font-medium">{selectedNote.week || selectedNote.title}</div>
              </div>

              <div className="mb-4">
                <div className="text-[#e0e0e0] text-sm font-medium mb-3">Every goal begins with a gap:</div>
                {captureItems.map((item) => (
                  <div key={item.id} className="capture-item">
                    <span className="capture-bullet">-</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-[#707070] mb-2">
                  <span>10 characters</span>
                  <Hash size={12} />
                </div>
                <textarea
                  value={captureText}
                  onChange={(e) => setCaptureText(e.target.value)}
                  placeholder="Add a note or tag here..."
                  className="w-full h-20 dark-input text-sm resize-none rounded p-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}