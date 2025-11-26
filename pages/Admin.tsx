
import React, { useState } from 'react';
import { Manual, ManualCategory, NewsItem, FeedbackItem } from '../types';
import { Trash2, Plus, LogIn, Save, Lock, Upload, FileText, MessageSquare, User, UserX, AlertOctagon, XCircle } from 'lucide-react';

interface AdminProps {
  manuals: Manual[];
  news: NewsItem[];
  feedbackItems?: FeedbackItem[];
  onAddManual: (manual: Manual) => void;
  onDeleteManual: (id: string) => void;
  onAddNews: (news: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onDeleteFeedback?: (id: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ 
  manuals, 
  news, 
  feedbackItems = [],
  onAddManual, 
  onDeleteManual, 
  onAddNews, 
  onDeleteNews,
  onDeleteFeedback
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); // State for login error message
  const [activeTab, setActiveTab] = useState<'manuals' | 'news' | 'messages'>('manuals');

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'manual' | 'news' | 'feedback' | null;
    id: string | null;
  }>({ isOpen: false, type: null, id: null });

  // Manual Form State
  const [newManual, setNewManual] = useState<Partial<Manual>>({
    title: '',
    description: '',
    category: ManualCategory.TALLER, // Updated default to TALLER
    readTime: '',
    link: '' // Store Base64 PDF data here
  });
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  // News Form State
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({
    title: '',
    category: 'General',
    description: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'moscato2024') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('La contraseña ingresada es incorrecta.');
      setPassword(''); // Clear password field on error
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
      
      // Convert PDF to Base64 to store in "memory" for this demo
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewManual({ ...newManual, link: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- DELETE HANDLERS ---
  const requestDelete = (type: 'manual' | 'news' | 'feedback', id: string) => {
    setDeleteModal({ isOpen: true, type, id });
  };

  const confirmDelete = () => {
    if (!deleteModal.id) return;

    if (deleteModal.type === 'manual') {
      onDeleteManual(deleteModal.id);
    } else if (deleteModal.type === 'news') {
      onDeleteNews(deleteModal.id);
    } else if (deleteModal.type === 'feedback' && onDeleteFeedback) {
      onDeleteFeedback(deleteModal.id);
    }

    setDeleteModal({ isOpen: false, type: null, id: null });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, type: null, id: null });
  };
  // -----------------------

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManual.title || !newManual.description) return;

    const manual: Manual = {
      id: Date.now().toString(),
      title: newManual.title!,
      description: newManual.description!,
      category: newManual.category || ManualCategory.TALLER,
      readTime: newManual.readTime || '5 min',
      lastUpdated: new Date().toLocaleDateString('es-AR'),
      link: newManual.link // The Base64 PDF string
    };

    onAddManual(manual);
    // Reset form
    setNewManual({ title: '', description: '', category: ManualCategory.TALLER, readTime: '', link: '' });
    setSelectedFileName('');
  };

  const submitNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.description) return;

    const newsItem: NewsItem = {
      id: Date.now().toString(),
      title: newNews.title!,
      description: newNews.description!,
      category: newNews.category || 'General',
      date: 'Hoy',
    };

    onAddNews(newsItem);
    setNewNews({ title: '', description: '', category: 'General' });
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
          
          {/* Error Message Box */}
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
                if (loginError) setLoginError(''); // Clear error when typing
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
          <div className="mt-4 text-center text-xs text-gray-400">
            <p>Hint: moscato2024</p>
          </div>
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
                Estás a punto de eliminar un {deleteModal.type === 'manual' ? 'manual' : deleteModal.type === 'news' ? 'anuncio' : 'mensaje'}. 
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
            Gestión de Manuales
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider ${
              activeTab === 'news' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Gestión de Novedades
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider ${
              activeTab === 'messages' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Buzón de Mensajes
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'manuals' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Manuals */}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tiempo de Lectura</label>
                    <input
                      type="text"
                      placeholder="Ej: 10 min"
                      value={newManual.readTime}
                      onChange={(e) => setNewManual({...newManual, readTime: e.target.value})}
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
               <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2" /> Agregar Novedad
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
                  <button type="submit" className="w-full bg-brand-600 text-white font-bold py-2 rounded-md hover:bg-brand-700">
                    <Save className="w-4 h-4 inline mr-2" /> Publicar Novedad
                  </button>
                </form>
              </div>

              {/* List News */}
              <div className="lg:col-span-2">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Novedades Publicadas ({news.length})</h3>
                 <div className="bg-white border border-gray-200 rounded-md overflow-hidden max-h-[500px] overflow-y-auto">
                   <ul className="divide-y divide-gray-200">
                     {news.map(item => (
                       <li key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                         <div>
                           <p className="font-bold text-sm text-gray-900">{item.title}</p>
                           <p className="text-xs text-gray-500">{item.date} - {item.category}</p>
                         </div>
                         <button 
                            onClick={() => requestDelete('news', item.id)}
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

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" /> Buzón de Entrada ({feedbackItems.length})
                </h3>
                <div className="text-xs text-gray-500">
                  Ordenado por más reciente
                </div>
              </div>

              {feedbackItems.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                   <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                   <p className="text-gray-500 font-medium">No hay mensajes nuevos en el buzón.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {feedbackItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-lg p-6 border-l-4 border-l-brand-500 shadow-sm hover:shadow-md transition-shadow relative"
                    >
                      <button 
                        onClick={() => requestDelete('feedback', item.id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        title="Archivar/Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex flex-col sm:flex-row sm:items-start mb-4">
                         <div className="flex-shrink-0 mr-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              item.isAnonymous ? 'bg-gray-100 text-gray-500' : 'bg-brand-100 text-brand-600'
                            }`}>
                              {item.isAnonymous ? <UserX className="w-6 h-6" /> : <User className="w-6 h-6" />}
                            </div>
                         </div>
                         <div>
                            <div className="flex items-center mb-1">
                               <h4 className="text-lg font-bold text-gray-900 mr-2">
                                 {item.isAnonymous ? 'Anónimo' : item.name}
                               </h4>
                               <span className="text-xs text-gray-500">{item.date}</span>
                            </div>
                         </div>
                      </div>

                      <div className="bg-gray-50 rounded p-4 border border-gray-100">
                        <p className="text-gray-800 text-sm whitespace-pre-wrap">"{item.message}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
