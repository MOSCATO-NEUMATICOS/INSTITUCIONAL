
import React, { useState, useEffect } from 'react';
import { Manual, ManualCategory } from '../types';
import { Search, FileText, Download, Eye, X, BookOpen } from 'lucide-react';
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

  // Effect to manage Blob URL generation for PDF viewer
  useEffect(() => {
    let url = '';
    
    if (selectedManual?.link) {
      // Check if it's a data URI (Base64) which Chrome blocks in iframes
      if (selectedManual.link.startsWith('data:')) {
        try {
          const base64Parts = selectedManual.link.split(',');
          // If it has the header data:application/pdf;base64, take the second part
          const base64Data = base64Parts.length > 1 ? base64Parts[1] : base64Parts[0];
          
          const binaryString = window.atob(base64Data);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          url = URL.createObjectURL(blob);
          setPdfBlobUrl(url);
        } catch (error) {
          console.error("Error creating PDF blob:", error);
          setPdfBlobUrl(null); // Fallback or error state
        }
      } else {
        // Normal URL
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
      // If it has a link (Base64 PDF), download it directly
      const link = document.createElement('a');
      link.href = manual.link;
      link.download = `${manual.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (manual.textContent) {
      // If it's text content, generate a professional HTML document
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${manual.title} - Moscato Neumáticos</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; max-width: 800px; margin: 0 auto; background-color: #f9f9f9; }
            .container { background: white; padding: 50px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-top: 5px solid #0047BB; }
            header { border-bottom: 2px solid #FFD600; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            h1 { color: #0047BB; margin: 0; font-size: 24px; }
            .brand { font-weight: bold; color: #333; }
            .brand span { color: #E6C200; }
            .meta { color: #666; font-size: 0.9em; margin-top: 5px; font-style: italic; }
            .content { white-space: pre-wrap; font-size: 14px; }
            footer { margin-top: 50px; font-size: 0.8em; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <header>
              <div>
                <h1>${manual.title}</h1>
                <div class="meta">Categoría: ${manual.category} | Actualizado: ${manual.lastUpdated}</div>
              </div>
              <div class="brand">MOSCATO <span>NEUMÁTICOS</span></div>
            </header>
            <div class="content">
              ${manual.textContent}
            </div>
            <footer>
              Documento oficial generado desde el Portal Interno de Moscato Neumáticos.<br/>
              Uso interno exclusivo.
            </footer>
          </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${manual.title.replace(/\s+/g, '_')}.html`; // Download as HTML
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative animate-fade-in">
      
      {/* HERO SECTION */}
      <SectionHero
        title="Manuales y Procedimientos"
        subtitle="Biblioteca digital de documentación técnica, guías operativas y estándares de calidad de Moscato Neumáticos."
        badgeText="Base de Conocimiento"
        badgeIcon={BookOpen}
      >
        {/* Search integrated into Hero */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-md">
          <label className="block text-sm font-bold text-white mb-2">Búsqueda Rápida</label>
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
        </div>
      </SectionHero>

      {/* READER MODAL */}
      {selectedManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col border-t-8 border-gold-400">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate max-w-md">{selectedManual.title}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-300 mt-1">
                  {selectedManual.category}
                </span>
              </div>
              <button 
                onClick={() => setSelectedManual(null)}
                className="text-gray-400 hover:text-red-500 transition-colors bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content (Scrollable or Iframe) */}
            <div className="flex-grow bg-gray-100 dark:bg-gray-950 overflow-hidden relative">
              {selectedManual.textContent ? (
                 /* TEXT MODE */
                 <div className="h-full overflow-y-auto p-8">
                    <div className="prose max-w-none text-gray-800 whitespace-pre-line font-sans leading-relaxed text-base bg-white p-8 rounded-lg shadow-sm border border-gray-200 mx-auto max-w-4xl dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800">
                      {selectedManual.textContent}
                    </div>
                 </div>
              ) : selectedManual.link ? (
                 /* PDF MODE (Iframe with Blob URL) */
                 <iframe 
                    src={pdfBlobUrl || ''} 
                    className="w-full h-full border-0"
                    title="Visor de PDF"
                 >
                    <p className="p-8 text-center text-gray-500">
                      Tu navegador no soporta la visualización de PDFs. 
                      <button onClick={() => handleDownload(selectedManual)} className="text-brand-600 font-bold underline ml-1">Descárgalo aquí</button>.
                    </p>
                 </iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No hay contenido disponible para visualizar.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-xl flex justify-between items-center">
              <span className="text-xs text-gray-400 italic hidden sm:inline">
                {selectedManual.link ? 'Visualizando PDF adjunto' : 'Visualizando versión digital'}
              </span>
              <button
                onClick={() => setSelectedManual(null)}
                className="px-6 py-2 bg-brand-600 text-white font-bold rounded-md hover:bg-brand-700 transition-colors"
              >
                Cerrar
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
          <div key={manual.id} className="bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  manual.category === ManualCategory.SEGURIDAD ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                  manual.category === ManualCategory.ADMINISTRACION ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' :
                  'bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200'
                }`}>
                  {manual.category}
                </span>
                <span className="text-gray-400 text-xs">{manual.lastUpdated}</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-400" />
                {manual.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                {manual.description}
              </p>
            </div>
            
            {/* Action Buttons Footer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 rounded-b-lg border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
              <div className="flex justify-between items-center gap-2">
                {/* READ ONLINE BUTTON */}
                {(manual.textContent || manual.link) ? (
                  <button 
                    onClick={() => setSelectedManual(manual)}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold py-2 px-3 rounded flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Leer Online
                  </button>
                ) : (
                  <button disabled className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium py-2 px-3 rounded flex items-center justify-center cursor-not-allowed">
                     <Eye className="w-4 h-4 mr-2" />
                     No disp.
                  </button>
                )}

                {/* DOWNLOAD BUTTON */}
                <button
                  onClick={() => handleDownload(manual)}
                  disabled={!manual.link && !manual.textContent}
                  className={`flex-shrink-0 border p-2 rounded transition-colors ${
                    (manual.link || manual.textContent)
                      ? 'text-brand-600 hover:text-brand-800 bg-white hover:bg-brand-50 border-brand-200 dark:bg-gray-700 dark:text-brand-400 dark:border-gray-600 dark:hover:bg-gray-600 cursor-pointer'
                      : 'text-gray-300 border-gray-200 dark:bg-gray-800 dark:border-gray-700 cursor-not-allowed'
                  }`}
                  title={manual.link ? "Descargar PDF" : "Descargar Versión Imprimible"}
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredManuals.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No se encontraron manuales con los criterios seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};
