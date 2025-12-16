
import React, { useState } from 'react';
import { DollarSign, Trash2, ArrowRight, CheckCircle, TrendingUp, TrendingDown, HelpCircle, X } from 'lucide-react';

const BILL_VALUES = [20000, 10000, 2000, 1000, 500, 200, 100, 50, 20, 10];

export const CashBox: React.FC = () => {
  const [cashCounts, setCashCounts] = useState<Record<number, string>>({});
  const [systemTotalInput, setSystemTotalInput] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);

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
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg border-t-4 border-t-green-600 animate-fade-in transition-colors">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4 text-green-700 dark:text-green-400">
              <DollarSign className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Arqueo de Caja Diaria</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Contador de billetes y validación de sistema</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Help Button */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-800 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-md border border-green-200 dark:border-green-800 transition-colors"
              title="Ayuda"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ayuda</span>
            </button>
            <button 
              onClick={resetCashBox}
              className="flex items-center text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-red-400 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          </div>
        </div>

        {/* HELP SECTION */}
        {showHelp && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-fade-in relative">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-2 right-2 text-green-500 hover:text-green-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-green-800 dark:text-green-300 mb-2">Instrucciones de Arqueo</h4>
            <p className="text-xs text-green-800 dark:text-green-200 mb-2">
              Utilice esta herramienta al cierre del día para verificar la recaudación en efectivo.
            </p>
            <ul className="text-xs text-green-800 dark:text-green-200 list-disc list-inside space-y-1">
              <li>Ingrese la <strong>cantidad</strong> de billetes de cada denominación en la columna izquierda.</li>
              <li>El sistema calculará automáticamente el <strong>Total Físico</strong>.</li>
              <li>Ingrese el total que figura en el sistema de gestión en el campo "Total Indicado por Sistema".</li>
              <li>La herramienta le alertará si existe algún <strong>Faltante (Rojo)</strong> o <strong>Sobrante (Azul)</strong>.</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
          {/* Bills Input Section */}
          <div>
            <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 border-b dark:border-gray-700 pb-2 flex items-center">
              <ArrowRight className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
              Ingreso de Billetes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {BILL_VALUES.map(bill => (
                <div key={bill} className="flex items-center bg-gray-50 dark:bg-gray-700 p-2 sm:p-2 rounded-lg border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-400 transition-all">
                  <div className="w-24 text-right font-bold text-gray-700 dark:text-gray-200 mr-3 text-sm">
                    ${bill.toLocaleString()}
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={cashCounts[bill] || ''}
                      onChange={(e) => handleBillChange(bill, e.target.value)}
                      className="w-full text-center p-2 border-gray-300 dark:border-gray-600 rounded border focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono font-bold text-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="flex flex-col h-full">
            <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 border-b dark:border-gray-700 pb-2 flex items-center">
              <ArrowRight className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
              Resultados
            </h4>
            
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 border border-green-200 dark:border-green-800 text-center mb-6 shadow-sm">
              <span className="block text-sm font-bold text-green-800 dark:text-green-300 uppercase tracking-widest mb-1">Total Físico en Caja</span>
              <span className="block text-4xl font-extrabold text-green-700 dark:text-green-400 tracking-tight">
                {formatCurrency(totalCash)}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex-grow">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Total Indicado por Sistema
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={systemTotalInput}
                    onChange={(e) => setSystemTotalInput(e.target.value)}
                    placeholder="0.00"
                    className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-7 pr-12 text-xl sm:text-xl border-gray-300 dark:border-gray-600 rounded-md py-3 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {systemTotalInput !== '' && (
                <div className={`rounded-lg p-4 border-l-4 shadow-sm animate-fade-in ${
                  !hasDifference 
                    ? 'bg-white dark:bg-gray-800 border-green-500' 
                    : difference > 0 
                      ? 'bg-white dark:bg-gray-800 border-blue-500' 
                      : 'bg-white dark:bg-gray-800 border-red-500'
                }`}>
                  <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2">
                    <div className="flex items-center">
                      {!hasDifference ? (
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500 mr-3" />
                      ) : difference > 0 ? (
                        <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-500 mr-3" />
                      ) : (
                        <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-500 mr-3" />
                      )}
                      
                      <div>
                        <h5 className={`font-bold ${
                          !hasDifference ? 'text-green-800 dark:text-green-400' : difference > 0 ? 'text-blue-800 dark:text-blue-400' : 'text-red-800 dark:text-red-400'
                        }`}>
                          {!hasDifference ? 'Caja Perfecta' : difference > 0 ? 'Sobrante de Caja' : 'Faltante de Caja'}
                        </h5>
                      </div>
                    </div>
                    
                    <div className={`text-xl font-extrabold ${
                      !hasDifference ? 'text-green-700 dark:text-green-400' : difference > 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'
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
  );
};
