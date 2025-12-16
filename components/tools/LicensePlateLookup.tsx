
import React, { useState, useMemo } from 'react';
import { Search, Info, Car, Calendar, AlertTriangle, RotateCcw, HelpCircle, X } from 'lucide-react';

interface PlateResult {
  year: string;
  format: 'mercosur' | 'old_standard' | 'antique' | 'unknown';
  description: string;
}

type PlateStyle = 'mercosur' | 'legacy' | 'antique';

export const LicensePlateLookup: React.FC = () => {
  const [plateInput, setPlateInput] = useState('');
  const [result, setResult] = useState<PlateResult | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force uppercase and remove spaces/special chars
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length <= 9) { // Max length safety
      setPlateInput(val);
    }
  };

  // Detect style based on input pattern while typing
  const detectedStyle: PlateStyle = useMemo(() => {
    const p = plateInput;
    if (p.length === 0) return 'mercosur'; // Default

    // Antique: 1 Letter + Number (e.g. C1...)
    if (/^[A-Z]\d/.test(p)) return 'antique';

    // Legacy 1995: 3 Letters start (e.g. AAA...)
    if (/^[A-Z]{3}/.test(p)) return 'legacy';

    // Mercosur: 2 Letters + Number (e.g. AA1...)
    // Or default if ambiguous (AA...)
    return 'mercosur';
  }, [plateInput]);

  const estimateYear = () => {
    if (!plateInput) return;

    const p = plateInput;
    let res: PlateResult = { year: 'Desconocido', format: 'unknown', description: 'Formato no reconocido' };

    // 1. FORMATO MERCOSUR: AA 123 BB
    if (/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(p)) {
      const start = p.substring(0, 2);
      let year = '2016';
      
      if (start === 'AA') year = '2016';
      else if (start === 'AB') year = 'Enero 2017 - Octubre 2017';
      else if (start === 'AC') year = 'Octubre 2017 - Julio 2018';
      else if (start === 'AD') year = 'Julio 2018 - Agosto 2019';
      else if (start === 'AE') year = 'Agosto 2019 - Enero 2021';
      else if (start === 'AF') year = 'Enero 2021 - 2022';
      else if (start === 'AG') year = '2023 - 2024';
      else if (start >= 'AH') year = '2024 - 2025';
      
      res = {
        year: year,
        format: 'mercosur',
        description: 'Patente Mercosur (Post-2016)'
      };
    }
    // 2. FORMATO STANDARD: AAA 123
    else if (/^[A-Z]{3}\d{3}$/.test(p)) {
      const firstChar = p[0];
      let yearRange = '';

      switch (firstChar) {
        case 'A': yearRange = '1995 - 1996'; break;
        case 'B': yearRange = '1996 - 1997'; break;
        case 'C': yearRange = '1997 - 1998'; break;
        case 'D': yearRange = '1999 - 2000'; break;
        case 'E': yearRange = '2000 - 2001'; break;
        case 'F': yearRange = '2001 - 2005'; break;
        case 'G': yearRange = '2006 - 2007'; break;
        case 'H': yearRange = '2008 - 2009'; break;
        case 'I': yearRange = '2010 - 2011'; break;
        case 'J': yearRange = '2011 - 2012'; break;
        case 'K': yearRange = '2012'; break;
        case 'L': yearRange = '2012 - 2013'; break;
        case 'M': yearRange = '2013 - 2014'; break;
        case 'N': yearRange = '2014 - 2015'; break;
        case 'O': yearRange = '2015'; break;
        case 'P': yearRange = '2015 - 2016 (Abril)'; break;
        // R a Z suelen ser reempadronados o anteriores
        default: yearRange = '1995 (Reempadronado o Previo)';
      }

      res = {
        year: yearRange,
        format: 'old_standard',
        description: 'Patente Nacional (1995-2016)'
      };
    }
    // 3. FORMATO ANTIGUO: X 123456
    else if (/^[A-Z]{1}\d{6,7}$/.test(p)) {
      res = {
        year: 'Pre-1995',
        format: 'antique',
        description: 'Patente Provincial Antigua'
      };
    }

    setResult(res);
  };

  const handleReset = () => {
    setPlateInput('');
    setResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      estimateYear();
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg border-t-4 border-t-indigo-600 animate-fade-in transition-colors">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-4 text-indigo-700 dark:text-indigo-400">
              <Car className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Calculadora de Año por Patente</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Estimación de modelo basada en la serie de la matrícula.</p>
            </div>
          </div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-md border border-indigo-100 dark:border-indigo-800 hover:border-indigo-200 transition-colors"
            title="Ayuda / Formatos"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ayuda</span>
          </button>
        </div>

        {/* HELP SECTION */}
        {showHelp && (
          <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 animate-fade-in relative">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">Formatos Soportados</h4>
            <ul className="text-xs text-indigo-800 dark:text-indigo-200 space-y-1 list-disc list-inside">
              <li><strong>Mercosur (Actual):</strong> 2 Letras + 3 Números + 2 Letras (ej: AA 123 BB).</li>
              <li><strong>Nacional (1995-2016):</strong> 3 Letras + 3 Números (ej: OMD 458).</li>
              <li><strong>Provincial (Antigua):</strong> 1 Letra + 6/7 Números (ej: C 1234567).</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
          
          {/* Input Section */}
          <div className="space-y-6">
             <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                  Ingrese la Patente (sin espacios)
                </label>
                
                {/* Visual Plate Input Container */}
                <div className="relative max-w-xs mx-auto md:mx-0 transform hover:scale-105 transition-transform duration-300">
                  <div 
                    className={`border-4 rounded-lg p-1 shadow-lg flex items-center justify-center transition-all duration-500 relative overflow-hidden ${
                      detectedStyle === 'mercosur' 
                        ? 'bg-white border-black h-24 ring-1 ring-gray-400' 
                        : 'bg-black border-white h-24 ring-1 ring-black'
                    }`}
                  >
                    {/* Mercosur Header Strip */}
                    {detectedStyle === 'mercosur' && (
                       <div className="absolute top-0 left-0 right-0 h-7 bg-blue-800 flex justify-between px-2 items-center z-10 border-b border-blue-900">
                          <span className="text-[0.55rem] text-white font-bold tracking-widest ml-1 opacity-90">REPUBLICA ARGENTINA</span>
                          <div className="w-4 h-4 bg-white/20 rounded-full border border-white/40 shadow-inner"></div>
                       </div>
                    )}
                    
                    <input
                      type="text"
                      value={plateInput}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      maxLength={detectedStyle === 'antique' ? 8 : 7}
                      placeholder={detectedStyle === 'mercosur' ? "AA 123 BB" : "AAA 123"}
                      className={`w-full text-center font-mono font-bold uppercase outline-none bg-transparent tracking-widest z-20 transition-colors duration-300 ${
                         detectedStyle === 'mercosur'
                           ? 'text-black placeholder-gray-300 text-4xl pt-5' 
                           : 'text-white placeholder-gray-600 text-5xl pt-0'
                      }`}
                    />

                    {/* Legacy Footer Text */}
                    {detectedStyle !== 'mercosur' && (
                      <div className="absolute bottom-1 w-full text-center pointer-events-none">
                        <span className="text-[0.5rem] text-white font-bold tracking-[0.2em] opacity-60">ARGENTINA</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Hints below input */}
                  <div className="flex justify-center mt-3 px-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      detectedStyle === 'mercosur' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 
                      detectedStyle === 'legacy' ? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white' :
                      'bg-gray-800 text-gray-200'
                    }`}>
                      Formato detectado: {
                        detectedStyle === 'mercosur' ? 'Mercosur' : 
                        detectedStyle === 'legacy' ? '1995-2016' : 'Antigua'
                      }
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={estimateYear}
                    disabled={plateInput.length < 3}
                    className={`flex-1 font-bold py-3 px-4 rounded-md shadow-sm transition-colors flex items-center justify-center ${
                      plateInput.length < 3 
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Consultar Año
                  </button>
                   <button
                    onClick={handleReset}
                    className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-medium py-3 px-4 rounded-md transition-colors"
                    title="Limpiar"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
             </div>
             
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800">
               <div className="flex">
                 <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                 <p className="text-xs text-blue-800 dark:text-blue-200">
                   El recuadro cambiará de color automáticamente (Blanco/Negro) según el formato que escribas.
                 </p>
               </div>
             </div>
          </div>

          {/* Result Section */}
          <div className="flex flex-col justify-center">
             {result ? (
               <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-indigo-900 rounded-xl p-6 shadow-md text-center animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/50 rounded-full blur-xl opacity-50"></div>
                  
                  <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold mb-4">
                    RESULTADO ENCONTRADO
                  </span>
                  
                  <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">Modelo Estimado</h4>
                  <div className="text-4xl md:text-5xl font-extrabold text-indigo-900 dark:text-indigo-300 mb-2">
                    {result.year}
                  </div>
                  
                  <div className="w-16 h-1 bg-indigo-200 dark:bg-indigo-800 mx-auto mb-4 rounded-full"></div>
                  
                  <p className="text-gray-600 dark:text-gray-300 font-medium flex items-center justify-center">
                    <Car className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                    {result.description}
                  </p>
                  
                  {result.format === 'unknown' && (
                    <div className="mt-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded text-sm flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Formato no válido o incompleto.
                    </div>
                  )}
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6">
                 <Calendar className="w-16 h-16 mb-4 opacity-50" />
                 <p className="text-sm font-medium">Ingrese una patente para ver el resultado</p>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};
