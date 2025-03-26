import React, { useState } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { Browser } from './components/Browser';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLinkClick = (url: string) => {
    setBrowserUrl(url);
  };

  const formatSearchResults = (results: string) => {
    return results.split('\n').map((line, index) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = line.split(urlRegex);
      
      return (
        <p key={index} className="mb-2">
          {parts.map((part, i) => {
            if (part.match(urlRegex)) {
              return (
                <button
                  key={i}
                  onClick={() => handleLinkClick(part)}
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  {part}
                </button>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Globe className="w-10 h-10 text-blue-500" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  RIGEL
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered Search Engine</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIncognitoMode(!incognitoMode)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {incognitoMode ? 'Normal Mode' : 'Incognito Mode'}
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </header>

          <main className="flex flex-col items-center gap-8">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <SearchBar
                onSearch={setSearchResults}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>

            {isLoading && (
              <div className="w-full max-w-3xl">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            )}

            {searchResults && !isLoading && (
              <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="prose dark:prose-invert max-w-none">
                  {formatSearchResults(searchResults)}
                </div>
              </div>
            )}

            {browserUrl && (
              <div className="w-full max-w-5xl mt-4">
                <Browser
                  url={browserUrl}
                  onClose={() => setBrowserUrl(null)}
                />
              </div>
            )}
          </main>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;