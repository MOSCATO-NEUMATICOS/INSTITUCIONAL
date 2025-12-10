
import React, { useState, useEffect } from 'react';
import { Manual, ManualCategory, NewsItem, FeedbackItem, VisitRecord, RecommendedCourse, EmployeeCourse, IpAlias, Supplier } from '../types';
import { Trash2, Plus, LogIn, Save, Lock, Upload, FileText, MessageSquare, User, UserX, AlertOctagon, XCircle, Download, Database, RefreshCw, BarChart2, Calendar, Users, Smartphone, Monitor, Globe, GraduationCap, Link as LinkIcon, Edit2, X, CheckCircle2, Loader2, Network, Star, Tag, Percent, TrendingUp, CheckSquare } from 'lucide-react';
import { storageService } from '../services/storage';

interface AdminProps {
  manuals: Manual[];
  news: NewsItem[];
  feedbackItems?: FeedbackItem[];
  ipAliases?: IpAlias[];
  suppliers?: Supplier[];
  onAddManual: (manual: Manual) => void;
  onDeleteManual: (id: string) => void;
  onAddNews: (news: NewsItem) => void;
  onUpdateNews: (news: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onDeleteFeedback?: (id: string) => void;
  onAddIpAlias?: (alias: IpAlias) => void;
  onDeleteIpAlias?: (id: string) => void;
  onAddSupplier?: (supplier: Supplier) => void;
  onUpdateSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (id: string) => void;
  onImportData?: (data: any) => void;
}

export const Admin: React.FC<AdminProps> = ({ 
  manuals, 
  news, 
  feedbackItems = [],
  ipAliases = [],
  suppliers = [],
  onAddManual, 
  onDeleteManual, 
  onAddNews, 
  onUpdateNews,
  onDeleteNews,
  onDeleteFeedback,
  onAddIpAlias,
  onDeleteIpAlias,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onImportData
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'manuals' | 'news' | 'messages' | 'courses' | 'suppliers' | 'system'>('manuals');
  const [isExporting, setIsExporting] = useState(false);
  
  // Analytics State
  const [visitStats, setVisitStats] = useState<{total: number, today: number, previousVisit: string}>({ total: 0, today: 0, previousVisit: '-' });
  const [recentVisitsLog, setRecentVisitsLog] = useState<VisitRecord[]>([]);

  // Courses State
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
  const [employeeCourses, setEmployeeCourses] = useState<EmployeeCourse[]>([]);
  
  const [newRecCourse, setNewRecCourse] = useState<Partial<RecommendedCourse>>({ title: '', platform: '', description: '', link: '' });
  const [editingRecCourseId, setEditingRecCourseId] = useState<string | null>(null);

  const [editingEmpCourseId, setEditingEmpCourseId] = useState<string | null>(null);
  const [empCourseForm, setEmpCourseForm] = useState<Partial<EmployeeCourse>>({});

  // News Editing State
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  // IP Alias Form State
  const [newIpAlias, setNewIpAlias] = useState({ ip: '', name: '' });

  // Supplier Form State
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({ name: '', discountChain: '', margin: 40, marginBase: 'cost', addIva: true });
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'manual' | 'news' | 'feedback' | 'rec_course' | 'emp_course' | 'ip_alias' | 'supplier' | null;
    id: string | null;
  }>({ isOpen: false, type: null, id: null });

  // Manual Form State
  const [newManual, setNewManual] = useState<Partial<Manual>>({
    title: '',
    description: '',
    category: ManualCategory.TALLER,
    link: '' 
  });
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  // News Form State
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({
    title: '',
    category: 'General',
    description: '',
    highlight: false
  });

  // Helper to parse User Agent
  const getDeviceIcon = (ua: string = '') => {
    if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
      return <Smartphone className="w-4 h-4 text-brand-500 inline mr-1" />;
    }
    return <Monitor className="w-4 h-4 text-gray-500 inline mr-1" />;
  };

