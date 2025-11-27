
import React, { useState } from 'react';
import { Wrench, Calculator, RotateCcw } from 'lucide-react';

type UnitType = 'PSI' | 'BAR' | 'KPA';

export const UnitConverter: React.FC = () => {
  const [pressureInput, setPressureInput] = useState<string>('');
  const [inputUnit, setInputUnit] = useState<UnitType>('PSI');
  const [results, setResults] = useState<{ psi: string; bar: string; kpa: string } | null>(null);

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
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg border-t-4 border-t-brand-500 animate-fade-in">
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center mr-4 text-brand-600">
            <Wrench className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Convertidor de Presión</h3>
            <p className="text-sm text-gray-500">Calculadora universal (PSI / BAR / kPa)</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 max-w-2xl mx-auto mt-8">
          {/* Unit Selector Tabs */}
          <div className="flex rounded-md bg-gray-200 p-1 mb-6">
            {(['PSI', 'BAR', 'KPA'] as UnitType[]).map((unit) => (
              <button
                key={unit}
                onClick={() => {
                  setInputUnit(unit);
                  setResults(null);
                }}
                className={`flex-1 text-sm font-bold py-2 rounded transition-all ${
                  inputUnit === unit
                    ? 'bg-white text-brand-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Ingrese valor en {inputUnit}
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  value={pressureInput}
                  onChange={(e) => setPressureInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="0.00"
                  className="bg-white text-gray-900 focus:ring-brand-500 focus:border-brand-500 block w-full pl-4 pr-12 text-xl border-gray-300 rounded-md py-3 font-mono border"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm font-bold">{inputUnit}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCalculate}
                className="flex-1 bg-gold-400 hover:bg-gold-500 text-brand-900 font-bold py-3 px-4 rounded-md shadow-sm transition-colors flex items-center justify-center"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calcular
              </button>
              <button
                onClick={handleReset}
                className="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 font-medium py-3 px-4 rounded-md transition-colors"
                title="Reiniciar"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className={`mt-8 transition-all duration-300 overflow-hidden ${results ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border shadow-sm text-center ${inputUnit === 'PSI' ? 'bg-brand-50 border-brand-200 ring-2 ring-brand-100' : 'bg-white border-gray-200'}`}>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">PSI</span>
                <span className="block text-2xl font-bold text-brand-600 mt-1">{results?.psi}</span>
              </div>
              <div className={`p-4 rounded-lg border shadow-sm text-center ${inputUnit === 'BAR' ? 'bg-brand-50 border-brand-200 ring-2 ring-brand-100' : 'bg-white border-gray-200'}`}>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">BAR</span>
                <span className="block text-2xl font-bold text-brand-600 mt-1">{results?.bar}</span>
              </div>
              <div className={`p-4 rounded-lg border shadow-sm text-center ${inputUnit === 'KPA' ? 'bg-brand-50 border-brand-200 ring-2 ring-brand-100' : 'bg-white border-gray-200'}`}>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">kPa</span>
                <span className="block text-2xl font-bold text-brand-600 mt-1">{results?.kpa}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
