
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Manuals } from './pages/Manuals';
import { Tools } from './pages/Tools';
import { Feedback } from './pages/Feedback';
import { Admin } from './pages/Admin';
import { Page, Manual, NewsItem, FeedbackItem } from './types';
import { storageService } from './services/storage';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isLoading, setIsLoading] = useState(true);
  
  // State
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);

  // --- INITIAL DATA LOAD (Async) ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [m, n, f] = await Promise.all([
          storageService.getManuals(),
          storageService.getNews(),
          storageService.getFeedback()
        ]);
        setManuals(m);
        setNews(n);
        setFeedbackItems(f);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handlers wrapped with Storage Service calls
  const handleAddManual = async (newManual: Manual) => {
    // Optimistic UI update
    setManuals([newManual, ...manuals]);
    // Persist
    await storageService.addManual(newManual);
    // Reload to ensure sync (optional but safer for IDs from DB)
    const updated = await storageService.getManuals();
    setManuals(updated);
  };

  const handleDeleteManual = async (id: string) => {
    setManuals(manuals.filter(m => m.id !== id));
    await storageService.deleteManual(id);
  };

  const handleAddNews = async (newItem: NewsItem) => {
    setNews([newItem, ...news]);
    await storageService.addNews(newItem);
    const updated = await storageService.getNews();
    setNews(updated);
  };

  const handleDeleteNews = async (id: string) => {
    setNews(news.filter(n => n.id !== id));
    await storageService.deleteNews(id);
  };

  const handleAddFeedback = async (newItem: FeedbackItem) => {
    setFeedbackItems([newItem, ...feedbackItems]);
    await storageService.addFeedback(newItem);
    const updated = await storageService.getFeedback();
    setFeedbackItems(updated);
  };

  const handleDeleteFeedback = async (id: string) => {
    setFeedbackItems(feedbackItems.filter(f => f.id !== id));
    await storageService.deleteFeedback(id);
  };

  // Import Data (Local fallback mainly, or bulk upload to cloud)
  const handleImportData = async (data: { manuals?: Manual[], news?: NewsItem[], feedbackItems?: FeedbackItem[] }) => {
    if (data.manuals) {
       for (const m of data.manuals) await storageService.addManual(m);
       const updated = await storageService.getManuals();
       setManuals(updated);
    }
    if (data.news) {
       for (const n of data.news) await storageService.addNews(n);
       const updated = await storageService.getNews();
       setNews(updated);
    }
    if (data.feedbackItems) {
       for (const f of data.feedbackItems) await storageService.addFeedback(f);
       const updated = await storageService.getFeedback();
       setFeedbackItems(updated);
    }
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center bg-tire-pattern">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-600"></div>
        </div>
      );
    }

    switch (currentPage) {
      case Page.HOME:
        return <Home news={news} />;
      case Page.MANUALS:
        return <Manuals manuals={manuals} />;
      case Page.TOOLS:
        return <Tools onNavigate={setCurrentPage} />;
      case Page.FEEDBACK:
        return <Feedback onFeedbackSubmit={handleAddFeedback} />;
      case Page.ADMIN:
        return (
          <Admin 
            manuals={manuals} 
            news={news}
            feedbackItems={feedbackItems}
            onAddManual={handleAddManual}
            onDeleteManual={handleDeleteManual}
            onAddNews={handleAddNews}
            onDeleteNews={handleDeleteNews}
            onDeleteFeedback={handleDeleteFeedback}
            onImportData={handleImportData}
          />
        );
      default:
        return <Home news={news} />;
    }
  };

  return (
    <div className="min-h-screen bg-tire-pattern font-sans text-gray-900 flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      <footer className="bg-brand-900 border-t border-brand-800 mt-auto text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6 md:order-2">
              <span className="text-brand-200 hover:text-white text-sm transition-colors">
                Soporte IT: <a href="mailto:diego@moscato.com.ar" className="text-gold-400 hover:underline">diego@moscato.com.ar</a>
              </span>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-sm text-brand-200">
                &copy; {new Date().getFullYear()} <span className="font-bold text-white">Moscato Neumáticos</span>. Uso interno exclusivo.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
