
import React, { useState } from 'react';
import { Manual, ManualCategory } from '../../types';
import { Plus, Save, Upload, FileText, Trash2, Info, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

interface AdminManualsProps {
  manuals: Manual[];
  onAddManual: (manual: Manual) => void;
  onDeleteManual: (id: string) => void;
}

export const AdminManuals: React.FC<AdminManualsProps> = ({ manuals = [], onAddManual, onDeleteManual }) => {
  const [newManual, setNewManual] = useState<Partial<Manual>>({
    title: '',
    description: '',
    category: ManualCategory.TALLER,
    link: '' 
  });
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor, sube solo archivos PDF.');
        return;
      }
      
      setSelectedFileName(file.name);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setNewManual(prev => ({ ...prev, link: base64 }));
        
        // Iniciar análisis con IA
        setIsAnalyzing(true);
        try {
          const suggestions = await geminiService.analyzeManualPdf(base64);
          if (suggestions) {
            setNewManual(prev => ({
              ...prev,
              title: suggestions.title || prev.title,
              description: suggestions.description || prev.description,
              category: (suggestions.category as ManualCategory) || prev.category
            }));
          }
        } catch (error) {
          console.error("Error analizando con IA:", error);
        } finally {
          setIsAnalyzing(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManual.title || !newManual.description) {
      alert("Título y descripción son obligatorios.");
      return;
    }

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Form Manuals */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 h-fit transition-colors">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-brand-600" /> Agregar Nuevo Manual
        </h3>
        
        <form onSubmit={submitManual} className="space-y-4">
          {/* File Upload Section - First step for AI to work */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">1. Adjuntar Archivo PDF</label>
            <div className="flex items-center justify-center w-full">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${selectedFileName ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center text-brand-600 dark:text-brand-400">
                      <Loader2 className="w-10 h-10 mb-2 animate-spin" />
                      <p className="text-sm font-bold animate-pulse">Analizando contenido con IA...</p>
                    </div>
                  ) : selectedFileName ? (
                      <div className="flex flex-col items-center text-brand-600 dark:text-brand-400">
                        <FileText className="w-10 h-10 mb-2" />
                        <p className="text-sm font-bold truncate max-w-[200px]">{selectedFileName}</p>
                        <p className="text-[10px] mt-1 text-gray-400">Click para cambiar archivo</p>
                      </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center px-4">Selecciona un PDF para que la IA sugiera los detalles</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={handleFileChange}
                  disabled={isAnalyzing}
                />
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex justify-between items-center">
              2. Detalles del Manual
              {isAnalyzing && <span className="text-[10px] bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full animate-pulse flex items-center"><Sparkles className="w-3 h-3 mr-1" /> IA Trabajando</span>}
            </label>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Título</label>
                <input
                  type="text"
                  required
                  value={newManual.title}
                  onChange={(e) => setNewManual({...newManual, title: e.target.value})}
                  className="block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm border p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 transition-all"
                  placeholder="Ej: Protocolo de Alineación 3D"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Categoría</label>
                <select
                  value={newManual.category}
                  onChange={(e) => setNewManual({...newManual, category: e.target.value as ManualCategory})}
                  className="block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm border p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                >
                  {Object.values(ManualCategory).filter(c => c !== ManualCategory.ALL).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Descripción Breve</label>
                <textarea
                  required
                  rows={3}
                  value={newManual.description}
                  onChange={(e) => setNewManual({...newManual, description: e.target.value})}
                  className="block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm border p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  placeholder="Resumen del manual..."
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isAnalyzing}
            className={`w-full text-white font-black py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group ${isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}
          >
            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
            PUBLICAR MANUAL
          </button>
        </form>
      </div>

      {/* List Manuals */}
      <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-brand-600" />
                Biblioteca de Manuales ({manuals.length})
            </h3>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
            {manuals.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {manuals.map(manual => (
                    <li key={manual.id} className="p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900 dark:text-white truncate">{manual.title}</p>
                            {manual.link && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-black px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">PDF</span>}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{manual.category}</span>
                            <span className="text-[10px] text-gray-400 font-medium">Actualizado: {manual.lastUpdated}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-1">{manual.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <button 
                            onClick={() => { if(confirm('¿Desea eliminar permanentemente este manual?')) onDeleteManual(manual.id); }}
                            className="text-gray-300 hover:text-red-600 p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                    </li>
                ))}
                </ul>
            ) : (
                <div className="p-12 text-center flex flex-col items-center">
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-full mb-4">
                        <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-50 dark:text-gray-400 font-medium">No hay manuales cargados.</p>
                </div>
            )}
          </div>
      </div>
    </div>
  );
};
