
import React, { useState } from 'react';
import { Search, Info, Car, Calendar, AlertTriangle, RotateCcw, HelpCircle, X } from 'lucide-react';

interface PlateResult {
  year: string;
  format: 'mercosur' | 'old_standard' | 'antique' | 'unknown';
  description: string;
}

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

  const estimateYear = () => {
    if (!plateInput) return;

    const p = plateInput;
    let res: PlateResult = { year: 'Desconocido', format: 'unknown', description: 'Formato no reconocido' };

    // 1. FORMATO MERCOSUR: AA 123 BB (2 Letras, 3 Números, 2 Letras) - Total 7 chars
    // Regex flexible para permitir escribir todo junto
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
    // 2. FORMATO STANDARD: AAA 123 (3 Letras, 3 Números) - Total 6 chars
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
        // Casos raros de reinscripción o anteriores
        case 'R': case 'S': case 'T': case 'U': case 'V': case 'W': case 'X': case 'Y': case 'Z':
           yearRange = '1995 (Reempadronado o Previo)'; break;
        default: yearRange = '1995 - 2016';
      }

      res = {
        year: yearRange,
        format: 'old_standard',
        description: 'Patente Nacional (1995-2016)'
      };
    }
    // 3. FORMATO ANTIGUO: X 123456 (Letra provincia + numeros)
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
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg border-t-4 border-t-indigo-600 animate-fade-in">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 text-indigo-700">
              <Car className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Calculadora de Año por Patente</h3>
              <p className="text-sm text-gray-500">Estimación de modelo basada en la serie de la matrícula.</p>
            </div>
          </div>
          {/* Standardized Help Button (Indigo Theme) */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-md border border-indigo-100 hover:border-indigo-200 transition-colors"
            title="Ayuda / Formatos"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Ayuda
          </button>
        </div>

        {/* HELP SECTION */}
        {showHelp && (
          <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4 animate-fade-in relative">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-indigo-900 mb-2">Formatos Soportados</h4>
            <ul className="text-xs text-indigo-800 space-y-1 list-disc list-inside">
              <li><strong>Mercosur (Actual):</strong> 2 Letras + 3 Números + 2 Letras (ej: AA 123 BB). Desde 2016.</li>
              <li><strong>Nacional (Anterior):</strong> 3 Letras + 3 Números (ej: OMD 458). 1995-2016.</li>
              <li><strong>Provincial (Antiguo):</strong> 1 Letra + 6/7 Números (ej: C 1234567). Pre-1995.</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
          
          {/* Input Section */}
          <div className="space-y-6">
             <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Ingrese la Patente (sin espacios)
                </label>
                
                {/* Visual Plate Input Container */}
                <div className="relative max-w-xs mx-auto md:mx-0">
                  <div className={`border-4 rounded-lg p-1 shadow-sm flex items-center justify-center bg-white ${
                    result?.format === 'mercosur' ? 'border-blue-600' : 'border-black'
                  }`}>
                    {/* Mercosur Header Strip */}
                    {(!result || result.format === 'mercosur' || plateInput.length > 6) && (
                       <div className="absolute top-0 left-0 right-0 h-4 bg-blue-700 rounded-t-sm flex justify-between px-2 items-center">
                          <span className="text-[0.4rem] text-white font-bold">ARGENTINA</span>
                          <div className="w-3 h-2 bg-yellow-400 rounded-full opacity-80"></div>
                       </div>
                    )}
                    
                    <input
                      type="text"
                      value={plateInput}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      maxLength={7}
                      placeholder="AA123BB"
                      className={`w-full text-center text-4xl font-mono font-bold uppercase outline-none bg-transparent pt-4 pb-2 tracking-widest ${
                         !plateInput ? 'placeholder-gray-200' : 'text-gray-800'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">Ejemplos: AA123BB, OMD458, C123456</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={estimateYear}
                    disabled={plateInput.length < 6}
                    className={`flex-1 font-bold py-3 px-4 rounded-md shadow-sm transition-colors flex items-center justify-center ${
                      plateInput.length < 6 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Consultar Año
                  </button>
                   <button
                    onClick={handleReset}
                    className="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 font-medium py-3 px-4 rounded-md transition-colors"
                    title="Limpiar"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
             </div>
             
             <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
               <div className="flex">
                 <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                 <p className="text-xs text-blue-800">
                   Esta herramienta proporciona una <strong>estimación aproximada</strong> basada en la fecha de inscripción inicial. Puede variar si el vehículo fue reempadronado.
                 </p>
               </div>
             </div>
          </div>

          {/* Result Section */}
          <div className="flex flex-col justify-center">
             {result ? (
               <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-md text-center animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full blur-xl opacity-50"></div>
                  
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-4">
                    RESULTADO ENCONTRADO
                  </span>
                  
                  <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Modelo Estimado</h4>
                  <div className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-2">
                    {result.year}
                  </div>
                  
                  <div className="w-16 h-1 bg-indigo-200 mx-auto mb-4 rounded-full"></div>
                  
                  <p className="text-gray-600 font-medium flex items-center justify-center">
                    <Car className="w-4 h-4 mr-2 text-indigo-500" />
                    {result.description}
                  </p>
                  
                  {result.format === 'unknown' && (
                    <div className="mt-4 bg-red-50 text-red-700 p-3 rounded text-sm flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Formato no válido o incompleto.
                    </div>
                  )}
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-xl p-6">
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