  const getDeviceName = (ua: string = '') => {
    let os = 'Desconocido';
    if (/Windows/i.test(ua)) os = 'PC Windows';
    else if (/Mac/i.test(ua)) os = 'Mac';
    else if (/iPhone|iPad/i.test(ua)) os = 'iPhone/iPad';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/Linux/i.test(ua)) os = 'Linux';

    let browser = '';
    if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Edge/i.test(ua)) browser = 'Edge';

    return `${os} ${browser ? `(${browser})` : ''}`;
  };

  // Helper to lookup IP Alias
  const getIpLabel = (ip: string | undefined) => {
    if (!ip) return { label: '-', isAlias: false };
    const alias = ipAliases.find(a => a.ip === ip);
    if (alias) {
      return { label: alias.name, ip: ip, isAlias: true };
    }
    return { label: ip, isAlias: false };
  };

  // Load stats when System tab is active
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'system') {
        const loadStats = async () => {
          const visits = await storageService.getVisits();
          const todayStr = new Date().toLocaleDateString('es-AR');
          
          const todayCount = visits.filter(v => v.dateString === todayStr).length;
          
          // Logic for Previous Visit (Index 1, since Index 0 is "now")
          let prevVisit = 'Primer Ingreso';
          if (visits.length > 1) {
             const prev = visits[1]; // Get the second item
             prevVisit = new Date(prev.timestamp).toLocaleString('es-AR', { 
               day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
             });
          } else if (visits.length === 0) {
             prevVisit = '-';
          }

          setVisitStats({
            total: visits.length,
            today: todayCount,
            previousVisit: prevVisit
          });

          // Store log for table (Top 20)
          setRecentVisitsLog(visits.slice(0, 20));
        };
        loadStats();
      } else if (activeTab === 'courses') {
        const loadCourses = async () => {
          const rCourses = await storageService.getRecommendedCourses();
          const eCourses = await storageService.getEmployeeCourses();
          setRecommendedCourses(rCourses);
          setEmployeeCourses(eCourses);
        };
        loadCourses();
      }
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'moscato2024') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('La contraseña ingresada es incorrecta.');
      setPassword(''); 
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor, sube solo archivos PDF.');
        return;
      }
      
      setSelectedFileName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewManual({ ...newManual, link: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpAlias.ip || !newIpAlias.name || !onAddIpAlias) return;
    
    onAddIpAlias({
      id: Date.now().toString(),
      ip: newIpAlias.ip.trim(),
      name: newIpAlias.name.trim()
    });
    setNewIpAlias({ ip: '', name: '' });
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setNewSupplier({ ...supplier });
    setEditingSupplierId(supplier.id);
  };

  const cancelEditSupplier = () => {
    setNewSupplier({ name: '', discountChain: '', margin: 40, marginBase: 'cost', addIva: true });
    setEditingSupplierId(null);
  };

  const submitSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.discountChain) return;

    const supplierData: Supplier = {
      id: editingSupplierId || Date.now().toString(),
      name: newSupplier.name!,
      discountChain: newSupplier.discountChain!,
      margin: newSupplier.margin || 40,
      marginBase: newSupplier.marginBase || 'cost',
      addIva: newSupplier.addIva
    };

    if (editingSupplierId && onUpdateSupplier) {
      onUpdateSupplier(supplierData);
      cancelEditSupplier();
    } else if (onAddSupplier) {
      onAddSupplier(supplierData);
      setNewSupplier({ name: '', discountChain: '', margin: 40, marginBase: 'cost', addIva: true });
    }
  };

  // --- DELETE HANDLERS ---
  const requestDelete = (type: 'manual' | 'news' | 'feedback' | 'rec_course' | 'emp_course' | 'ip_alias' | 'supplier', id: string) => {
    setDeleteModal({ isOpen: true, type, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    if (deleteModal.type === 'manual') {
      onDeleteManual(deleteModal.id);
    } else if (deleteModal.type === 'news') {
      onDeleteNews(deleteModal.id);
    } else if (deleteModal.type === 'feedback' && onDeleteFeedback) {
      onDeleteFeedback(deleteModal.id);
    } else if (deleteModal.type === 'rec_course') {
      await storageService.deleteRecommendedCourse(deleteModal.id);
      setRecommendedCourses(recommendedCourses.filter(c => c.id !== deleteModal.id));
    } else if (deleteModal.type === 'emp_course') {
      await storageService.deleteEmployeeCourse(deleteModal.id);
      setEmployeeCourses(employeeCourses.filter(c => c.id !== deleteModal.id));
    } else if (deleteModal.type === 'ip_alias' && onDeleteIpAlias) {
      onDeleteIpAlias(deleteModal.id);
    } else if (deleteModal.type === 'supplier' && onDeleteSupplier) {
      onDeleteSupplier(deleteModal.id);
    }

    setDeleteModal({ isOpen: false, type: null, id: null });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, type: null, id: null });
  };

  // --- EDIT HANDLERS (News) ---
  const handleEditNews = (item: NewsItem) => {
    setNewNews({ ...item });
    setEditingNewsId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditNews = () => {
    setNewNews({ title: '', description: '', category: 'General', highlight: false });
    setEditingNewsId(null);
  };

  const submitNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.description) return;

    if (editingNewsId) {
      const updatedNews: NewsItem = {
        ...(newNews as NewsItem),
        id: editingNewsId
      };
      onUpdateNews(updatedNews);
      cancelEditNews();
    } else {
      const newsItem: NewsItem = {
        id: Date.now().toString(),
        title: newNews.title!,
        description: newNews.description!,
        category: newNews.category || 'General',
        date: new Date().toLocaleDateString('es-AR'),
        highlight: newNews.highlight || false
      };
      onAddNews(newsItem);
      setNewNews({ title: '', description: '', category: 'General', highlight: false });
    }
  };

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManual.title || !newManual.description) return;

    const manual: Manual = {
      id: Date.now().toString(),
      title: newManual.title!,
      description: newManual.description!,
      category: newManual.category || ManualCategory.TALLER,
      lastUpdated: new Date().toLocaleDateString('es-AR'),
      link: newManual.link 
    };

    onAddManual(manual);
    setNewManual({ title: '', description: '', category: ManualCategory.TALLER, link: '' });
    setSelectedFileName('');
  };

  // --- EDIT HANDLERS (Recommended Course) ---
  const handleEditRecCourse = (item: RecommendedCourse) => {
    setNewRecCourse({...item});
    setEditingRecCourseId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditRecCourse = () => {
    setNewRecCourse({ title: '', platform: '', description: '', link: '' });
    setEditingRecCourseId(null);
  };

  const submitRecCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecCourse.title || !newRecCourse.link) return;

    if (editingRecCourseId) {
      const updatedCourse: RecommendedCourse = {
        ...(newRecCourse as RecommendedCourse),
        id: editingRecCourseId
      };
      await storageService.updateRecommendedCourse(updatedCourse);
      const updatedList = recommendedCourses.map(c => c.id === editingRecCourseId ? updatedCourse : c);
      setRecommendedCourses(updatedList);
      cancelEditRecCourse();
    } else {
      const course: RecommendedCourse = {
        id: Date.now().toString(),
        title: newRecCourse.title!,
        platform: newRecCourse.platform || 'General',
        description: newRecCourse.description || '',
        link: newRecCourse.link!
      };
      await storageService.addRecommendedCourse(course);
      setRecommendedCourses([course, ...recommendedCourses]);
      setNewRecCourse({ title: '', platform: '', description: '', link: '' });
    }
  };

  // --- EDIT HANDLERS (Employee Course) ---
  const handleEditEmpCourse = (course: EmployeeCourse) => {
    setEmpCourseForm({ ...course });
    setEditingEmpCourseId(course.id);
  };

  const cancelEditEmpCourse = () => {
    setEmpCourseForm({});
    setEditingEmpCourseId(null);
  };

  const handleUpdateEmpCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmpCourseId || !empCourseForm.employeeName || !empCourseForm.courseTitle) return;

    const updatedCourse: EmployeeCourse = {
      ...(empCourseForm as EmployeeCourse),
      id: editingEmpCourseId
    };

    await storageService.updateEmployeeCourse(updatedCourse);
    setEmployeeCourses(employeeCourses.map(c => c.id === editingEmpCourseId ? updatedCourse : c));
    cancelEditEmpCourse();
  };

  // --- SYSTEM: EXPORT / IMPORT ---
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const freshRecCourses = await storageService.getRecommendedCourses();
      const freshEmpCourses = await storageService.getEmployeeCourses();
      const freshAliases = await storageService.getIpAliases();
      const freshSuppliers = await storageService.getSuppliers();

      const data = {
        manuals,
        news,
        feedbackItems,
        recommendedCourses: freshRecCourses,
        employeeCourses: freshEmpCourses,
        ipAliases: freshAliases,
        suppliers: freshSuppliers
      };
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_moscato_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      alert("Hubo un error al generar la copia de seguridad.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (onImportData) {
          if (confirm('ATENCIÓN: Esto reemplazará los datos actuales con los del archivo. ¿Desea continuar?')) {
            onImportData(json);
            alert('¡Datos restaurados con éxito!');
          }
        }
      } catch (error) {
        alert('Error al leer el archivo. Asegúrese de que sea un JSON válido.');
        console.error(error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-xl shadow-xl border border-brand-200 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900">Acceso Administrativo</h2>
            <p className="text-gray-500 text-sm mt-1">Ingrese la contraseña de super usuario.</p>
          </div>
          
          {loginError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center animate-fade-in">
              <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (loginError) setLoginError('');
              }}
              placeholder="Contraseña"
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900 ${
                loginError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="submit"
              className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-md hover:bg-brand-700 transition-colors flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      
      {/* --- CUSTOM CONFIRMATION MODAL --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border-t-4 border-red-500 transform transition-all scale-100">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertOctagon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">¿Confirmar Eliminación?</h3>
              <p className="text-center text-gray-500 mb-6">
                Estás a punto de eliminar un elemento. 
                <br />
                <span className="font-bold text-red-500">Esta acción no se puede deshacer.</span>
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md shadow-md transition-colors flex justify-center items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Panel de Administración</h2>
        <button 
          onClick={() => {
            setIsAuthenticated(false);
            setPassword('');
            setLoginError('');
          }}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Admin Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('manuals')}
            className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider ${
              activeTab === 'manuals' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Manuales
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider ${
              activeTab === 'news' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Novedades
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider ${
              activeTab === 'courses' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Capacitación
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider ${
              activeTab === 'messages' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Buzón
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider ${
              activeTab === 'suppliers' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Proveedores
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider ${
              activeTab === 'system' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Sistema
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'manuals' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Manuals */}
              {/* ... (Manuals content kept same) */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2" /> Agregar Nuevo Manual
                </h3>
                <form onSubmit={submitManual} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                      type="text"
                      required
                      value={newManual.title}
                      onChange={(e) => setNewManual({...newManual, title: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                    <select
                      value={newManual.category}
                      onChange={(e) => setNewManual({...newManual, category: e.target.value as ManualCategory})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                    >
                      {Object.values(ManualCategory).filter(c => c !== ManualCategory.ALL).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      required
                      rows={3}
                      value={newManual.description}
                      onChange={(e) => setNewManual({...newManual, description: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                    />
                  </div>
                  
                  {/* File Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Archivo PDF</label>
                    <div className="flex items-center justify-center w-full">
                      <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${selectedFileName ? 'border-brand-500 bg-brand-50' : 'border-gray-300 bg-white'}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {selectedFileName ? (
                             <div className="flex items-center text-brand-600">
                               <FileText className="w-6 h-6 mr-2" />
                               <p className="text-sm font-medium truncate max-w-[200px]">{selectedFileName}</p>
                             </div>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 mb-2 text-gray-400" />
                              <p className="text-xs text-gray-500">Click para subir PDF</p>
                            </>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="application/pdf" 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-brand-600 text-white font-bold py-2 rounded-md hover:bg-brand-700">
                    <Save className="w-4 h-4 inline mr-2" /> Guardar Manual
                  </button>
                </form>
              </div>

              {/* List Manuals */}
              <div className="lg:col-span-2">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Manuales Existentes ({manuals.length})</h3>
                 <div className="bg-white border border-gray-200 rounded-md overflow-hidden max-h-[500px] overflow-y-auto">
                   <ul className="divide-y divide-gray-200">
                     {manuals.map(manual => (
                       <li key={manual.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                         <div>
                           <div className="flex items-center">
                             <p className="font-bold text-sm text-gray-900 mr-2">{manual.title}</p>
                             {manual.link && <FileText className="w-3 h-3 text-brand-500" />}
                           </div>
                           <p className="text-xs text-gray-500">{manual.category}</p>
                         </div>
                         <button 
                            onClick={() => requestDelete('manual', manual.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                            title="Eliminar"
                          >
                           <Trash2 className="w-5 h-5" />
                         </button>
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Form News */}
               {/* ... (News content kept same) */}
               <div className={`bg-gray-50 p-6 rounded-lg border h-fit transition-colors ${editingNewsId ? 'border-orange-400 ring-4 ring-orange-50' : 'border-gray-200'}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span className="flex items-center">
                    {editingNewsId ? <Edit2 className="w-5 h-5 mr-2 text-orange-500" /> : <Plus className="w-5 h-5 mr-2" />}
                    {editingNewsId ? 'Editar Novedad' : 'Agregar Novedad'}
                  </span>
                  {editingNewsId && (
                    <button onClick={cancelEditNews} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </h3>
                <form onSubmit={submitNews} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                      type="text"
                      required
                      value={newNews.title}
                      onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Etiqueta/Departamento</label>
                    <input
                      type="text"
                      placeholder="Ej: Taller, Ventas, General"
                      value={newNews.category}
                      onChange={(e) => setNewNews({...newNews, category: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      required
                      rows={3}
                      value={newNews.description}
                      onChange={(e) => setNewNews({...newNews, description: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                    />
                  </div>

                  <div className="flex items-center space-x-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                    <input 
                      type="checkbox" 
                      id="highlight" 
                      checked={newNews.highlight || false}
                      onChange={(e) => setNewNews({...newNews, highlight: e.target.checked})}
                      className="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
                    />
                    <label htmlFor="highlight" className="text-sm font-medium text-gray-700 flex items-center cursor-pointer">
                      <Star className="w-4 h-4 text-gold-500 mr-1" />
                      Marcar como Destacada (15 días)
                    </label>
                  </div>
                  
                  <div className="flex space-x-3">
                    {editingNewsId && (
                      <button 
                        type="button" 
                        onClick={cancelEditNews}
                        className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="submit" 
                      className={`flex-1 text-white font-bold py-2 rounded-md transition-colors flex items-center justify-center ${
                        editingNewsId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-brand-600 hover:bg-brand-700'
                      }`}
                    >
                      {editingNewsId ? <Save className="w-4 h-4 inline mr-2" /> : <Save className="w-4 h-4 inline mr-2" />}
                      {editingNewsId ? 'Actualizar' : 'Publicar'}
                    </button>
                  </div>
                </form>
              </div>

              {/* List News */}
              <div className="lg:col-span-2">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Novedades Publicadas ({news.length})</h3>
                 <div className="bg-white border border-gray-200 rounded-md overflow-hidden max-h-[500px] overflow-y-auto">
                   <ul className="divide-y divide-gray-200">
                     {news.map(item => (
                       <li key={item.id} className={`p-4 flex justify-between items-center hover:bg-gray-50 group ${item.highlight ? 'bg-yellow-50' : ''}`}>
                         <div>
                           <div className="flex items-center">
                             <p className="font-bold text-sm text-gray-900">{item.title}</p>
                             {item.highlight && <Star className="w-3 h-3 text-gold-500 ml-2 fill-current" />}
                           </div>
                           <p className="text-xs text-gray-500">{item.date} - {item.category}</p>
                         </div>
                         <div className="flex space-x-2">
                           <button 
                              onClick={() => handleEditNews(item)}
                              className="text-gray-400 hover:text-orange-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Editar"
                            >
                             <Edit2 className="w-5 h-5" />
                           </button>
                           <button 
                              onClick={() => requestDelete('news', item.id)}
                              className="text-red-500 hover:text-red-700 p-2"
                              title="Eliminar"
                            >
                             <Trash2 className="w-5 h-5" />
                           </button>
                         </div>
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Suppliers List */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-fit">
                <div className="bg-green-700 text-white px-4 py-3 flex justify-between items-center">
                  <h4 className="font-bold text-sm flex items-center"><Tag className="w-4 h-4 mr-2" /> Proveedores Configurados</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {suppliers && suppliers.length > 0 ? (
                    suppliers.map(sup => (
                      <div key={sup.id} className="p-4 hover:bg-gray-50 flex justify-between items-center group">
                        <div>
                          <span className="block font-bold text-gray-900">{sup.name}</span>
                          <div className="flex flex-col gap-1 mt-1">
                            <span className="flex items-center text-xs text-gray-500"><Percent className="w-3 h-3 mr-1" /> Desc: {sup.discountChain}</span>
                            <span className="flex items-center text-xs text-gray-500">
                              <TrendingUp className="w-3 h-3 mr-1" /> 
                              Margen: {sup.margin}% ({sup.marginBase === 'list' ? 'sobre Lista' : 'sobre Costo'})
                            </span>
                            {sup.addIva && (
                              <span className="flex items-center text-xs text-green-600 font-bold">
                                <Plus className="w-3 h-3 mr-1" /> Suma IVA (21%)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button onClick={() => handleEditSupplier(sup)} className="text-gray-400 hover:text-orange-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity" title="Editar">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => requestDelete('supplier', sup.id)} className="text-gray-400 hover:text-red-600 p-2" title="Eliminar">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500 text-sm">No hay proveedores cargados.</div>
                  )}
                </div>
              </div>

              {/* Add/Edit Supplier Form */}
              <div className={`bg-gray-50 p-6 rounded-lg border h-fit transition-colors ${editingSupplierId ? 'border-orange-400 ring-4 ring-orange-50' : 'border-gray-200'}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span className="flex items-center">
                    {editingSupplierId ? <Edit2 className="w-5 h-5 mr-2 text-orange-500" /> : <Plus className="w-5 h-5 mr-2" />}
                    {editingSupplierId ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
                  </span>
                  {editingSupplierId && (
                    <button onClick={cancelEditSupplier} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  )}
                </h3>
                <form onSubmit={submitSupplier} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Proveedor</label>
                    <input
                      type="text"
                      required
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                      placeholder="Ej: Corven"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cadena de Descuentos (Habitual)</label>
                    <input
                      type="text"
                      required
                      value={newSupplier.discountChain}
                      onChange={(e) => setNewSupplier({...newSupplier, discountChain: e.target.value})}
                      placeholder="Ej: 35+10+5"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ingrese los descuentos separados por "+" o espacios.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Margen Sugerido (%)</label>
                      <input
                        type="number"
                        required
                        value={newSupplier.margin}
                        onChange={(e) => setNewSupplier({...newSupplier, margin: parseFloat(e.target.value)})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Base del Margen</label>
                      <select
                        value={newSupplier.marginBase || 'cost'}
                        onChange={(e) => setNewSupplier({...newSupplier, marginBase: e.target.value as 'cost' | 'list'})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white text-gray-900"
                      >
                        <option value="cost">Sobre Costo</option>
                        <option value="list">Sobre Lista</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-gray-200">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newSupplier.addIva || false}
                        onChange={(e) => setNewSupplier({...newSupplier, addIva: e.target.checked})}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">El precio de lista es SIN IVA (Sumar 21%)</span>
                    </label>
                  </div>
                  
                  <div className="flex space-x-3">
                    {editingSupplierId && (
                      <button 
                        type="button" 
                        onClick={cancelEditSupplier}
                        className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="submit" 
                      className={`flex-1 text-white font-bold py-2 rounded-md transition-colors flex items-center justify-center ${
                        editingSupplierId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {editingSupplierId ? 'Actualizar' : 'Guardar Proveedor'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ... Rest of existing code ... */}
          {activeTab === 'system' && (
            <div className="space-y-8">
              {/* ... System Tab Content ... */}
              {/* Analytics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full mr-4 text-blue-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Visitas Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{visitStats.total}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
                  <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Visitas Hoy</p>
                    <p className="text-2xl font-bold text-gray-900">{visitStats.today}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full mr-4 text-purple-600">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Último Ingreso</p>
                    <p className="text-sm font-bold text-gray-900">{visitStats.previousVisit}</p>
                  </div>
                </div>
              </div>

              {/* Security & Access Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* IP ALIAS MANAGER */}
                <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg overflow-hidden h-fit">
                  <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
                    <h4 className="font-bold text-sm flex items-center"><Network className="w-4 h-4 mr-2" /> IPs Conocidas (Alias)</h4>
                  </div>
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <form onSubmit={handleAddAlias} className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="Dirección IP (ej: 181.10.20.30)" 
                        className="w-full p-2 text-xs border rounded bg-white text-gray-900"
                        value={newIpAlias.ip}
                        onChange={e => setNewIpAlias({...newIpAlias, ip: e.target.value})}
                      />
                      <input 
                        type="text" 
                        placeholder="Nombre (ej: Oficina, Casa)" 
                        className="w-full p-2 text-xs border rounded bg-white text-gray-900"
                        value={newIpAlias.name}
                        onChange={e => setNewIpAlias({...newIpAlias, name: e.target.value})}
                      />
                      <button type="submit" className="w-full bg-gray-600 text-white text-xs font-bold py-2 rounded hover:bg-gray-700">Guardar Alias</button>
                    </form>
                  </div>
                  <ul className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                    {ipAliases.map(alias => (
                      <li key={alias.id} className="p-3 flex justify-between items-center hover:bg-gray-50 text-xs">
                        <div>
                          <span className="font-bold block text-gray-800">{alias.name}</span>
                          <span className="text-gray-500 font-mono">{alias.ip}</span>
                        </div>
                        <button onClick={() => requestDelete('ip_alias', alias.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ACCESS LOGS TABLE */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800">Registro de Actividad Reciente</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha / Hora</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispositivo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP / Origen</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentVisitsLog.map((visit) => {
                          const ipInfo = getIpLabel(visit.ip);
                          return (
                            <tr key={visit.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                {new Date(visit.timestamp).toLocaleString('es-AR', { hour12: false })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                {getDeviceIcon(visit.deviceInfo)}
                                <span className="text-xs ml-1">{getDeviceName(visit.deviceInfo)}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">
                                {ipInfo.isAlias ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">{ipInfo.label}</span>
                                ) : (
                                  ipInfo.label
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Data Management Section */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2" /> Gestión de Datos y Copias de Seguridad
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                  >
                    {isExporting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Download className="w-5 h-5 mr-2 text-brand-600" />}
                    {isExporting ? 'Generando...' : 'Descargar Copia de Seguridad (JSON)'}
                  </button>
                  
                  <div className="relative flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500 cursor-pointer">
                    <label htmlFor="import-file" className="cursor-pointer flex items-center w-full justify-center">
                      <RefreshCw className="w-5 h-5 mr-2 text-green-600" />
                      <span>Restaurar desde Archivo</span>
                      <input 
                        id="import-file" 
                        type="file" 
                        accept=".json" 
                        className="sr-only" 
                        onChange={handleImportFile}
                      />
                    </label>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  * Descargue una copia regularmente para evitar pérdida de datos en caso de limpieza de caché del navegador o problemas de conexión.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
