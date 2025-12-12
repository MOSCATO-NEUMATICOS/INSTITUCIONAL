
import React, { useState } from 'react';
import { NewsItem } from '../../types';
import { Plus, Edit2, X, Save, Star, Trash2, Clock, CalendarX } from 'lucide-react';

interface AdminNewsProps {
  news: NewsItem[];
  onAddNews: (news: NewsItem) => void;
  onUpdateNews: (news: NewsItem) => void;
  onDeleteNews: (id: string) => void;
}

export const AdminNews: React.FC<AdminNewsProps> = ({ news, onAddNews, onUpdateNews, onDeleteNews }) => {
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({
    title: '',
    category: 'General',
    description: '',
    highlight: false,
    highlightDuration: 15,
    autoDelete: false,
    autoDeleteDuration: 30
  });
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  const handleEditNews = (item: NewsItem) => {
    setNewNews({ 
      ...item,
      // Asegurar valores por defecto si son registros viejos
      highlightDuration: item.highlightDuration || 15,
      autoDelete: item.autoDelete || false,
      autoDeleteDuration: item.autoDeleteDuration || 30
    });
    setEditingNewsId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditNews = () => {
    setNewNews({ 
      title: '', 
      description: '', 
      category: 'General', 
      highlight: false,
      highlightDuration: 15,
      autoDelete: false,
      autoDeleteDuration: 30
    });
    setEditingNewsId(null);
  };

  const submitNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.description) return;

    // Construir el objeto base
    const baseData = {
      title: newNews.title!,
      description: newNews.description!,
      category: newNews.category || 'General',
      highlight: newNews.highlight || false,
      highlightDuration: newNews.highlight ? (newNews.highlightDuration || 15) : undefined,
      autoDelete: newNews.autoDelete || false,
      autoDeleteDuration: newNews.autoDelete ? (newNews.autoDeleteDuration || 30) : undefined
    };

    if (editingNewsId) {
      // Al editar mantenemos la fecha original y el ID
      const existingItem = news.find(n => n.id === editingNewsId);
      const updatedNews: NewsItem = {
        ...existingItem!, // Mantener fecha original y otros datos
        ...baseData,
        id: editingNewsId
      };
      onUpdateNews(updatedNews);
      cancelEditNews();
    } else {
      const newsItem: NewsItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('es-AR'),
        ...baseData
      };
      onAddNews(newsItem);
      setNewNews({ 
        title: '', 
        description: '', 
        category: 'General', 
        highlight: false,
        highlightDuration: 15,
        autoDelete: false,
        autoDeleteDuration: 30
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        {/* Form News */}
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

          {/* Opciones de Destacado y Auto-Eliminación */}
          <div className="space-y-3 pt-2">
            
            {/* Destacado */}
            <div className={`p-3 rounded border transition-colors ${newNews.highlight ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="highlight" 
                    checked={newNews.highlight || false}
                    onChange={(e) => setNewNews({...newNews, highlight: e.target.checked})}
                    className="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
                  />
                  <label htmlFor="highlight" className="text-sm font-bold text-gray-700 flex items-center cursor-pointer">
                    <Star className="w-4 h-4 text-gold-500 mr-1" />
                    Destacada
                  </label>
                </div>
              </div>
              
              {newNews.highlight && (
                <div className="mt-3 flex items-center animate-fade-in pl-6">
                  <label className="text-xs font-medium text-gray-600 mr-2 whitespace-nowrap">Duración (días):</label>
                  <input 
                    type="number" 
                    min="1"
                    max="365"
                    value={newNews.highlightDuration}
                    onChange={(e) => setNewNews({...newNews, highlightDuration: parseInt(e.target.value) || 15})}
                    className="w-20 text-xs border-gray-300 rounded p-1 border text-center font-bold"
                  />
                  <span className="text-xs text-gray-400 ml-2 italic">Días visible en cartelera</span>
                </div>
              )}
            </div>

            {/* Auto Eliminación */}
            <div className={`p-3 rounded border transition-colors ${newNews.autoDelete ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="autoDelete" 
                    checked={newNews.autoDelete || false}
                    onChange={(e) => setNewNews({...newNews, autoDelete: e.target.checked})}
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="autoDelete" className="text-sm font-bold text-gray-700 flex items-center cursor-pointer">
                    <CalendarX className="w-4 h-4 text-red-500 mr-1" />
                    Auto-Eliminación
                  </label>
                </div>
              </div>

              {newNews.autoDelete && (
                <div className="mt-3 flex items-center animate-fade-in pl-6">
                  <label className="text-xs font-medium text-gray-600 mr-2 whitespace-nowrap">Eliminar tras:</label>
                  <input 
                    type="number" 
                    min="1"
                    max="365"
                    value={newNews.autoDeleteDuration}
                    onChange={(e) => setNewNews({...newNews, autoDeleteDuration: parseInt(e.target.value) || 30})}
                    className="w-20 text-xs border-gray-300 rounded p-1 border text-center font-bold"
                  />
                  <span className="text-xs text-gray-400 ml-2 italic">días desde publicación</span>
                </div>
              )}
            </div>

          </div>
          
          <div className="flex space-x-3 pt-2">
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
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden max-h-[600px] overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {news.map(item => (
                <li key={item.id} className={`p-4 flex justify-between items-center hover:bg-gray-50 group transition-colors ${item.highlight ? 'bg-yellow-50/50' : ''}`}>
                  <div className="flex-grow">
                    <div className="flex items-center flex-wrap gap-2">
                      <p className="font-bold text-sm text-gray-900">{item.title}</p>
                      {item.highlight && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800 border border-yellow-200" title={`Destacada por ${item.highlightDuration || 15} días`}>
                          <Star className="w-3 h-3 mr-1 fill-current" /> {item.highlightDuration || 15}d
                        </span>
                      )}
                      {item.autoDelete && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600 border border-red-100" title={`Se elimina en ${item.autoDeleteDuration} días`}>
                          <Clock className="w-3 h-3 mr-1" /> {item.autoDeleteDuration}d
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-500 mr-3">{item.date}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1 pl-4">
                    <button 
                      onClick={() => handleEditNews(item)}
                      className="text-gray-400 hover:text-orange-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDeleteNews(item.id)}
                      className="text-gray-400 hover:text-red-500 p-2"
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
  );
};
