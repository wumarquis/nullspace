'use client';

import { useState } from 'react';
import NoteEditor from './NoteEditor';
import ChatInterface from './ChatInterface';
import { Note } from '../types/notes';

interface MainWorkspaceProps {
  selectedNote: Note | null;
  onNoteUpdate: (note: Note) => void;
  autoNoteMode: boolean;
}

export default function MainWorkspace({
  selectedNote,
  onNoteUpdate,
  autoNoteMode
}: MainWorkspaceProps) {
  const [showNoteEditor, setShowNoteEditor] = useState(true);

  if (!selectedNote) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full glass flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-50" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-300">Welcome to Nullspace</h2>
          <p className="text-gray-400">Select a note to start your AI-powered workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {/* Note Editor */}
      {showNoteEditor && (
        <div className="w-1/2 border-r border-white/10">
          <NoteEditor
            note={selectedNote}
            onNoteUpdate={onNoteUpdate}
            onClose={() => setShowNoteEditor(false)}
          />
        </div>
      )}

      {/* Chat Interface */}
      <div className={`${showNoteEditor ? 'w-1/2' : 'w-full'} flex flex-col`}>
        <ChatInterface
          note={selectedNote}
          autoNoteMode={autoNoteMode}
          onNoteUpdate={onNoteUpdate}
          showNoteEditor={showNoteEditor}
          onToggleNoteEditor={() => setShowNoteEditor(!showNoteEditor)}
        />
      </div>
    </div>
  );
}