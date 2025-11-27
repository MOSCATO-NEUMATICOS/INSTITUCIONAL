
import React, { useState } from 'react';
import { Timer, Wrench, ArrowRight, Activity, DollarSign, Database, ChevronRight, Car } from 'lucide-react';
import { OEGuide } from '../components/tools/OEGuide';
import { UnitConverter } from '../components/tools/UnitConverter';
import { CashBox } from '../components/tools/CashBox';
import { TireComparator } from '../components/tools/TireComparator';
import { LaborTime } from '../components/tools/LaborTime';
import { LicensePlateLookup } from '../components/tools/LicensePlateLookup';

type ToolId = 'oe_guide' | 'converter' | 'cash_box' | 'tire_comparator' | 'plate_lookup' | 'labor_time';

const TOOLS_MENU = [
  { id: 'oe_guide', label: 'Guía Equipamiento Original', icon: Database, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-600' },
  { id: 'plate_lookup', label: 'Año por Patente', icon: Car, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-600' },
  { id: 'converter', label: 'Convertidor de Presión', icon: Wrench, color: 'text-brand-600', bg: 'bg-brand-100', border: 'border-brand-600' },
  { id: 'cash_box', label: 'Arqueo de Caja', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-600' },
  { id: 'tire_comparator', label: 'Comparador Neumáticos', icon: Activity, color: 'text-gold-600', bg: 'bg-gold-100', border: 'border-gold-600' },
  { id: 'labor_time', label: 'Calculadora de Tiempos', icon: Timer, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-300' },
] as const;

export const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>('oe_guide');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-brand-900">Herramientas Digitales</h2>
        <p className="mt-1 text-sm text-gray-500">Seleccione una herramienta del panel para comenzar a trabajar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- SIDEBAR MENU --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden sticky top-24">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Menú de Herramientas</span>
            </div>
            <nav className="flex flex-col p-2 space-y-1">
              {TOOLS_MENU.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`flex items-center w-full px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                    activeTool === tool.id
                      ? `${tool.bg} ${tool.color} ring-1 ring-inset ${tool.border.replace('border', 'ring')}`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tool.icon className={`w-5 h-5 mr-3 ${activeTool === tool.id ? tool.color : 'text-gray-400'}`} />
                  <span className="flex-1 text-left">{tool.label}</span>
                  {activeTool === tool.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>
              ))}
            </nav>

             <div className="p-4 mt-4 border-t border-gray-200 bg-gray-50 text-center">
                <h4 className="text-xs font-bold text-gray-500 mb-2">¿Sugerencias?</h4>
                <button className="text-brand-600 hover:text-brand-800 text-xs font-semibold flex items-center justify-center w-full py-2 border border-brand-200 rounded bg-white hover:bg-brand-50 transition-colors">
                  Ir al Buzón <ArrowRight className="w-3 h-3 ml-1" />
                </button>
             </div>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="lg:col-span-3">
          {activeTool === 'oe_guide' && <OEGuide />}
          {activeTool === 'plate_lookup' && <LicensePlateLookup />}
          {activeTool === 'converter' && <UnitConverter />}
          {activeTool === 'cash_box' && <CashBox />}
          {activeTool === 'tire_comparator' && <TireComparator />}
          {activeTool === 'labor_time' && <LaborTime />}
        </div>
      </div>
    </div>
  );
};
