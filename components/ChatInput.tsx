
import React, { useState, useCallback, useEffect } from 'react';
import { Mic, Send, Square } from 'lucide-react';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { GeminiLiveStatus } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendVoiceMessage: (userText: string, aiText: string) => void;
  isLoading: boolean;
}

const MicButton: React.FC<{ status: GeminiLiveStatus; onClick: () => void }> = ({ status, onClick }) => {
    const getIcon = () => {
        switch (status) {
            case GeminiLiveStatus.LISTENING:
                return <Square size={20} className="text-white" />;
            case GeminiLiveStatus.CONNECTING:
                return <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>;
            default:
                return <Mic size={20} className="text-white" />;
        }
    };
    
    const getPulseClass = () => {
        if (status === GeminiLiveStatus.LISTENING) {
            return 'animate-pulse';
        }
        return '';
    };

    return (
        <button
            onClick={onClick}
            aria-label={status === GeminiLiveStatus.LISTENING ? 'Stop recording' : 'Start recording'}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${status === GeminiLiveStatus.LISTENING ? 'bg-red-500' : 'bg-brand-blue hover:bg-brand-blue/90'} ${getPulseClass()}`}
        >
            {getIcon()}
        </button>
    );
};


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onSendVoiceMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const { status, userTranscript, aiTranscript, startSession, stopSession, error } = useGeminiLive();

  useEffect(() => {
    if (status === GeminiLiveStatus.LISTENING) {
      setInputText(userTranscript);
    }
  }, [userTranscript, status]);

  const handleSend = () => {
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };
  
  const handleMicToggle = useCallback(() => {
    if (status === GeminiLiveStatus.IDLE || status === GeminiLiveStatus.ERROR) {
      startSession({
        onTurnComplete: (finalUserTranscript, finalAiTranscript) => {
          if (finalUserTranscript.trim() || finalAiTranscript.trim()) {
            onSendVoiceMessage(finalUserTranscript, finalAiTranscript);
          }
          setInputText('');
        }
      });
    } else {
      stopSession();
    }
  }, [status, startSession, stopSession, onSendVoiceMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg border-t border-white/20 dark:border-gray-700/50">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={status === GeminiLiveStatus.LISTENING ? 'Listening...' : 'Type a message or use the mic...'}
            disabled={isLoading || status === GeminiLiveStatus.LISTENING || status === GeminiLiveStatus.CONNECTING}
            className="w-full h-12 px-4 pr-12 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
            aria-label="Chat input"
          />
           <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-white bg-brand-purple hover:bg-brand-purple/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
           >
             <Send size={18} />
           </button>
        </div>
        <MicButton status={status} onClick={handleMicToggle} />
      </div>
      {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
      {status === GeminiLiveStatus.LISTENING && aiTranscript && <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-2" aria-live="polite">Easit: "{aiTranscript}"</p>}
    </div>
  );
};
