
import React, { useState } from 'react';
import { DollarSign, Trash2, ArrowRight, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

const BILL_VALUES = [20000, 10000, 2000, 1000, 500, 200, 100, 50, 20, 10];

export const CashBox: React.FC = () => {
  const [cashCounts, setCashCounts] = useState<Record<number, string>>({});
  const [systemTotalInput, setSystemTotalInput] = useState<string>('');

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
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg border-t-4 border-t-green-600 animate-fade-in">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 text-green-700">
              <DollarSign className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Arqueo de Caja Diaria</h3>
              <p className="text-sm text-gray-500">Contador de billetes y validación de sistema</p>
            </div>
          </div>
          <button 
            onClick={resetCashBox}
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors bg-gray-50 px-3 py-2 rounded-md border border-gray-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
          {/* Bills Input Section */}
          <div>
            <h4 className="font-bold text-gray-700 mb-4 border-b pb-2 flex items-center">
              <ArrowRight className="w-4 h-4 mr-2 text-green-600" />
              Ingreso de Billetes
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {BILL_VALUES.map(bill => (
                <div key={bill} className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-400 transition-all">
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
          <div className="flex flex-col h-full">
            <h4 className="font-bold text-gray-700 mb-4 border-b pb-2 flex items-center">
              <ArrowRight className="w-4 h-4 mr-2 text-green-600" />
              Resultados
            </h4>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center mb-6 shadow-sm">
              <span className="block text-sm font-bold text-green-800 uppercase tracking-widest mb-1">Total Físico en Caja</span>
              <span className="block text-4xl font-extrabold text-green-700 tracking-tight">
                {formatCurrency(totalCash)}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex-grow">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
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
                    className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-7 pr-12 sm:text-xl border-gray-300 rounded-md py-3 border bg-white text-gray-900 font-bold"
                  />
                </div>
              </div>

              {systemTotalInput !== '' && (
                <div className={`rounded-lg p-4 border-l-4 shadow-sm animate-fade-in ${
                  !hasDifference 
                    ? 'bg-white border-green-500' 
                    : difference > 0 
                      ? 'bg-white border-blue-500' 
                      : 'bg-white border-red-500'
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
  );
};
