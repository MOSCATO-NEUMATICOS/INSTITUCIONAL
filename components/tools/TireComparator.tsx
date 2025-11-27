
import React, { useState } from 'react';
import { Activity, FileText, CheckCircle, Trash2, Plus, XCircle } from 'lucide-react';

// Tire Constants
const TIRE_WIDTHS = [135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335];
const TIRE_PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
const TIRE_RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

interface TireData {
  id: string;
  width: string;
  profile: string;
  rim: string;
}

interface CalculatedTire {
  width: number;
  profile: number;
  rim: number;
  diameter: number;
  label: string;
}

export const TireComparator: React.FC = () => {
  const [patternTire, setPatternTire] = useState<TireData>({ id: 'pattern', width: '205', profile: '55', rim: '16' });
  const [comparisonTires, setComparisonTires] = useState<TireData[]>([
    { id: '1', width: '', profile: '', rim: '' }
  ]);
  const [showTireReport, setShowTireReport] = useState(false);

  const calculateDiameter = (t: TireData): CalculatedTire | null => {
    const w = parseFloat(t.width);
    const p = parseFloat(t.profile);
    const r = parseFloat(t.rim);

    if (!w || !p || !r) return null;

    // Diameter = (Width * (Profile/100) * 2) + (Rim * 25.4)
    const diameter = (w * (p / 100) * 2) + (r * 25.4);
    
    return {
      width: w,
      profile: p,
      rim: r,
      diameter: diameter,
      label: `${w}/${p} R${r}`
    };
  };

  const addComparisonTire = () => {
    if (comparisonTires.length >= 4) return;
    setComparisonTires([...comparisonTires, { id: Date.now().toString(), width: '', profile: '', rim: '' }]);
  };

  const removeComparisonTire = (id: string) => {
    setComparisonTires(comparisonTires.filter(t => t.id !== id));
  };

  const updateComparisonTire = (id: string, field: keyof TireData, value: string) => {
    setComparisonTires(comparisonTires.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const getToleranceStatus = (baseDiameter: number, targetDiameter: number) => {
    const diff = targetDiameter - baseDiameter;
    const percent = (diff / baseDiameter) * 100;
    const isOk = Math.abs(percent) <= 3;
    
    return {
      diffMm: diff,
      percent: percent,
      isOk: isOk,
      label: isOk ? 'Dentro de tolerancia' : 'Fuera de tolerancia'
    };
  };

  const patternCalculated = calculateDiameter(patternTire);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg border-t-4 border-t-gold-400 animate-fade-in">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gold-100 rounded-lg flex items-center justify-center mr-4 text-brand-800">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Comparador de Neumáticos</h3>
              <p className="text-sm text-gray-500">Calculadora de equivalencias y tolerancia (±3%)</p>
            </div>
          </div>
          <button 
            onClick={() => setShowTireReport(!showTireReport)}
            disabled={!patternCalculated}
            className="hidden md:flex items-center text-sm font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 px-4 py-2 rounded-lg border border-brand-200 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            {showTireReport ? 'Ocultar Reporte' : 'Ver Reporte'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-6">
          
          {/* Pattern Tire Section */}
          <div className="bg-brand-50 rounded-xl p-6 border-2 border-brand-200">
            <h4 className="font-bold text-brand-900 flex items-center mb-4 uppercase text-sm tracking-wide">
              <CheckCircle className="w-5 h-5 mr-2 text-brand-600" />
              Neumático Patrón (Original)
            </h4>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="grid grid-cols-3 gap-2 w-full md:w-auto flex-grow">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Ancho</label>
                  <select 
                    value={patternTire.width}
                    onChange={(e) => setPatternTire({...patternTire, width: e.target.value})}
                    className="w-full bg-white border-gray-300 rounded text-sm font-bold text-brand-900 py-2 border px-1 h-10"
                  >
                    <option value="">-</option>
                    {TIRE_WIDTHS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Perfil</label>
                  <select 
                    value={patternTire.profile}
                    onChange={(e) => setPatternTire({...patternTire, profile: e.target.value})}
                    className="w-full bg-white border-gray-300 rounded text-sm font-bold text-brand-900 py-2 border px-1 h-10"
                  >
                    <option value="">-</option>
                    {TIRE_PROFILES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Rodado</label>
                  <select 
                    value={patternTire.rim}
                    onChange={(e) => setPatternTire({...patternTire, rim: e.target.value})}
                    className="w-full bg-white border-gray-300 rounded text-sm font-bold text-brand-900 py-2 border px-1 h-10"
                  >
                    <option value="">-</option>
                    {TIRE_RIMS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {patternCalculated && (
                <div className="bg-white px-6 py-2 rounded-lg border border-brand-100 text-center shadow-sm w-full md:w-auto">
                  <span className="block text-xs text-gray-400 uppercase tracking-wider">Diámetro Total</span>
                  <span className="block text-2xl font-extrabold text-brand-700">
                    {patternCalculated.diameter.toFixed(1)} <span className="text-sm font-normal text-gray-400">mm</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Comparison List */}
          <div className="space-y-4">
            {comparisonTires.map((tire, index) => {
              const calculated = calculateDiameter(tire);
              const status = patternCalculated && calculated 
                ? getToleranceStatus(patternCalculated.diameter, calculated.diameter) 
                : null;

              return (
                <div key={tire.id} className="relative bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="bg-gray-100 text-gray-500 font-bold px-3 py-1.5 rounded text-xs uppercase tracking-wide">
                      Opción {index + 1}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 flex-grow max-w-sm w-full">
                      <select 
                        value={tire.width}
                        onChange={(e) => updateComparisonTire(tire.id, 'width', e.target.value)}
                        className="w-full bg-white border-gray-300 rounded text-sm text-gray-900 py-1.5 border px-2"
                      >
                        <option value="">Ancho</option>
                        {TIRE_WIDTHS.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <select 
                        value={tire.profile}
                        onChange={(e) => updateComparisonTire(tire.id, 'profile', e.target.value)}
                        className="w-full bg-white border-gray-300 rounded text-sm text-gray-900 py-1.5 border px-2"
                      >
                        <option value="">Perfil</option>
                        {TIRE_PROFILES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select 
                        value={tire.rim}
                        onChange={(e) => updateComparisonTire(tire.id, 'rim', e.target.value)}
                        className="w-full bg-white border-gray-300 rounded text-sm text-gray-900 py-1.5 border px-2"
                      >
                        <option value="">Rodado</option>
                        {TIRE_RIMS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    {status ? (
                      <div className="flex-grow flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 bg-gray-50 p-2 rounded sm:bg-transparent sm:p-0">
                        <div className="text-right sm:text-left mr-6">
                          <span className="block font-bold text-gray-900 text-sm">{calculated?.diameter.toFixed(1)} mm</span>
                          <span className={`text-xs font-bold ${status.diffMm >= 0 ? 'text-gray-500' : 'text-gray-500'}`}>
                            {status.diffMm > 0 ? '+' : ''}{status.diffMm.toFixed(1)} mm
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center border ${
                          status.isOk ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {status.isOk ? <CheckCircle className="w-3 h-3 mr-1.5" /> : <XCircle className="w-3 h-3 mr-1.5" />}
                          {status.percent > 0 ? '+' : ''}{status.percent.toFixed(2)}%
                        </div>
                      </div>
                    ) : (
                      <div className="flex-grow text-center text-xs text-gray-400 italic">
                        Complete las medidas
                      </div>
                    )}

                    <button 
                      onClick={() => removeComparisonTire(tire.id)}
                      className="absolute top-2 right-2 sm:static text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Eliminar fila"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {comparisonTires.length < 4 && (
              <button 
                onClick={addComparisonTire}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-colors flex items-center justify-center group"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Agregar neumático para comparar
              </button>
            )}
          </div>
        </div>

        {/* Detailed Report Table */}
        {(showTireReport || (patternCalculated && comparisonTires.some(t => t.width && t.profile && t.rim))) && (
          <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 shadow-sm animate-fade-in">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-brand-900 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Neumático</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Medida</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Diámetro</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Diferencia</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Pattern Row */}
                {patternCalculated && (
                  <tr className="bg-brand-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-900">
                      PATRÓN
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {patternCalculated.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">
                      {patternCalculated.diameter.toFixed(2)} mm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-100 text-brand-800">
                        Referencia
                      </span>
                    </td>
                  </tr>
                )}
                
                {/* Comparison Rows */}
                {comparisonTires.map((tire, idx) => {
                  const calc = calculateDiameter(tire);
                  if (!calc || !patternCalculated) return null;
                  const status = getToleranceStatus(patternCalculated.diameter, calc.diameter);
                  
                  return (
                    <tr key={tire.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Opción {idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                        {calc.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {calc.diameter.toFixed(2)} mm
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono">
                        <span className={status.diffMm > 0 ? 'text-green-600' : 'text-red-600'}>
                          {status.diffMm > 0 ? '+' : ''}{status.diffMm.toFixed(1)}
                        </span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className={Math.abs(status.percent) <= 3 ? 'font-bold text-gray-900' : 'font-bold text-red-600'}>
                          {status.percent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          status.isOk ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {status.isOk ? 'APTO' : 'NO APTO'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
