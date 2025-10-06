
import React from 'react';
import type { Message } from '../types';
import { User, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
    </div>
);


export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === 'user';

  const bubbleClasses = isUser
    ? 'bg-brand-blue text-white rounded-br-none'
    : 'bg-white/20 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-bl-none backdrop-blur-sm';
  
  const layoutClasses = isUser ? 'justify-end' : 'justify-start';
  
  const Avatar: React.FC = () => (
    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-brand-purple' : 'bg-gray-600'}`}>
      {isUser ? <User size={18} className="text-white"/> : <Sparkles size={18} className="text-white"/>}
    </div>
  );

  return (
    <div className={`flex items-end gap-3 ${layoutClasses}`}>
      {!isUser && <Avatar />}
      <div className={`p-4 max-w-xl rounded-2xl ${bubbleClasses}`}>
        {isLoading ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{message.text}</p>}
      </div>
      {isUser && <Avatar />}
    </div>
  );
};
