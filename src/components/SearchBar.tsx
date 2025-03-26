import React, { useState } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { getSearchResults } from '../lib/search';
import toast from 'react-hot-toast';

interface SearchBarProps {
  onSearch: (results: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SearchBar({ onSearch, isLoading, setIsLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const results = await getSearchResults(query);
      onSearch(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.success('Listening...');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed');
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        toast.success('Voice input received! Searching...');
        // Automatically trigger search after voice input
        await handleSearch();
      };

      recognition.start();
    } else {
      toast.error('Voice recognition is not supported in your browser');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className="relative flex items-center">
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className={`absolute left-4 ${
            isLoading ? 'text-gray-400' : 'text-gray-400 hover:text-blue-500'
          } transition-colors`}
          title="Search"
        >
          <Search size={20} />
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search with RIGEL..."
          className="w-full py-3 px-12 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-800 transition-all"
          disabled={isLoading}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-12 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Clear search"
          >
            <X size={20} />
          </button>
        )}
        <button
          type="button"
          onClick={handleVoiceSearch}
          disabled={isLoading || isListening}
          className={`absolute right-4 ${
            isListening ? 'text-blue-500 animate-pulse' : 'text-gray-400 hover:text-blue-500'
          } transition-colors`}
          title="Voice search"
        >
          <Mic size={20} />
        </button>
      </div>
    </form>
  );
}