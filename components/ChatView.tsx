
import React, { useEffect, useRef, useState } from 'react';
import type { Conversation, Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { GoogleGenAI } from '@google/genai';

interface ChatViewProps {
  conversation: Conversation;
  addMessage: (conversationId: string, message: Message) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ conversation, addMessage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    addMessage(conversation.id, userMessage);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: conversation.messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const response = await chat.sendMessage({ message: text });
      
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        text: response.text,
        timestamp: new Date().toISOString(),
      };
      addMessage(conversation.id, aiMessage);

    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      addMessage(conversation.id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendVoiceMessage = (userText: string, aiText: string) => {
     const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
    };
    addMessage(conversation.id, userMessage);
    
    const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        text: aiText,
        timestamp: new Date().toISOString(),
      };
    addMessage(conversation.id, aiMessage);
  };


  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.3),rgba(255,255,255,0))]">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
            <MessageBubble 
                message={{ id: 'loading', role: 'model', text: '...', timestamp: ''}} 
                isLoading={true} 
            />
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendVoiceMessage={handleSendVoiceMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
