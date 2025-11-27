
import React from 'react';
import { Construction, AlertTriangle } from 'lucide-react';

export const LaborTime: React.FC = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg border-t-4 border-t-gray-400 animate-fade-in h-[600px] flex items-center justify-center">
      <div className="text-center p-8 max-w-lg">
        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <Construction className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Herramienta en Desarrollo</h3>
        <p className="text-gray-500 mb-8 text-lg">
          La <strong>Calculadora de Tiempos</strong> estará disponible próximamente para estimar la mano de obra basada en estándares de fábrica.
        </p>
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 inline-block">
          <p className="text-sm text-gold-800 font-medium flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Fecha estimada de lanzamiento: Q4 2024
          </p>
        </div>
      </div>
    </div>
  );
};
