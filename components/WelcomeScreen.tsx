
import React from 'react';
import { Sparkles, MessageSquarePlus } from 'lucide-react';

interface WelcomeScreenProps {
  onNewConversation: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNewConversation }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.3),rgba(255,255,255,0))]">
      <div className="w-24 h-24 mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-brand-blue to-brand-purple">
        <Sparkles size={48} className="text-white" />
      </div>
      <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">Welcome to Easit AI</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Your intelligent voice assistant. Start a new conversation to ask questions, get help, and more.
      </p>
      <button
        onClick={onNewConversation}
        className="flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold bg-brand-blue text-white hover:bg-brand-blue/90 transition-transform transform hover:scale-105"
      >
        <MessageSquarePlus size={22} />
        Start New Chat
      </button>
    </div>
  );
};
