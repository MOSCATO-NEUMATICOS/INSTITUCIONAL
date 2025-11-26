
import React, { useState } from 'react';
import { Calculator, Timer, Wrench, AlertTriangle, Construction, ArrowRight, RotateCcw, Plus, Trash2, CheckCircle, XCircle, FileText, Activity, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

type UnitType = 'PSI' | 'BAR' | 'KPA';

// Tire Constants
const TIRE_WIDTHS = [135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335];
const TIRE_PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
const TIRE_RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

// Cash Box Constants (Argentine Pesos)
const BILL_VALUES = [20000, 10000, 2000, 1000, 500, 200, 100, 50, 20, 10];

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

export const Tools: React.FC = () => {
  // --- UNIT CONVERTER STATE ---
  const [pressureInput, setPressureInput] = useState<string>('');
  const [inputUnit, setInputUnit] = useState<UnitType>('PSI');
  const [results, setResults] = useState<{ psi: string; bar: string; kpa: string } | null>(null);

  // --- TIRE CALCULATOR STATE ---
  const [patternTire, setPatternTire] = useState<TireData>({ id: 'pattern', width: '205', profile: '55', rim: '16' });
  const [comparisonTires, setComparisonTires] = useState<TireData[]>([
    { id: '1', width: '', profile: '', rim: '' }
  ]);
  const [showTireReport, setShowTireReport] = useState(false);

  // --- CASH BOX STATE ---
  const [cashCounts, setCashCounts] = useState<Record<number, string>>({});
  const [systemTotalInput, setSystemTotalInput] = useState<string>('');

  // --- UNIT CONVERTER LOGIC ---
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

  // --- TIRE CALCULATOR LOGIC ---
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

  // --- CASH BOX LOGIC ---
  const handleBillChange = (denomination: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    setCashCounts(prev => ({ ...prev, [denomination]: value }));
  };

  const calculateTotalCash = () => {
    return BILL_VALUES.reduce((total, bill) => {
      const count = parseInt(cashCounts[bill] || '0', 10);
      return total + (count * bill);
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  const totalCash = calculateTotalCash();
  const systemTotal = parseFloat(systemTotalInput) || 0;
  const difference = totalCash - systemTotal;
  const hasDifference = systemTotalInput !== '' && Math.abs(difference) > 0.01;

  const resetCashBox = () => {
    setCashCounts({});
    setSystemTotalInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-brand-900">Herramientas Digitales</h2>
        <p className="mt-1 text-sm text-gray-500">Utilidades técnicas para optimizar el trabajo en Moscato Neumáticos.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Unit Converter */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all border-t-4 border-t-brand-500">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center mr-4 text-brand-600">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Convertidor de Presión</h3>
                <p className="text-xs text-gray-500">Calculadora universal (PSI / BAR / kPa)</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 max-w-3xl mx-auto">
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
              <div className={`mt-6 transition-all duration-300 overflow-hidden ${results ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
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

        {/* CASH BOX CALCULATOR */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all border-t-4 border-t-green-600">
           <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 text-green-700">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Arqueo de Caja Diaria</h3>
                    <p className="text-xs text-gray-500">Contador de billetes y validación de sistema</p>
                  </div>
                </div>
                <button 
                  onClick={resetCashBox}
                  className="flex items-center text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Limpiar Todo
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bills Input Section */}
                <div>
                   <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">Ingreso de Billetes (Cantidad)</h4>
                   <div className="grid grid-cols-2 gap-4">
                      {BILL_VALUES.map(bill => (
                        <div key={bill} className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                           <div className="w-20 text-right font-bold text-gray-700 mr-3 text-sm">
                             ${bill.toLocaleString()}
                           </div>
                           <div className="flex-1">
                             <input
                               type="number"
                               min="0"
                               placeholder="0"
                               value={cashCounts[bill] || ''}
                               onChange={(e) => handleBillChange(bill, e.target.value)}
                               className="w-full text-center p-1 border-gray-300 rounded border focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 font-mono font-bold"
                             />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Summary Section */}
                <div className="flex flex-col h-full justify-between">
                   <div>
                      <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">Resumen de Caja</h4>
                      
                      <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center mb-6">
                        <span className="block text-sm font-bold text-green-800 uppercase tracking-widest mb-1">Total Físico en Caja</span>
                        <span className="block text-4xl font-extrabold text-green-700 tracking-tight">
                          {formatCurrency(totalCash)}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Total Indicado por Sistema
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              value={systemTotalInput}
                              onChange={(e) => setSystemTotalInput(e.target.value)}
                              placeholder="0.00"
                              className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-7 pr-12 sm:text-lg border-gray-300 rounded-md py-3 border bg-white text-gray-900 font-bold"
                            />
                          </div>
                        </div>

                        {systemTotalInput !== '' && (
                           <div className={`rounded-lg p-4 border-l-4 shadow-sm animate-fade-in ${
                             !hasDifference 
                               ? 'bg-green-50 border-green-500' 
                               : difference > 0 
                                 ? 'bg-blue-50 border-blue-500' 
                                 : 'bg-red-50 border-red-500'
                           }`}>
                             <div className="flex items-center justify-between">
                               <div className="flex items-center">
                                  {!hasDifference ? (
                                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                                  ) : difference > 0 ? (
                                    <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                                  ) : (
                                    <TrendingDown className="w-8 h-8 text-red-600 mr-3" />
                                  )}
                                  
                                  <div>
                                    <h5 className={`font-bold ${
                                       !hasDifference ? 'text-green-800' : difference > 0 ? 'text-blue-800' : 'text-red-800'
                                    }`}>
                                      {!hasDifference ? 'Caja Perfecta' : difference > 0 ? 'Sobrante de Caja' : 'Faltante de Caja'}
                                    </h5>
                                    <p className="text-xs text-gray-600 font-medium">
                                      {difference > 0 ? 'Hay dinero extra no registrado.' : difference < 0 ? 'Falta dinero respecto al sistema.' : 'El físico coincide con el sistema.'}
                                    </p>
                                  </div>
                               </div>
                               
                               <div className={`text-xl font-extrabold ${
                                  !hasDifference ? 'text-green-700' : difference > 0 ? 'text-blue-700' : 'text-red-700'
                               }`}>
                                 {difference > 0 ? '+' : ''}{formatCurrency(difference)}
                               </div>
                             </div>
                           </div>
                        )}
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* TIRE CALCULATOR - FULL IMPLEMENTATION */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all border-t-4 border-t-gold-400">
          <div className="p-6 md:p-8">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gold-100 rounded-lg flex items-center justify-center mr-4 text-brand-800">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Comparador de Neumáticos</h3>
                    <p className="text-xs text-gray-500">Calculadora de equivalencias y tolerancia (±3%)</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTireReport(!showTireReport)}
                  disabled={!patternCalculated}
                  className="hidden md:flex items-center text-sm font-semibold text-brand-600 hover:text-brand-800"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  {showTireReport ? 'Ocultar Reporte' : 'Ver Reporte Completo'}
                </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Pattern Tire */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-brand-50 rounded-lg p-5 border-2 border-brand-200">
                    <h4 className="font-bold text-brand-900 flex items-center mb-4 uppercase text-sm tracking-wide">
                      <CheckCircle className="w-4 h-4 mr-2 text-brand-600" />
                      Neumático Patrón (Original)
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                       <div>
                         <label className="text-xs font-bold text-gray-500 block mb-1">Ancho</label>
                         <select 
                            value={patternTire.width}
                            onChange={(e) => setPatternTire({...patternTire, width: e.target.value})}
                            className="w-full bg-white border-gray-300 rounded text-sm font-bold text-brand-900 py-2 border px-1"
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
                            className="w-full bg-white border-gray-300 rounded text-sm font-bold text-brand-900 py-2 border px-1"
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
                            className="w-full bg-white border-gray-300 rounded text-sm font-bold text-brand-900 py-2 border px-1"
                         >
                           <option value="">-</option>
                           {TIRE_RIMS.map(r => <option key={r} value={r}>{r}</option>)}
                         </select>
                       </div>
                    </div>

                    {patternCalculated ? (
                      <div className="bg-white p-3 rounded border border-brand-100 text-center">
                        <span className="block text-xs text-gray-400 uppercase">Diámetro Total</span>
                        <span className="block text-xl font-extrabold text-brand-700">
                          {patternCalculated.diameter.toFixed(1)} <span className="text-xs font-normal">mm</span>
                        </span>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-xs text-gray-400 italic">
                        Seleccione medidas completas
                      </div>
                    )}
                  </div>

                  <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
                    <p className="text-xs text-gold-900 italic font-medium">
                      <span className="font-bold">Nota:</span> Se considera una equivalencia segura si la diferencia de diámetro no supera el <span className="font-bold">+/- 3%</span>.
                    </p>
                  </div>
                </div>

                {/* Right Column: Comparison List */}
                <div className="lg:col-span-8">
                   <div className="space-y-4">
                      {comparisonTires.map((tire, index) => {
                         const calculated = calculateDiameter(tire);
                         const status = patternCalculated && calculated 
                            ? getToleranceStatus(patternCalculated.diameter, calculated.diameter) 
                            : null;

                         return (
                           <div key={tire.id} className="relative bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="bg-gray-100 text-gray-500 font-bold px-2 py-1 rounded text-xs uppercase tracking-wide">
                                  Opción #{index + 1}
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 flex-grow max-w-xs">
                                   <select 
                                      value={tire.width}
                                      onChange={(e) => updateComparisonTire(tire.id, 'width', e.target.value)}
                                      className="w-full bg-white border-gray-300 rounded text-sm text-gray-900 py-1 border px-1"
                                   >
                                     <option value="">Ancho</option>
                                     {TIRE_WIDTHS.map(w => <option key={w} value={w}>{w}</option>)}
                                   </select>
                                   <select 
                                      value={tire.profile}
                                      onChange={(e) => updateComparisonTire(tire.id, 'profile', e.target.value)}
                                      className="w-full bg-white border-gray-300 rounded text-sm text-gray-900 py-1 border px-1"
                                   >
                                     <option value="">Perfil</option>
                                     {TIRE_PROFILES.map(p => <option key={p} value={p}>{p}</option>)}
                                   </select>
                                   <select 
                                      value={tire.rim}
                                      onChange={(e) => updateComparisonTire(tire.id, 'rim', e.target.value)}
                                      className="w-full bg-white border-gray-300 rounded text-sm text-gray-900 py-1 border px-1"
                                   >
                                     <option value="">Rodado</option>
                                     {TIRE_RIMS.map(r => <option key={r} value={r}>{r}</option>)}
                                   </select>
                                </div>

                                {status ? (
                                   <div className="flex-grow flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 bg-gray-50 p-2 rounded sm:bg-transparent sm:p-0">
                                      <div className="text-right sm:text-left mr-4">
                                        <span className="block font-bold text-gray-900 text-sm">{calculated?.diameter.toFixed(1)} mm</span>
                                        <span className={`text-xs font-bold ${status.diffMm >= 0 ? 'text-gray-500' : 'text-gray-500'}`}>
                                          {status.diffMm > 0 ? '+' : ''}{status.diffMm.toFixed(1)} mm
                                        </span>
                                      </div>
                                      <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${
                                        status.isOk ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                         {status.isOk ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                         {status.percent > 0 ? '+' : ''}{status.percent.toFixed(2)}%
                                      </div>
                                   </div>
                                ) : (
                                   <div className="flex-grow text-center text-xs text-gray-400 italic">
                                     Complete medidas
                                   </div>
                                )}

                                <button 
                                  onClick={() => removeComparisonTire(tire.id)}
                                  className="absolute top-2 right-2 sm:static text-gray-300 hover:text-red-500 p-1"
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
                          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar otro neumático para comparar
                        </button>
                      )}
                   </div>
                </div>
             </div>

             {/* Detailed Report Table */}
             {(showTireReport || (patternCalculated && comparisonTires.some(t => t.width && t.profile && t.rim))) && (
               <div className="mt-8 overflow-hidden rounded-lg border border-gray-200">
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
                               Opción #{idx + 1}
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

        {/* Labor Time Calculator (Still Future) */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all group opacity-75 hover:opacity-100">
          <div className="absolute top-0 right-0 bg-gold-400 text-brand-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
            PRÓXIMAMENTE
          </div>
          <div className="p-8">
            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mb-6 text-gray-600">
              <Timer className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Calculadora de Tiempos</h3>
            <p className="text-sm text-gray-600 mb-6">
              Estima los tiempos de mano de obra basados en estándares de fábrica y eficiencia del taller.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 border-dashed flex items-center justify-center h-32">
              <div className="text-center text-gray-400">
                <Construction className="h-8 w-8 mx-auto mb-2" />
                <span className="text-xs">Módulo en desarrollo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 border-dashed flex flex-col items-center justify-center p-8 text-center hover:bg-gray-100 transition-colors">
            <AlertTriangle className="h-8 w-8 text-gold-500 mb-3" />
            <h3 className="text-base font-bold text-gray-900">¿Necesitas otra herramienta?</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Envía tu sugerencia al equipo de desarrollo.
            </p>
            <button className="text-brand-600 hover:text-brand-800 text-sm font-semibold flex items-center">
              Ir al Buzón <ArrowRight className="w-4 h-4 ml-1" />
            </button>
        </div>

      </div>
    </div>
  );
};
