
import React, { useState } from 'react';
import { Manual, ManualCategory } from '../../types';
import { Plus, Save, Upload, FileText, Trash2 } from 'lucide-react';

interface AdminManualsProps {
  manuals: Manual[];
  onAddManual: (manual: Manual) => void;
  onDeleteManual: (id: string) => void;
}

export const AdminManuals: React.FC<AdminManualsProps> = ({ manuals, onAddManual, onDeleteManual }) => {
  const [newManual, setNewManual] = useState<Partial<Manual>>({
    title: '',
    description: '',
    category: ManualCategory.TALLER,
    link: '' 
  });
  const [selectedFileName, setSelectedFileName] = useState<string>('');

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
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
                    onClick={() => onDeleteManual(manual.id)}
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
  );
};
