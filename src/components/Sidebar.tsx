'use client';

import { useState } from 'react';
import { Search, Plus, Settings, FileText, Hash, Calendar } from 'lucide-react';
import { Note } from '../types/notes';
import { format } from 'date-fns';

interface SidebarProps {
  notes: Note[];
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onCreateNote: () => void;
  autoNoteMode: boolean;
  onToggleAutoMode: (enabled: boolean) => void;
}

export default function Sidebar({
  notes,
  selectedNote,
  onNoteSelect,
  onCreateNote,
  autoNoteMode,
  onToggleAutoMode
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 h-full glass-dark border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Nullspace
          </h1>
          <button
            onClick={onCreateNote}
            className="p-2 rounded-lg glass hover:glow-purple transition-all duration-200"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Auto Note Mode</span>
          <button
            onClick={() => onToggleAutoMode(!autoNoteMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              autoNoteMode ? 'bg-purple-600' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                autoNoteMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {autoNoteMode 
            ? 'AI responses automatically added to notes'
            : 'Manually select messages to add to notes'
          }
        </p>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onNoteSelect(note)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 group ${
                selectedNote?.id === note.id
                  ? 'glass glow-purple'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white truncate flex-1">
                  {note.title}
                </h3>
                <FileText size={16} className="text-gray-400 ml-2 flex-shrink-0" />
              </div>
              
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                {note.content.replace(/^#.*$/gm, '').trim().substring(0, 100)}...
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {format(note.updatedAt, 'MMM d')}
                </div>
                {note.tags.length > 0 && (
                  <div className="flex items-center">
                    <Hash size={12} className="mr-1" />
                    {note.tags[0]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center w-full p-3 rounded-lg hover:bg-white/5 transition-colors">
          <Settings size={18} className="mr-3 text-gray-400" />
          <span className="text-sm text-gray-300">Settings</span>
        </button>
      </div>
    </div>
  );
}