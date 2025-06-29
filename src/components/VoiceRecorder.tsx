'use client';

import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useDeepgram } from '../lib/contexts/DeepgramContext';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
}

export default function VoiceRecorder({ 
  onTranscription, 
  isRecording, 
  onRecordingChange 
}: VoiceRecorderProps) {
  const { connectToDeepgram, disconnectFromDeepgram, realtimeTranscript } = useDeepgram();

  const handleToggleRecording = async () => {
    if (isRecording) {
      disconnectFromDeepgram();
      if (realtimeTranscript) {
        onTranscription(realtimeTranscript);
      }
      onRecordingChange(false);
    } else {
      await connectToDeepgram();
      onRecordingChange(true);
    }
  };

  return (
    <button
      onClick={handleToggleRecording}
      className={`p-3 rounded-full transition-all duration-200 ${
        isRecording
          ? 'bg-red-600 hover:bg-red-700 pulse-glow'
          : 'bg-white/10 hover:bg-white/20'
      }`}
      title={isRecording ? 'Stop recording' : 'Start voice recording'}
    >
      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
}