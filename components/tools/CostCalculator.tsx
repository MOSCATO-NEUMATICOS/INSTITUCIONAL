
import React, { useState, useMemo } from 'react';
import { Calculator, RefreshCcw, Tag, CheckSquare, Square, X, Percent, Plus, Trophy, TrendingUp, Star, ArrowUpCircle, BadgeCheck, HelpCircle } from 'lucide-react';
import { Supplier } from '../../types';

interface CostCalculatorProps {
  suppliers: Supplier[];
}

interface CalculationResult {
  cost: number;
  salePrice: number;
  isValid: boolean;
  realMargin: number;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ suppliers = [] }) => {
  // State to track selected suppliers IDs
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
  
  // State to store list price for each supplier: { "supplierId": "priceValue" }
  const [prices, setPrices] = useState<Record<string, string>>({});

  // State to store cost adjustments (percentage) for each supplier: { "supplierId": "adjValue" }
  const [adjustments, setAdjustments] = useState<Record<string, string>>({});

  const [showHelp, setShowHelp] = useState(false);

  const toggleSupplier = (id: string) => {
    if (selectedSupplierIds.includes(id)) {
      setSelectedSupplierIds(selectedSupplierIds.filter(sId => sId !== id));
    } else {
      setSelectedSupplierIds([...selectedSupplierIds, id]);
    }
  };

  const handlePriceChange = (id: string, value: string) => {
    setPrices(prev => ({ ...prev, [id]: value }));
  };

  const handleAdjustmentChange = (id: string, value: string) => {
    setAdjustments(prev => ({ ...prev, [id]: value }));
  };

  const calculateRow = (supplier: Supplier, priceVal: string, adjVal: string): CalculationResult => {
    const rawPrice = parseFloat(priceVal); // Precio Lista Puro (Ingresado)
    const adjustment = parseFloat(adjVal) || 0;
    
    if (isNaN(rawPrice) || rawPrice <= 0) {
      return { cost: 0, salePrice: 0, realMargin: 0, isValid: false };
    }

    // --- 1. CÁLCULO DEL COSTO ---
    
    // Base para costo: Si el proveedor suma IVA, lo agregamos aquí al precio base de costo.
    // Esto permite que el Costo tenga IVA, pero el precio de lista original se mantenga puro para cálculos de venta s/lista.
    let costBasis = rawPrice;
    if (supplier.addIva) {
      costBasis = rawPrice * 1.21;
    }

    let currentCost = costBasis;
    
    // Aplicar cadena de descuentos al Costo
    const discounts = supplier.discountChain.split(/[\+\s,]+/).filter(d => d !== '');
    discounts.forEach(d => {
      const val = parseFloat(d);
      if (!isNaN(val)) {
        currentCost = currentCost * (1 - (val / 100));
      }
    });

    // Aplicar Ajuste Manual al Costo (Suma o Resta %)
    if (adjustment !== 0) {
      currentCost = currentCost * (1 + (adjustment / 100));
    }

    // --- 2. CÁLCULO DEL PRECIO DE VENTA ---
    const marginVal = supplier.margin || 0;
    let salePrice = 0;

    if (supplier.marginBase === 'list') {
      // Calculate from Pure List Price (Input value), ignoring the IVA addition done for cost
      // "El publi desde lista sea sin iva" scenario covered here.
      salePrice = rawPrice * (1 + (marginVal / 100));
    } else {
      // Default: Calculate from Calculated Net Cost
      salePrice = currentCost * (1 + (marginVal / 100));
    }

    // --- 3. CÁLCULO DEL MARGEN REAL ---
    // (Venta - Costo) / Costo
    const realMargin = currentCost > 0 ? ((salePrice - currentCost) / currentCost) * 100 : 0;

    return {
      cost: currentCost,
      salePrice: salePrice,
      realMargin: realMargin,
      isValid: true
    };
  };

  const handleReset = () => {
    setPrices({});
    setAdjustments({});
    setSelectedSupplierIds([]);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);
  };

  // Sort suppliers alphabetically for display
  const sortedSuppliers = [...suppliers].sort((a, b) => a.name.localeCompare(b.name));

  // Filter only selected for the table, maintaining alphabetical order
  const activeSuppliers = sortedSuppliers.filter(s => selectedSupplierIds.includes(s.id));

  // --- DERIVED DATA FOR BEST PRICE CALCULATION ---
  // We calculate all rows first to determine which one is the "Best Buy"
  const calculatedRows = useMemo(() => {
    return activeSuppliers.map(supplier => {
      const priceInput = prices[supplier.id] || '';
      const adjustmentInput = adjustments[supplier.id] || '';
      const result = calculateRow(supplier, priceInput, adjustmentInput);
      return {
        ...supplier,
        priceInput,
        adjustmentInput,
        result
      };
    });
  }, [activeSuppliers, prices, adjustments]);

  // Calculate Comparison Stats (Min Cost, Max Margin, Max Price)
  const stats = useMemo(() => {
    const validRows = calculatedRows.filter(r => r.result.isValid);
    if (validRows.length === 0) return { minCost: 0, maxMargin: -Infinity, maxPrice: 0 };

    return {
      minCost: Math.min(...validRows.map(r => r.result.cost)),
      maxMargin: Math.max(...validRows.map(r => r.result.realMargin)),
      maxPrice: Math.max(...validRows.map(r => r.result.salePrice))
    };
  }, [calculatedRows]);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg border-t-4 border-t-green-600 animate-fade-in h-full flex flex-col transition-colors">
      <div className="p-6 md:p-8 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4 text-green-700 dark:text-green-400">
              <Calculator className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Comparativa de Precios</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cotización multi-proveedor</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Help Button */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-md border border-green-200 dark:border-green-800 transition-colors"
              title="Ayuda"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ayuda</span>
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center text-sm font-semibold text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reiniciar</span>
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
            <h4 className="text-sm font-bold text-green-800 dark:text-green-300 mb-2">Cómo usar el comparador</h4>
            <ul className="text-xs text-green-800 dark:text-green-200 list-disc list-inside space-y-1">
              <li><strong>Paso 1:</strong> Seleccione los proveedores que desea comparar (pueden ser configurados desde el panel Admin).</li>
              <li><strong>Paso 2:</strong> Ingrese el <strong>Precio de Lista</strong> de cada proveedor para el producto consultado.</li>
              <li>El sistema aplicará automáticamente los descuentos configurados para calcular el <strong>Costo Neto</strong>.</li>
              <li>También calculará el <strong>Precio de Venta Sugerido</strong> según el margen predefinido para ese proveedor.</li>
              <li>Puede aplicar un <strong>Ajuste %</strong> manual (positivo o negativo) para casos especiales u ofertas puntuales.</li>
            </ul>
          </div>
        )}

        <div className="space-y-8">
          
          {/* 1. SUPPLIER SELECTOR */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide mb-3">
              1. Seleccione Proveedores
            </h4>
            <div className="flex flex-wrap gap-2">
              {sortedSuppliers.map(sup => {
                const isSelected = selectedSupplierIds.includes(sup.id);
                return (
                  <button
                    key={sup.id}
                    onClick={() => toggleSupplier(sup.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all border ${
                      isSelected 
                        ? 'bg-green-600 text-white border-green-700 shadow-sm' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {isSelected ? <CheckSquare className="w-4 h-4 mr-2" /> : <Square className="w-4 h-4 mr-2" />}
                    {sup.name}
                  </button>
                );
              })}
              {sortedSuppliers.length === 0 && (
                <p className="text-sm text-gray-400 italic">No hay proveedores configurados en el sistema.</p>
              )}
            </div>
          </div>

          {/* 2. INPUT & RESULTS - RESPONSIVE */}
          {activeSuppliers.length > 0 ? (
            <div className="animate-fade-in">
              <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-t-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                   2. Ingrese Precios de Lista
                 </h4>
                 
                 {/* Legend */}
                 {stats.maxPrice > 0 && (
                   <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-wide">
                      <span className="flex items-center text-green-700 dark:text-green-400"><Trophy className="w-3 h-3 mr-1" /> Mejor Costo</span>
                      <span className="flex items-center text-yellow-700 dark:text-yellow-400"><Star className="w-3 h-3 mr-1" /> Precio Sugerido</span>
                   </div>
                 )}
              </div>

              {/* MOBILE VIEW (CARDS) */}
              <div className="md:hidden space-y-4 mt-4">
                {calculatedRows.map((row) => {
                  const { id, name, discountChain, addIva, priceInput, adjustmentInput, result } = row;
                  const { cost, salePrice, realMargin, isValid } = result;
                  const isLowestCost = isValid && stats.minCost > 0 && Math.abs(cost - stats.minCost) < 0.01;
                  const isHighestPrice = isValid && stats.maxPrice > 0 && Math.abs(salePrice - stats.maxPrice) < 0.01;

                  return (
                    <div key={id} className={`bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-4 relative ${isHighestPrice ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : 'border-gray-200 dark:border-gray-700'}`}>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-lg font-bold text-gray-900 dark:text-white block">{name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">Desc: {discountChain}</span>
                        </div>
                        <button onClick={() => toggleSupplier(id)} className="text-gray-300 hover:text-red-500 p-1">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Inputs Row */}
                      <div className="flex gap-2 mb-4">
                        <div className="flex-grow">
                          <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Precio Lista</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400 font-bold">$</span>
                            <input
                              type="number"
                              value={priceInput}
                              onChange={(e) => handlePriceChange(id, e.target.value)}
                              className="w-full pl-6 border border-gray-300 dark:border-gray-600 rounded p-2 text-lg font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-green-500 focus:border-green-500"
                              placeholder="0.00"
                            />
                          </div>
                          {addIva && <span className="text-[10px] text-green-600 dark:text-green-400 font-bold block mt-1">+IVA (21%)</span>}
                        </div>
                        <div className="w-20">
                          <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Ajuste %</label>
                          <input
                            type="number"
                            value={adjustmentInput}
                            onChange={(e) => handleAdjustmentChange(id, e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-center text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      {/* Results Footer */}
                      {isValid ? (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-3 grid grid-cols-2 gap-4 border border-gray-100 dark:border-gray-700">
                          <div>
                            <span className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-bold">Costo Neto</span>
                            <span className={`block font-bold ${isLowestCost ? 'text-green-700 dark:text-green-400 text-lg' : 'text-gray-700 dark:text-gray-300 text-base'}`}>
                              {formatCurrency(cost)}
                            </span>
                            {isLowestCost && (
                              <span className="inline-flex items-center text-[9px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded mt-1 border border-green-200 dark:border-green-800">
                                <Trophy className="w-3 h-3 mr-1" /> Mejor Costo
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="block text-[10px] uppercase text-gray-500 dark:text-gray-400 font-bold">Venta</span>
                            <span className={`block font-bold ${isHighestPrice ? 'text-gray-900 dark:text-white text-2xl' : 'text-gray-700 dark:text-gray-300 text-lg'}`}>
                              {formatCurrency(salePrice)}
                            </span>
                            <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-1">Mg. Real: {realMargin.toFixed(1)}%</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 text-sm py-2 italic border-t border-gray-100 dark:border-gray-700 pt-3">
                          Ingrese precio de lista para calcular
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP VIEW (TABLE) */}
              <div className="hidden md:block overflow-hidden border border-gray-200 dark:border-gray-700 rounded-b-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider w-[20%]">
                        Proveedor
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider w-[18%] min-w-[140px] bg-gray-700 border-l border-gray-600">
                        Precio Lista
                      </th>
                      <th scope="col" className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider w-[8%] hidden sm:table-cell">
                        Desc.
                      </th>
                      <th scope="col" className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider w-[10%] border-l border-gray-700">
                        Ajuste
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider w-[18%]">
                        Costo Neto
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider w-[22%] bg-green-700">
                        Precio Venta
                      </th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {calculatedRows.map((row) => {
                      const { id, name, discountChain, addIva, priceInput, adjustmentInput, result } = row;
                      const { cost, salePrice, realMargin, isValid } = result;
                      
                      const isLowestCost = isValid && stats.minCost > 0 && Math.abs(cost - stats.minCost) < 0.01;
                      const isBestMargin = isValid && stats.maxMargin > -Infinity && Math.abs(realMargin - stats.maxMargin) < 0.01;
                      const isHighestPrice = isValid && stats.maxPrice > 0 && Math.abs(salePrice - stats.maxPrice) < 0.01;

                      return (
                        <tr key={id} className={`transition-colors group hover:bg-gray-50 dark:hover:bg-gray-700`}>
                          <td className="px-4 py-3 whitespace-nowrap align-middle">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{name}</span>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 sm:hidden">Desc: {discountChain}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap bg-gray-50 dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 align-middle">
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <span className="text-gray-400 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                value={priceInput}
                                onChange={(e) => handlePriceChange(id, e.target.value)}
                                className="focus:ring-green-500 focus:border-green-500 block w-full pl-6 pr-8 sm:text-sm border-gray-300 dark:border-gray-500 rounded-md py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0.00"
                              />
                              {addIva && (
                                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none" title="Se suma IVA al costo">
                                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1 rounded border border-green-200 dark:border-green-800">+IVA</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-center text-xs text-gray-500 dark:text-gray-400 font-mono hidden sm:table-cell align-middle">
                            {discountChain}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap bg-gray-50 dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 align-middle">
                             <div className="relative rounded-md shadow-sm">
                              <input
                                type="number"
                                value={adjustmentInput}
                                onChange={(e) => handleAdjustmentChange(id, e.target.value)}
                                className="focus:ring-green-500 focus:border-green-500 block w-full pr-6 sm:text-xs border-gray-300 dark:border-gray-500 rounded-md py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-center border"
                                placeholder="%"
                              />
                              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs">%</span>
                              </div>
                            </div>
                          </td>
                          <td className={`px-4 py-3 whitespace-nowrap text-right text-sm align-middle ${isLowestCost ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                            {isValid ? (
                              <div className="flex flex-col items-end">
                                <span className={`font-bold ${isLowestCost ? 'text-green-700 dark:text-green-400 text-base' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {formatCurrency(cost)}
                                </span>
                                {isLowestCost && (
                                  <span className="text-[9px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-1.5 py-0.5 rounded-full flex items-center mt-1 border border-green-200 dark:border-green-800">
                                    <Trophy className="w-3 h-3 mr-1" /> MEJOR COSTO
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className={`px-4 py-3 whitespace-nowrap text-right bg-green-50 dark:bg-green-900/10 align-middle ${isHighestPrice ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600' : ''}`}>
                            {isValid ? (
                              <div className="flex flex-col items-end">
                                <span className={`leading-none ${isHighestPrice ? 'text-xl font-extrabold text-gray-900 dark:text-white' : 'text-lg font-bold text-green-700 dark:text-green-400'}`}>
                                  {formatCurrency(salePrice)}
                                </span>
                                {isHighestPrice && (
                                  <span className="text-[10px] font-bold text-yellow-800 dark:text-yellow-200 bg-yellow-200 dark:bg-yellow-900/50 px-2 py-0.5 rounded-full flex items-center mt-1 mb-1">
                                    <Star className="w-3 h-3 mr-1 fill-current" /> PRECIO SUGERIDO
                                  </span>
                                )}
                                <div className="flex flex-col items-end mt-1 w-full border-t border-gray-200/50 dark:border-gray-600/50 pt-1">
                                  <span className={`text-xs font-bold flex items-center ${isBestMargin ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1 rounded' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {isBestMargin && <BadgeCheck className="w-3 h-3 mr-1" />}
                                    Mg. Real: {realMargin.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="px-2 py-3 text-center align-middle">
                             <button 
                               onClick={() => toggleSupplier(id)}
                               className="text-gray-300 hover:text-red-500 transition-colors"
                               title="Quitar de comparativa"
                             >
                               <X className="w-4 h-4" />
                             </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center">
              <Tag className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Seleccione al menos un proveedor arriba para comenzar.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
