
import React, { useState } from 'react';
import { Timer, Wrench, ArrowRight, Activity, DollarSign, Database, ChevronRight, Car, Calculator } from 'lucide-react';
import { OEGuide } from '../components/tools/OEGuide';
import { UnitConverter } from '../components/tools/UnitConverter';
import { CashBox } from '../components/tools/CashBox';
import { TireComparator } from '../components/tools/TireComparator';
import { LaborTime } from '../components/tools/LaborTime';
import { LicensePlateLookup } from '../components/tools/LicensePlateLookup';
import { CostCalculator } from '../components/tools/CostCalculator';
import { Page, Supplier } from '../types';
import { SectionHero } from '../components/SectionHero';

type ToolId = 'oe_guide' | 'converter' | 'cash_box' | 'tire_comparator' | 'plate_lookup' | 'labor_time' | 'cost_calculator';

// Menu ordered alphabetically by label for better UX
const TOOLS_MENU = [
  { id: 'plate_lookup', label: 'Año por Patente', icon: Car, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-600 dark:border-indigo-500' },
  { id: 'cash_box', label: 'Arqueo de Caja', icon: DollarSign, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-600 dark:border-green-500' },
  { id: 'cost_calculator', label: 'Calculadora de Costos', icon: Calculator, color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-600 dark:border-green-500' },
  { id: 'labor_time', label: 'Calculadora de Tiempos', icon: Timer, color: 'text-gray-600 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-700', border: 'border-gray-300 dark:border-gray-500' },
  { id: 'tire_comparator', label: 'Comparador Neumáticos', icon: Activity, color: 'text-gold-600 dark:text-gold-400', bg: 'bg-gold-100 dark:bg-yellow-900/30', border: 'border-gold-600 dark:border-gold-500' },
  { id: 'converter', label: 'Convertidor de Presión', icon: Wrench, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-100 dark:bg-brand-900/30', border: 'border-brand-600 dark:border-brand-500' },
  { id: 'oe_guide', label: 'Guía Equipamiento Original', icon: Database, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-600 dark:border-blue-500' },
] as const;

interface ToolsProps {
  onNavigate: (page: Page) => void;
  suppliers?: Supplier[];
}

export const Tools: React.FC<ToolsProps> = ({ onNavigate, suppliers = [] }) => {
  // Keeps 'labor_time' as default as it's likely the most used, but menu is sorted alphabetically
  const [activeTool, setActiveTool] = useState<ToolId>('labor_time');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      <SectionHero
        title="Herramientas Digitales"
        subtitle="Suite de utilidades para optimizar la gestión diaria del taller, presupuestación y atención al cliente."
        badgeText="Productividad"
        badgeIcon={Wrench}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- SIDEBAR MENU --- */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24 transition-colors">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
               <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Menú de Herramientas</span>
            </div>
            <nav className="flex flex-col p-2 space-y-1">
              {TOOLS_MENU.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as ToolId)}
                  className={`flex items-center w-full px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                    activeTool === tool.id
                      ? `${tool.bg} ${tool.color} ring-1 ring-inset ${tool.border.replace('border', 'ring')}`
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tool.icon className={`w-5 h-5 mr-3 ${activeTool === tool.id ? tool.color : 'text-gray-400 dark:text-gray-500'}`} />
                  <span className="flex-1 text-left">{tool.label}</span>
                  {activeTool === tool.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>
              ))}
            </nav>

             <div className="p-4 mt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">¿Sugerencias?</h4>
                <button 
                  onClick={() => onNavigate(Page.FEEDBACK)}
                  className="text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 text-xs font-semibold flex items-center justify-center w-full py-2 border border-brand-200 dark:border-brand-800 rounded bg-white dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-900/50 transition-colors"
                >
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
          {activeTool === 'cost_calculator' && <CostCalculator suppliers={suppliers} />}
        </div>
      </div>
    </div>
  );
};
