
import React, { useState, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { Header } from './components/Header';
import type { Conversation, Message } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WelcomeScreen } from './components/WelcomeScreen';

const App: React.FC = () => {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('easit-conversations', []);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const handleNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  }, [setConversations]);

  const addMessageToConversation = useCallback((conversationId: string, message: Message) => {
    setConversations(prev => {
      const newConversations = [...prev];
      const conversationIndex = newConversations.findIndex(c => c.id === conversationId);
      if (conversationIndex !== -1) {
        const updatedConversation = { ...newConversations[conversationIndex] };
        updatedConversation.messages = [...updatedConversation.messages, message];

        // If it's the first user message, update the conversation title
        if (updatedConversation.messages.length === 1 && message.role === 'user') {
          const newTitle = message.text.substring(0, 30) + (message.text.length > 30 ? '...' : '');
          updatedConversation.title = newTitle;
        }
        
        newConversations[conversationIndex] = updatedConversation;
      }
      return newConversations;
    });
  }, [setConversations]);

  const handleRenameConversation = useCallback((conversationId: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, title: newTitle } : c
      )
    );
  }, [setConversations]);

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={handleNewConversation}
        onRenameConversation={handleRenameConversation}
      />
      <main className="flex flex-1 flex-col transition-all duration-300">
        <Header />
        <div className="flex-1 overflow-hidden">
          {activeConversation ? (
            <ChatView
              key={activeConversation.id}
              conversation={activeConversation}
              addMessage={addMessageToConversation}
            />
          ) : (
            <WelcomeScreen onNewConversation={handleNewConversation} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
