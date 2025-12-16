
import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Manuals } from './pages/Manuals';
import { Tools } from './pages/Tools';
import { Feedback } from './pages/Feedback';
import { Admin } from './pages/Admin';
import { Metrics } from './pages/Metrics';
import { Courses } from './pages/Courses';
import { Page, Manual, NewsItem, FeedbackItem, RecommendedCourse, EmployeeCourse, IpAlias, Supplier } from './types';
import { storageService } from './services/storage';

export type Theme = 'light' | 'dark' | 'system';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isLoading, setIsLoading] = useState(true);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>('system');

  // Tracking State
  const currentVisitId = useRef<string | null>(null);

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (theme === 'dark' || (theme === 'system' && systemQuery.matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      systemQuery.addEventListener('change', applyTheme);
      return () => systemQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  // State Data
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [ipAliases, setIpAliases] = useState<IpAlias[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // --- INITIAL DATA LOAD (Async) ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Record visit and store ID for tracking
        const visitId = await storageService.recordVisit();
        currentVisitId.current = visitId;

        const [m, n, f, i, s] = await Promise.all([
          storageService.getManuals(),
          storageService.getNews(),
          storageService.getFeedback(),
          storageService.getIpAliases(),
          storageService.getSuppliers()
        ]);
        setManuals(m);
        setNews(n);
        setFeedbackItems(f);
        setIpAliases(i);
        setSuppliers(s);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // --- PAGE NAVIGATION TRACKING ---
  useEffect(() => {
    if (currentVisitId.current) {
      // Map enum to readable name
      let pageName = 'Inicio';
      switch(currentPage) {
        case Page.MANUALS: pageName = 'Manuales'; break;
        case Page.TOOLS: pageName = 'Herramientas'; break;
        case Page.METRICS: pageName = 'Métricas'; break;
        case Page.COURSES: pageName = 'Cursos'; break;
        case Page.FEEDBACK: pageName = 'Buzón'; break;
        case Page.ADMIN: pageName = 'Admin'; break;
        default: pageName = 'Inicio';
      }
      storageService.trackPageNavigation(currentVisitId.current, pageName);
    }
  }, [currentPage]);

  // Handlers wrapped with Storage Service calls
  const handleAddManual = async (newManual: Manual) => {
    setManuals([newManual, ...manuals]);
    await storageService.addManual(newManual);
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

  const handleUpdateNews = async (updatedItem: NewsItem) => {
    setNews(news.map(n => n.id === updatedItem.id ? updatedItem : n));
    await storageService.updateNews(updatedItem);
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

  const handleUpdateFeedback = async (updatedItem: FeedbackItem) => {
    setFeedbackItems(feedbackItems.map(f => f.id === updatedItem.id ? updatedItem : f));
    await storageService.updateFeedback(updatedItem);
    const updated = await storageService.getFeedback();
    setFeedbackItems(updated);
  };

  const handleDeleteFeedback = async (id: string) => {
    setFeedbackItems(feedbackItems.filter(f => f.id !== id));
    await storageService.deleteFeedback(id);
  };

  const handleAddIpAlias = async (newAlias: IpAlias) => {
    setIpAliases([newAlias, ...ipAliases]);
    await storageService.addIpAlias(newAlias);
    const updated = await storageService.getIpAliases();
    setIpAliases(updated);
  };

  const handleDeleteIpAlias = async (id: string) => {
    setIpAliases(ipAliases.filter(a => a.id !== id));
    await storageService.deleteIpAlias(id);
  };

  const handleAddSupplier = async (newSupplier: Supplier) => {
    setSuppliers([newSupplier, ...suppliers]);
    await storageService.addSupplier(newSupplier);
    const updated = await storageService.getSuppliers();
    setSuppliers(updated);
  };

  const handleUpdateSupplier = async (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
    await storageService.updateSupplier(updatedSupplier);
    const updated = await storageService.getSuppliers();
    setSuppliers(updated);
  };

  const handleDeleteSupplier = async (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    await storageService.deleteSupplier(id);
  };

  const handleImportData = async (data: { 
    manuals?: Manual[], 
    news?: NewsItem[], 
    feedbackItems?: FeedbackItem[], 
    recommendedCourses?: RecommendedCourse[],
    employeeCourses?: EmployeeCourse[],
    ipAliases?: IpAlias[],
    suppliers?: Supplier[]
  }) => {
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
    if (data.recommendedCourses) {
        for (const c of data.recommendedCourses) await storageService.addRecommendedCourse(c);
    }
    if (data.employeeCourses) {
        for (const ec of data.employeeCourses) await storageService.addEmployeeCourse(ec);
    }
    if (data.ipAliases) {
        for (const ia of data.ipAliases) await storageService.addIpAlias(ia);
        const updated = await storageService.getIpAliases();
        setIpAliases(updated);
    }
    if (data.suppliers) {
        for (const s of data.suppliers) await storageService.addSupplier(s);
        const updated = await storageService.getSuppliers();
        setSuppliers(updated);
    }
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center bg-tire-pattern dark:bg-gray-900 transition-colors">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-600"></div>
        </div>
      );
    }

    switch (currentPage) {
      case Page.HOME:
        return <Home news={news} />;
      case Page.MANUALS:
        return <Manuals manuals={manuals} />;
      case Page.COURSES:
        return <Courses />;
      case Page.TOOLS:
        return <Tools onNavigate={setCurrentPage} suppliers={suppliers} />;
      case Page.METRICS:
        return <Metrics />;
      case Page.FEEDBACK:
        return <Feedback onFeedbackSubmit={handleAddFeedback} />;
      case Page.ADMIN:
        return (
          <Admin 
            manuals={manuals} 
            news={news}
            feedbackItems={feedbackItems}
            ipAliases={ipAliases}
            suppliers={suppliers}
            onAddManual={handleAddManual}
            onDeleteManual={handleDeleteManual}
            onAddNews={handleAddNews}
            onUpdateNews={handleUpdateNews}
            onDeleteNews={handleDeleteNews}
            onUpdateFeedback={handleUpdateFeedback}
            onDeleteFeedback={handleDeleteFeedback}
            onAddIpAlias={handleAddIpAlias}
            onDeleteIpAlias={handleDeleteIpAlias}
            onAddSupplier={handleAddSupplier}
            onUpdateSupplier={handleUpdateSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            onImportData={handleImportData}
          />
        );
      default:
        return <Home news={news} />;
    }
  };

  return (
    <div className="min-h-screen bg-tire-pattern dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        theme={theme}
        onThemeChange={setTheme}
      />
      
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
