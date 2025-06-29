'use client';

import { useState, useEffect } from 'react';
import { X, Save, Hash, Calendar } from 'lucide-react';
import { Note } from '../types/notes';
import { format } from 'date-fns';

interface NoteEditorProps {
  note: Note;
  onNoteUpdate: (note: Note) => void;
  onClose: () => void;
}

export default function NoteEditor({ note, onNoteUpdate, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags.join(', '));
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(', '));
    setHasChanges(false);
  }, [note]);

  useEffect(() => {
    const changed = title !== note.title || content !== note.content || tags !== note.tags.join(', ');
    setHasChanges(changed);
  }, [title, content, tags, note]);

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedAt: new Date()
    };
    onNoteUpdate(updatedNote);
    setHasChanges(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50">
      {/* Header */}
      <div className="p-6 border-b border-white/10 glass-dark">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold bg-transparent border-none outline-none text-white flex-1 mr-4"
            placeholder="Note title..."
          />
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <button
                onClick={handleSave}
                className="p-2 rounded-lg glass hover:glow-blue transition-all duration-200"
                title="Save (⌘S)"
              >
                <Save size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {format(note.updatedAt, 'MMM d, yyyy • h:mm a')}
          </div>
          {hasChanges && (
            <span className="text-yellow-400">• Unsaved changes</span>
          )}
        </div>

        {/* Tags */}
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <Hash size={14} className="mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Tags</span>
          </div>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags separated by commas..."
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex-1 p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start writing your note..."
          className="w-full h-full bg-transparent border-none outline-none text-white resize-none font-mono text-sm leading-relaxed"
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 glass-dark">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{content.length} characters</span>
          <span>⌘S to save</span>
        </div>
      </div>
    </div>
  );
}