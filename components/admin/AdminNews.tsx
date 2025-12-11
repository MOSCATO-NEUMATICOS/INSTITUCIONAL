
import React, { useState } from 'react';
import { NewsItem } from '../../types';
import { Plus, Edit2, X, Save, Star, Trash2 } from 'lucide-react';

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
    highlight: false
  });
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

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
                      onClick={() => onDeleteNews(item.id)}
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
  );
};
