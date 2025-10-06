
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex-shrink-0 h-16 flex items-center justify-between px-6 bg-white/5 dark:bg-gray-800/20 backdrop-blur-lg border-b border-white/10 dark:border-gray-700/50">
      <h2 className="text-lg font-semibold">Conversation</h2>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
};
