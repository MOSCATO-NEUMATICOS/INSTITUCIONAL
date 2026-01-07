
import React, { useState, useEffect } from 'react';
import { Manual, ManualCategory } from '../types';
import { Search, FileText, Download, Eye, X, BookOpen, HelpCircle, Info } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';

interface ManualsProps {
  manuals: Manual[];
}

export const Manuals: React.FC<ManualsProps> = ({ manuals }) => {
  const [selectedCategory, setSelectedCategory] = useState<ManualCategory>(ManualCategory.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const base64ToBlob = (base64: string, type: string) => {
    const binStr = atob(base64);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type });
  };

  useEffect(() => {
    let url = '';
    if (selectedManual?.link) {
      if (selectedManual.link.startsWith('data:application/pdf;base64,')) {
        try {
          const base64Content = selectedManual.link.split(',')[1];
          const blob = base64ToBlob(base64Content, 'application/pdf');
          url = URL.createObjectURL(blob);
          setPdfBlobUrl(url);
        } catch (error) {
          console.error("Error creating PDF blob:", error);
          setPdfBlobUrl(null);
        }
      } else if (selectedManual.link.startsWith('http')) {
        setPdfBlobUrl(selectedManual.link);
      }
    } else {
      setPdfBlobUrl(null);
    }
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [selectedManual]);

  const filteredManuals = manuals.filter(manual => {
    const matchesCategory = selectedCategory === ManualCategory.ALL || manual.category === selectedCategory;
    const matchesSearch = manual.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          manual.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (manual: Manual) => {
    if (manual.link) {
      const link = document.createElement('a');
      link.href = manual.link;
      link.download = `${manual.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative animate-fade-in">
      
      <SectionHero
        title="Manuales y Procedimientos"
        subtitle="Biblioteca digital de documentación técnica, guías operativas y estándares de calidad de Moscato Neumáticos."
        badgeText="Base de Conocimiento"
        badgeIcon={BookOpen}
      >
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-md shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-black uppercase tracking-wider text-white">Buscador</label>
            <button onClick={() => setShowHelp(!showHelp)} className="text-gold-400 hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border-0 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-400 shadow-lg dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border dark:border-gray-700"
              placeholder="¿Qué estás buscando?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-[10px] text-brand-100 mt-2 text-center font-bold uppercase tracking-widest opacity-80">
            {filteredManuals.length} documentos encontrados
          </p>

          {showHelp && (
            <div className="mt-4 bg-brand-800/95 border border-gold-500/50 p-4 rounded-xl text-xs text-brand-50 relative animate-fade-in backdrop-blur-md shadow-2xl">
                <button onClick={() => setShowHelp(false)} className="absolute top-2 right-2 text-gold-400 hover:text-white"><X className="w-4 h-4"/></button>
                <h4 className="font-bold text-gold-400 mb-2 flex items-center uppercase tracking-tighter"><Info className="w-3 h-3 mr-1.5"/> ¿Necesitás ayuda?</h4>
                <p>Podés buscar por palabras clave o filtrar por sector usando los botones de abajo.</p>
            </div>
          )}
        </div>
      </SectionHero>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 space-x-2 scrollbar-hide">
        {Object.values(ManualCategory).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-sm ${
              selectedCategory === category
                ? 'bg-brand-600 text-white shadow-md ring-2 ring-gold-400 dark:ring-gold-500'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Manuals Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredManuals.map((manual) => (
          <div key={manual.id} className="group bg-white dark:bg-gray-800 flex flex-col rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  manual.category === ManualCategory.SEGURIDAD ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100' :
                  manual.category === ManualCategory.ADMINISTRACION ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-100' :
                  'bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-100'
                }`}>
                  {manual.category}
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-[10px] font-black tracking-tighter">{manual.lastUpdated}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center group-hover:text-brand-600 dark:group-hover:text-gold-400 transition-colors">
                <FileText className="w-5 h-5 mr-2 text-brand-500" />
                {manual.title}
              </h3>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
                {manual.description}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                <button 
                  onClick={() => setSelectedManual(manual)}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black py-2.5 px-4 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  LEER ONLINE
                </button>

                <button
                  onClick={() => handleDownload(manual)}
                  className="flex-shrink-0 bg-white dark:bg-gray-700 text-gray-600 dark:text-white border border-gray-200 dark:border-gray-600 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                  title="Descargar"
                >
                  <Download className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Visor */}
      {selectedManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[94vh] flex flex-col border-t-8 border-gold-400 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex flex-col">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white truncate max-w-md">{selectedManual.title}</h3>
                <span className="text-[10px] font-black text-brand-600 dark:text-gold-400 uppercase tracking-[0.2em]">{selectedManual.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedManual(null)} className="text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-800 p-2 rounded-full transition-all">
                  <X className="w-7 h-7" />
                </button>
              </div>
            </div>
            
            <div className="flex-grow bg-gray-100 dark:bg-gray-950 relative overflow-hidden">
               {pdfBlobUrl && (
                 <object 
                    data={pdfBlobUrl} 
                    type="application/pdf" 
                    className="w-full h-full"
                 >
                    <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                      <FileText className="w-20 h-20 text-gray-300 mb-4" />
                      <p className="text-white font-bold">No se puede mostrar el PDF directamente.</p>
                      <button onClick={() => handleDownload(selectedManual)} className="mt-4 bg-brand-600 text-white px-6 py-2 rounded-lg font-bold">Descargar PDF</button>
                    </div>
                 </object>
               )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between items-center px-8">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Moscato Neumáticos</span>
              <button onClick={() => setSelectedManual(null)} className="px-10 py-3 bg-brand-600 text-white font-black rounded-xl hover:bg-brand-700 shadow-xl transition-all uppercase tracking-widest text-xs">Cerrar Visor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
