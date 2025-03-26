import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, X, Maximize2, Minimize2, Home, BookOpen, Shield, Settings, Share2, Download, Printer, Search } from 'lucide-react';

interface BrowserProps {
  url: string;
  onClose?: () => void;
}

export function Browser({ url, onClose }: BrowserProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [title, setTitle] = useState(url);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isSecure, setIsSecure] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<string[]>([url]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<{ url: string; title: string }[]>([]);

  useEffect(() => {
    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('rigel_bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    // Check if URL is secure
    setIsSecure(url.startsWith('https://'));
  }, [url]);

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(history[historyIndex - 1]);
      if (iframeRef.current) {
        iframeRef.current.src = history[historyIndex - 1];
      }
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(history[historyIndex + 1]);
      if (iframeRef.current) {
        iframeRef.current.src = history[historyIndex + 1];
      }
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };

  const handleHome = () => {
    const homeUrl = 'https://www.google.com';
    setCurrentUrl(homeUrl);
    setHistory([...history.slice(0, historyIndex + 1), homeUrl]);
    setHistoryIndex(historyIndex + 1);
    if (iframeRef.current) {
      iframeRef.current.src = homeUrl;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const addBookmark = () => {
    const newBookmark = { url: currentUrl, title: title };
    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem('rigel_bookmarks', JSON.stringify(updatedBookmarks));
    alert('Bookmark added!');
  };

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: currentUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(currentUrl);
      alert('URL copied to clipboard!');
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-[600px]'} flex flex-col rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl`}>
      {/* Browser Header */}
      <div className="flex flex-col bg-gray-100 dark:bg-gray-800">
        {/* Main Toolbar */}
        <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full disabled:opacity-50"
              title="Back"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex === history.length - 1}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full disabled:opacity-50"
              title="Forward"
            >
              <ArrowRight size={16} />
            </button>
            <button
              onClick={handleRefresh}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              title="Refresh"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleHome}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              title="Home"
            >
              <Home size={16} />
            </button>
          </div>

          <div className="flex-1 flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            {isSecure && <Shield size={14} className="text-green-500 mr-2" />}
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setHistory([...history.slice(0, historyIndex + 1), currentUrl]);
                  setHistoryIndex(historyIndex + 1);
                  if (iframeRef.current) {
                    iframeRef.current.src = currentUrl;
                  }
                }
              }}
              className="w-full bg-transparent border-none focus:outline-none text-sm"
            />
            <Search size={14} className="text-gray-500 ml-2" />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={addBookmark}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              title="Bookmark"
            >
              <BookOpen size={16} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              title="Share"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              title="Print"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                title="Close"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center px-2 py-1 gap-2">
          <div className="flex-1 flex items-center gap-2 text-sm bg-white dark:bg-gray-900 rounded px-3 py-1">
            <div className="flex-1 truncate">{title}</div>
            {isLoading && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full flex-1 bg-white"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        onLoad={() => {
          setIsLoading(false);
          try {
            const newTitle = iframeRef.current?.contentDocument?.title || url;
            setTitle(newTitle);
            const newUrl = iframeRef.current?.contentWindow?.location.href || url;
            setCurrentUrl(newUrl);
            setIsSecure(newUrl.startsWith('https://'));
          } catch (e) {
            setTitle(url);
          }
        }}
      />
    </div>
  );
}