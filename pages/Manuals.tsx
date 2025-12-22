
import React, { useState, useEffect } from 'react';
import { Manual, ManualCategory } from '../types';
import { Search, FileText, Download, Eye, X, BookOpen, HelpCircle, Info, ExternalLink } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';

interface ManualsProps {
  manuals: Manual[];
}

export const Manuals: React.FC<ManualsProps> = ({ manuals }) => {
  const [selectedCategory, setSelectedCategory] = useState<ManualCategory>(ManualCategory.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the Reader Modal
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  
  // UI State
  const [showHelp, setShowHelp] = useState(false);

  // Helper to convert base64 to Blob
  const base64ToBlob = (base64: string, type: string) => {
    const binStr = atob(base64);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type });
  };

  // Effect to manage Blob URL generation for PDF viewer
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

    // Cleanup to prevent memory leaks
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
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
    } else if (manual.textContent) {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>${manual.title} - Moscato Neumáticos</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; max-width: 800px; margin: 0 auto; }
            header { border-bottom: 2px solid #FFD600; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { color: #0047BB; margin: 0; }
            .content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <header>
            <h1>${manual.title}</h1>
            <p>Categoría: ${manual.category} | Actualizado: ${manual.lastUpdated}</p>
          </header>
          <div class="content">${manual.textContent}</div>
        </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${manual.title.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-md">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-white">Búsqueda Rápida</label>
            <button onClick={() => setShowHelp(!showHelp)} className="text-brand-200 hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gold-400 shadow-lg"
              placeholder="Buscar por título o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-xs text-brand-200 mt-2 text-center">
            {filteredManuals.length} documentos disponibles
          </p>

          {showHelp && (
            <div className="mt-4 bg-brand-800/90 border border-brand-500/50 p-4 rounded-xl text-xs text-brand-100 relative animate-fade-in backdrop-blur-sm shadow-lg">
                <button onClick={() => setShowHelp(false)} className="absolute top-2 right-2 text-brand-400 hover:text-white"><X className="w-3 h-3"/></button>
                <h4 className="font-bold text-white mb-2 flex items-center"><Info className="w-3 h-3 mr-1.5"/> ¿Falta algún procedimiento?</h4>
                <p>Enviala por el <strong>Buzón de Sugerencias</strong> o contactá a administración.</p>
            </div>
          )}
        </div>
      </SectionHero>

      {/* READER MODAL */}
      {selectedManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col border-t-8 border-gold-400 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate max-w-md">{selectedManual.title}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-300 mt-1">
                  {selectedManual.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleDownload(selectedManual)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold transition-colors border border-gray-200 dark:border-gray-600"
                >
                  <Download className="w-4 h-4" /> Descargar
                </button>
                <button 
                  onClick={() => setSelectedManual(null)}
                  className="text-gray-400 hover:text-red-500 transition-colors bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="flex-grow bg-gray-100 dark:bg-gray-950 relative">
              {selectedManual.textContent ? (
                 <div className="h-full overflow-y-auto p-8">
                    <div className="prose max-w-none text-gray-800 whitespace-pre-line font-sans leading-relaxed text-base bg-white p-10 rounded-lg shadow-sm border border-gray-200 mx-auto max-w-4xl dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800">
                      {selectedManual.textContent}
                    </div>
                 </div>
              ) : pdfBlobUrl ? (
                 /* Usamos <object> para mejor compatibilidad con PDFs */
                 <object 
                    data={pdfBlobUrl} 
                    type="application/pdf" 
                    className="w-full h-full"
                 >
                    <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No se puede previsualizar el PDF</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Su navegador o dispositivo no permite ver el PDF directamente aquí.</p>
                        <button 
                          onClick={() => handleDownload(selectedManual)}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-md"
                        >
                          <Download className="w-5 h-5" /> Descargar para leer
                        </button>
                      </div>
                    </div>
                 </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No hay contenido disponible para visualizar.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center px-6">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                Moscato Neumáticos - Portal Interno
              </span>
              <button
                onClick={() => setSelectedManual(null)}
                className="px-8 py-2 bg-brand-600 text-white font-black rounded-lg hover:bg-brand-700 transition-colors shadow-lg"
              >
                CERRAR VISOR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-6 space-x-2 scrollbar-hide">
        {Object.values(ManualCategory).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Manuals Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredManuals.map((manual) => (
          <div key={manual.id} className="group bg-white dark:bg-gray-800 flex flex-col rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  manual.category === ManualCategory.SEGURIDAD ? 'bg-red-100 text-red-800 dark:bg-red-900/50' :
                  manual.category === ManualCategory.ADMINISTRACION ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50' :
                  'bg-brand-100 text-brand-800 dark:bg-brand-900/50'
                }`}>
                  {manual.category}
                </span>
                <span className="text-gray-400 text-[10px] font-bold">{manual.lastUpdated}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                <FileText className="w-5 h-5 mr-2 text-gray-400" />
                {manual.title}
              </h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {manual.description}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                {(manual.textContent || manual.link) ? (
                  <button 
                    onClick={() => setSelectedManual(manual)}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black py-2.5 px-4 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    LEER ONLINE
                  </button>
                ) : (
                  <button disabled className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-400 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center cursor-not-allowed">
                     NO DISPONIBLE
                  </button>
                )}

                <button
                  onClick={() => handleDownload(manual)}
                  className="flex-shrink-0 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                  title="Descargar"
                >
                  <Download className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}

        {filteredManuals.length === 0 && (
          <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron manuales con los criterios seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};
