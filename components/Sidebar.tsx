
import React, { useState } from 'react';
import type { Conversation } from '../types';
import { MessageSquarePlus, MessageSquareText, Search } from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
}) => {
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStartEditing = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingConversationId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleRename = () => {
    if (editingConversationId && editingTitle.trim() && editingTitle.trim() !== conversations.find(c => c.id === editingConversationId)?.title) {
      onRenameConversation(editingConversationId, editingTitle.trim());
    }
    setEditingConversationId(null);
    setEditingTitle('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditingConversationId(null);
      setEditingTitle('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-64 bg-white/5 dark:bg-gray-800/20 backdrop-blur-lg border-r border-white/10 dark:border-gray-700/50 flex flex-col p-2">
      <div className="flex items-center justify-between p-2 mb-2">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple">
          Easit AI
        </h1>
      </div>
      <button
        onClick={onNewConversation}
        className="flex items-center gap-2 w-full p-2.5 rounded-lg text-sm font-semibold bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors duration-200"
      >
        <MessageSquarePlus size={18} />
        New Chat
      </button>

      <div className="relative my-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 px-4 pl-10 rounded-lg text-sm bg-gray-200/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors"
          aria-label="Search conversations"
        />
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1 pr-1">
        {conversations.length > 0 ? (
          filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <a
                key={conv.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectConversation(conv.id);
                }}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg text-sm transition-colors duration-200 ${
                  activeConversationId === conv.id
                    ? 'bg-brand-blue/20 text-brand-blue dark:text-white'
                    : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <MessageSquareText size={18} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                  {editingConversationId === conv.id ? (
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={handleRename}
                      onKeyDown={handleKeyDown}
                      className="w-full text-sm font-medium bg-transparent p-0 border-0 border-b border-brand-blue text-gray-800 dark:text-white focus:outline-none focus:ring-0"
                      autoFocus
                    />
                  ) : (
                    <p
                      className="text-sm font-medium truncate"
                      onClick={(e) => handleStartEditing(e, conv)}
                      title="Click to rename"
                    >
                      {conv.title}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {timeAgo(conv.createdAt)}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 p-4 mt-4">
              No results found.
            </div>
          )
        ) : (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 p-4 mt-4">
            No past conversations. Start a new chat to begin!
          </div>
        )}
      </nav>
      <div className="mt-auto p-2 border-t border-white/10 dark:border-gray-700/50">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Easit AI Voice Assistant v1.0
        </p>
      </div>
    </aside>
  );
};
