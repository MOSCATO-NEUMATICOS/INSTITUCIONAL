
import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Manuals } from './pages/Manuals';
import { Tools } from './pages/Tools';
import { Feedback } from './pages/Feedback';
import { Admin } from './pages/Admin';
import { Metrics } from './pages/Metrics';
import { Courses } from './pages/Courses';
import { Page, Manual, NewsItem, FeedbackItem, RecommendedCourse, EmployeeCourse, IpAlias, Supplier, DeviceAlias } from './types';
import { storageService } from './services/storage';

export type Theme = 'light' | 'dark' | 'system';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('system');
  const currentVisitId = useRef<string | null>(null);

  const [manuals, setManuals] = useState<Manual[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [ipAliases, setIpAliases] = useState<IpAlias[]>([]);
  const [deviceAliases, setDeviceAliases] = useState<DeviceAlias[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const refreshAllData = async () => {
    try {
      const [m, n, f, i, d, s] = await Promise.all([
        storageService.getManuals(),
        storageService.getNews(),
        storageService.getFeedback(),
        storageService.getIpAliases(),
        storageService.getDeviceAliases(),
        storageService.getSuppliers()
      ]);
      setManuals(m);
      setNews(n);
      setFeedbackItems(f);
      setIpAliases(i);
      setDeviceAliases(d);
      setSuppliers(s);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

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
    if (theme === 'system') {
      systemQuery.addEventListener('change', applyTheme);
      return () => systemQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const visitId = await storageService.recordVisit();
        currentVisitId.current = visitId;
        await refreshAllData();
      } catch (error) {
        console.error("Initial load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (currentVisitId.current) {
      let pageName = 'Inicio';
      switch(currentPage) {
        case Page.MANUALS: pageName = 'Manuales'; break;
        case Page.TOOLS: pageName = 'Herramientas'; break;
        case Page.METRICS: pageName = 'Métricas'; break;
        case Page.COURSES: pageName = 'Cursos'; break;
        case Page.FEEDBACK: pageName = 'Buzón'; break;
        case Page.ADMIN: pageName = 'Admin'; break;
      }
      storageService.trackPageNavigation(currentVisitId.current, pageName);
    }
  }, [currentPage]);

  const handleAddManual = async (newManual: Manual) => {
    await storageService.addManual(newManual);
    await refreshAllData(); // Forzar sincronización completa
  };

  const handleDeleteManual = async (id: string) => {
    await storageService.deleteManual(id);
    await refreshAllData();
  };

  const handleAddNews = async (newItem: NewsItem) => {
    await storageService.addNews(newItem);
    await refreshAllData();
  };

  const handleUpdateNews = async (updatedItem: NewsItem) => {
    await storageService.updateNews(updatedItem);
    await refreshAllData();
  };

  const handleDeleteNews = async (id: string) => {
    await storageService.deleteNews(id);
    await refreshAllData();
  };

  const handleAddFeedback = async (newItem: FeedbackItem) => {
    await storageService.addFeedback(newItem);
    await refreshAllData();
  };

  const handleUpdateFeedback = async (updatedItem: FeedbackItem) => {
    await storageService.updateFeedback(updatedItem);
    await refreshAllData();
  };

  const handleDeleteFeedback = async (id: string) => {
    await storageService.deleteFeedback(id);
    await refreshAllData();
  };

  const handleAddIpAlias = async (newAlias: IpAlias) => {
    await storageService.addIpAlias(newAlias);
    await refreshAllData();
  };

  const handleDeleteIpAlias = async (id: string) => {
    await storageService.deleteIpAlias(id);
    await refreshAllData();
  };

  const handleAddDeviceAlias = async (newAlias: DeviceAlias) => {
    await storageService.addDeviceAlias(newAlias);
    await refreshAllData();
  };

  const handleDeleteDeviceAlias = async (id: string) => {
    await storageService.deleteDeviceAlias(id);
    await refreshAllData();
  };

  const handleAddSupplier = async (newSupplier: Supplier) => {
    await storageService.addSupplier(newSupplier);
    await refreshAllData();
  };

  const handleUpdateSupplier = async (updatedSupplier: Supplier) => {
    await storageService.updateSupplier(updatedSupplier);
    await refreshAllData();
  };

  const handleDeleteSupplier = async (id: string) => {
    await storageService.deleteSupplier(id);
    await refreshAllData();
  };

  const handleImportData = async (data: any) => {
    if (data.manuals) for (const m of data.manuals) await storageService.addManual(m);
    if (data.news) for (const n of data.news) await storageService.addNews(n);
    if (data.ipAliases) for (const i of data.ipAliases) await storageService.addIpAlias(i);
    if (data.deviceAliases) for (const d of data.deviceAliases) await storageService.addDeviceAlias(d);
    if (data.suppliers) for (const s of data.suppliers) await storageService.addSupplier(s);
    window.location.reload();
  };

  const renderPage = () => {
    if (isLoading) return (
      <div className="flex h-screen items-center justify-center bg-tire-pattern dark:bg-gray-900 transition-colors">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-600"></div>
      </div>
    );

    switch (currentPage) {
      case Page.HOME: return <Home news={news} />;
      case Page.MANUALS: return <Manuals manuals={manuals} />;
      case Page.COURSES: return <Courses />;
      case Page.TOOLS: return <Tools onNavigate={setCurrentPage} suppliers={suppliers} />;
      case Page.METRICS: return <Metrics />;
      case Page.FEEDBACK: return <Feedback onFeedbackSubmit={handleAddFeedback} />;
      case Page.ADMIN: return (
        <Admin 
          manuals={manuals} news={news} feedbackItems={feedbackItems} ipAliases={ipAliases} deviceAliases={deviceAliases} suppliers={suppliers}
          onAddManual={handleAddManual} onDeleteManual={handleDeleteManual} onAddNews={handleAddNews} onUpdateNews={handleUpdateNews} onDeleteNews={handleDeleteNews}
          onUpdateFeedback={handleUpdateFeedback} onDeleteFeedback={handleDeleteFeedback} onAddIpAlias={handleAddIpAlias} onDeleteIpAlias={handleDeleteIpAlias}
          onAddDeviceAlias={handleAddDeviceAlias} onDeleteDeviceAlias={handleDeleteDeviceAlias} onAddSupplier={handleAddSupplier} onUpdateSupplier={handleUpdateSupplier}
          onDeleteSupplier={handleDeleteSupplier} onImportData={handleImportData}
        />
      );
      default: return <Home news={news} />;
    }
  };

  return (
    <div className="min-h-screen bg-tire-pattern dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} theme={theme} onThemeChange={setTheme} />
      <main className="flex-grow">{renderPage()}</main>
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
