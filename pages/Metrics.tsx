
import React from 'react';
import { BarChart3, HardHat, Calendar, TrendingUp, MapPin, PieChart, Activity } from 'lucide-react';

export const Metrics: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-brand-100 rounded-full mb-4">
          <BarChart3 className="w-10 h-10 text-brand-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Tablero de Métricas</h2>
        <p className="mt-2 text-xl text-gray-500">Indicadores clave de rendimiento (KPIs) en tiempo real.</p>
      </div>

      {/* Construction Card */}
      <div className="bg-white rounded-2xl shadow-xl border-t-8 border-gold-400 overflow-hidden relative animate-fade-in">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <TrendingUp className="w-96 h-96 text-brand-900 transform translate-x-20 -translate-y-20" />
        </div>

        <div className="p-8 md:p-16 text-center z-10 relative">
           <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6 border-4 border-dashed border-gray-300 animate-pulse">
             <HardHat className="w-12 h-12 text-gray-500" />
           </div>
           
           <h3 className="text-2xl md:text-3xl font-bold text-brand-900 mb-4">
             Sección en Construcción
           </h3>
           
           <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
             Estamos desarrollando un módulo de análisis de datos avanzado para visualizar el rendimiento diario de nuestras sucursales. Este tablero permitirá tomar decisiones basadas en datos reales de <strong>Taller</strong> y <strong>Ventas</strong>.
           </p>

           <div className="inline-flex items-center px-6 py-3 bg-brand-50 text-brand-700 rounded-full font-bold border border-brand-200 shadow-sm">
             <Calendar className="w-5 h-5 mr-2" />
             Lanzamiento Estimado: Febrero 2026
           </div>
        </div>

        {/* Feature Preview Grid */}
        <div className="bg-gray-50 border-t border-gray-200 p-8">
          <h4 className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">
            Próximamente disponible para
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
             {/* Sucursal Almafuerte */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
                <div className="flex items-center mb-4">
                   <MapPin className="w-5 h-5 text-brand-600 mr-2" />
                   <h5 className="font-bold text-gray-900">Sucursal Almafuerte</h5>
                </div>
                <div className="space-y-3">
                   <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                   <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                   <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
                </div>
             </div>

             {/* Sucursal Alberdi */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
                <div className="flex items-center mb-4">
                   <MapPin className="w-5 h-5 text-gold-500 mr-2" />
                   <h5 className="font-bold text-gray-900">Sucursal Alberdi</h5>
                </div>
                <div className="space-y-3">
                   <div className="h-2 bg-gray-200 rounded-full w-2/3"></div>
                   <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                   <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                </div>
             </div>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
             <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 text-blue-600">
                   <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-gray-500">Ventas Neumáticos</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 text-green-600">
                   <Activity className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-gray-500">Alineación y Balanceo</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 text-purple-600">
                   <PieChart className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-gray-500">Vehículos Atendidos</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2 text-orange-600">
                   <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-gray-500">Comparativa Mensual</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
