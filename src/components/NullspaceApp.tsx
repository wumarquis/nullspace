'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import MainWorkspace from './MainWorkspace';
import { Note } from '../types/notes';

// Dummy data
const dummyNotes: Note[] = [
  {
    id: '1',
    title: 'AI Research Notes',
    content: '# AI Research Notes\n\n## Key Insights\n- Large language models are becoming more efficient\n- Multimodal AI is the next frontier\n- Edge computing will enable real-time AI applications',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    tags: ['ai', 'research', 'technology']
  },
  {
    id: '2',
    title: 'Product Strategy',
    content: '# Product Strategy Q1 2024\n\n## Goals\n1. Improve user engagement by 25%\n2. Launch new AI features\n3. Expand to mobile platform\n\n## Key Metrics\n- DAU: 50k\n- Retention: 65%',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    tags: ['strategy', 'product', 'goals']
  },
  {
    id: '3',
    title: 'Meeting Notes - Design Review',
    content: '# Design Review Meeting\n\n## Attendees\n- Sarah (Design Lead)\n- Mike (Engineering)\n- Alex (Product)\n\n## Decisions\n- Move forward with dark theme\n- Implement voice interface\n- Focus on mobile-first design',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    tags: ['meeting', 'design', 'decisions']
  }
];

export default function NullspaceApp() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(dummyNotes[0]);
  const [notes, setNotes] = useState<Note[]>(dummyNotes);
  const [autoNoteMode, setAutoNoteMode] = useState(true);

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
  };

  const handleNoteUpdate = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    if (selectedNote?.id === updatedNote.id) {
      setSelectedNote(updatedNote);
    }
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '# New Note\n\nStart writing...',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        notes={notes}
        selectedNote={selectedNote}
        onNoteSelect={handleNoteSelect}
        onCreateNote={handleCreateNote}
        autoNoteMode={autoNoteMode}
        onToggleAutoMode={setAutoNoteMode}
      />
      <MainWorkspace
        selectedNote={selectedNote}
        onNoteUpdate={handleNoteUpdate}
        autoNoteMode={autoNoteMode}
      />
    </div>
  );
}