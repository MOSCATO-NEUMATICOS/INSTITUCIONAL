
import React, { useState } from 'react';
import { Wrench, Calculator, RotateCcw, HelpCircle, X } from 'lucide-react';

type UnitType = 'PSI' | 'BAR' | 'KPA';

export const UnitConverter: React.FC = () => {
  const [pressureInput, setPressureInput] = useState<string>('');
  const [inputUnit, setInputUnit] = useState<UnitType>('PSI');
  const [results, setResults] = useState<{ psi: string; bar: string; kpa: string } | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleCalculate = () => {
    const val = parseFloat(pressureInput);
    if (isNaN(val)) return;

    let psi = 0;
    let bar = 0;
    let kpa = 0;

    switch (inputUnit) {
      case 'PSI':
        psi = val;
        bar = val * 0.0689476;
        kpa = val * 6.89476;
        break;
      case 'BAR':
        bar = val;
        psi = val * 14.5038;
        kpa = val * 100;
        break;
      case 'KPA':
        kpa = val;
        psi = val * 0.145038;
        bar = val * 0.01;
        break;
    }

    setResults({
      psi: psi.toFixed(1),
      bar: bar.toFixed(2),
      kpa: kpa.toFixed(1)
    });
  };

  const handleReset = () => {
    setPressureInput('');
    setResults(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg border-t-4 border-t-brand-500 animate-fade-in transition-colors">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mr-4 text-brand-600 dark:text-brand-400">
              <Wrench className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Convertidor de Presión</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Calculadora universal (PSI / BAR / kPa)</p>
            </div>
          </div>
          {/* Help Button */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center justify-center p-2 text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 bg-brand-50 dark:bg-brand-900/30 hover:bg-brand-100 dark:hover:bg-brand-900/50 border border-brand-200 dark:border-brand-800 rounded-md transition-colors"
            title="Ayuda"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* HELP SECTION */}
        {showHelp && (
          <div className="mb-6 bg-brand-50 dark:bg-blue-900/20 border border-brand-200 dark:border-blue-800 rounded-lg p-4 animate-fade-in relative">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-2 right-2 text-brand-400 hover:text-brand-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-brand-800 dark:text-brand-300 mb-2">Instrucciones</h4>
            <p className="text-xs text-brand-700 dark:text-brand-200">
              Esta herramienta permite convertir rápidamente entre las unidades de presión más comunes en el taller.
            </p>
            <ul className="text-xs text-brand-700 dark:text-brand-200 list-disc list-inside mt-2 space-y-1">
              <li><strong>PSI (Libras):</strong> Unidad estándar en la mayoría de manómetros de aire.</li>
              <li><strong>BAR:</strong> Común en vehículos europeos. (1 BAR ≈ 14.5 PSI).</li>
              <li><strong>kPa:</strong> Unidad del sistema internacional, usada en fichas técnicas modernas.</li>
            </ul>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto mt-4">
          {/* Unit Selector Tabs */}
          <div className="flex rounded-md bg-gray-200 dark:bg-gray-700 p-1 mb-6">
            {(['PSI', 'BAR', 'KPA'] as UnitType[]).map((unit) => (
              <button
                key={unit}
                onClick={() => {
                  setInputUnit(unit);
                  setResults(null);
                }}
                className={`flex-1 text-sm font-bold py-2 rounded transition-all ${
                  inputUnit === unit
                    ? 'bg-white dark:bg-gray-600 text-brand-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="w-full">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Ingrese valor en {inputUnit}
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  value={pressureInput}
                  onChange={(e) => setPressureInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="0.00"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-500 focus:border-brand-500 block w-full pl-4 pr-12 text-3xl md:text-xl border-gray-300 dark:border-gray-600 rounded-md py-3 font-mono border"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm font-bold">{inputUnit}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 w-full md:w-auto">
              <button
                onClick={handleCalculate}
                className="flex-1 bg-gold-400 hover:bg-gold-500 text-brand-900 font-bold py-3 px-4 rounded-md shadow-sm transition-colors flex items-center justify-center whitespace-nowrap"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calcular
              </button>
              <button
                onClick={handleReset}
                className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-medium py-3 px-4 rounded-md transition-colors"
                title="Reiniciar"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className={`mt-8 transition-all duration-300 overflow-hidden ${results ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border shadow-sm text-center ${inputUnit === 'PSI' ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800 ring-2 ring-brand-100 dark:ring-brand-900' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PSI</span>
                <span className="block text-3xl font-bold text-brand-600 dark:text-brand-400 mt-1">{results?.psi}</span>
              </div>
              <div className={`p-4 rounded-lg border shadow-sm text-center ${inputUnit === 'BAR' ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800 ring-2 ring-brand-100 dark:ring-brand-900' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">BAR</span>
                <span className="block text-3xl font-bold text-brand-600 dark:text-brand-400 mt-1">{results?.bar}</span>
              </div>
              <div className={`p-4 rounded-lg border shadow-sm text-center ${inputUnit === 'KPA' ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800 ring-2 ring-brand-100 dark:ring-brand-900' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">kPa</span>
                <span className="block text-3xl font-bold text-brand-600 dark:text-brand-400 mt-1">{results?.kpa}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
