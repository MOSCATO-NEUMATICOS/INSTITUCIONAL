
import React, { useState, useMemo } from 'react';
import { Settings, Search, Truck, AlertTriangle, Info, RotateCcw, Wrench, Gauge, Hexagon, CircleDot, HelpCircle, X, Lock, Disc } from 'lucide-react';

// --- CATALOGO DE ANTIRROBOS (Según imagen provista) ---
const LOCKS = {
  ANTI01: "ANTI01 - Bulón 12x1.25 (Cónico)",
  ANTI02: "ANTI02 - Bulón 12x1.50 (Cónico)",
  ANTI03: "ANTI03 - Bulón 14x1.50 (Cónico)",
  ANTI04: "ANTI04 - Tuerca 12x1.25",
  ANTI05: "ANTI05 - Tuerca 12x1.50 (Cónica)",
  ANTI06: "ANTI06 - Tuerca 1/2\"x20",
  ANTI07: "ANTI07 - Bulón 12x1.25 (Plano/Original)",
  ANTI09: "ANTI09 - Tuerca 14x1.50",
  ANTI11: "ANTI11 - Tuerca 12x1.50 (Plana/Original)"
};

// --- DATABASE DE TORQUES (Actualizada con lógica de Antirrobos) ---
// lockStrategy: 'simple' (un solo codigo) | 'rim_dependent' (depende de chapa/aleacion)
// lockCode: string | { steel: string, alloy: string }

interface VehicleData {
  nm: number;
  thread: string;
  hex: string;
  type: 'Bulón' | 'Tuerca';
  lockStrategy?: 'simple' | 'rim_dependent';
  lockCode?: string | { steel: string, alloy: string };
}

const VEHICLE_DB: Record<string, Record<string, VehicleData>> = {
  "Audi": {
    "A3": { nm: 120, thread: "M14 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI03' },
    "A4": { nm: 120, thread: "M14 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI03' },
    "Q5": { nm: 140, thread: "M14 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI03' }
  },
  "BMW": {
    "Serie 1": { nm: 120, thread: "M12 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "Serie 3": { nm: 140, thread: "M14 x 1.25", hex: "17mm", type: 'Bulón' }, // No está en la lista de codigos provista la rosca 14x1.25
    "X1": { nm: 140, thread: "M14 x 1.25", hex: "17mm", type: 'Bulón' },
    "X3": { nm: 140, thread: "M14 x 1.25", hex: "17mm", type: 'Bulón' }
  },
  "Chery": {
    "Fulwin": { nm: 110, thread: "M12 x 1.5", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "QQ": { nm: 100, thread: "M12 x 1.5", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "Tiggo": { nm: 110, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' }
  },
  "Chevrolet": {
    "Agile": { nm: 110, thread: "M12 x 1.5", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' }, 
    "Aveo": { nm: 110, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Classic / Corsa": { nm: 110, thread: "M12 x 1.5", hex: "17/19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "Cruze": { nm: 140, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Onix / Prisma": { nm: 120, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' }, 
    "S-10": { nm: 140, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Spin": { nm: 120, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' }, 
    "Tracker": { nm: 140, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Trailblazer": { nm: 140, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' }
  },
  "Citroën": {
    "Berlingo": { nm: 100, thread: "M12 x 1.25", hex: "17/19mm", type: 'Bulón', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI01', alloy: 'ANTI07' } },
    "C3": { nm: 100, thread: "M12 x 1.25", hex: "17/19mm", type: 'Bulón', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI01', alloy: 'ANTI07' } },
    "C4": { nm: 100, thread: "M12 x 1.25", hex: "17mm", type: 'Bulón', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI01', alloy: 'ANTI07' } },
    "C4 Cactus": { nm: 100, thread: "M12 x 1.25", hex: "17mm", type: 'Bulón', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI01', alloy: 'ANTI07' } }
  },
  "Dodge": {
    "Journey": { nm: 135, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Ram 1500": { nm: 175, thread: "M14 x 1.5", hex: "22mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI09' }
  },
  "Fiat": {
    "500": { nm: 98, thread: "M12 x 1.25", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI01' },
    "Argo / Cronos": { nm: 120, thread: "M12 x 1.25", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI01' },
    "Ducato": { nm: 180, thread: "M16 x 1.5", hex: "21mm", type: 'Bulón' }, // Sin codigo standard en lista
    "Fiorino": { nm: 98, thread: "M12 x 1.25", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI01' },
    "Palio / Siena": { nm: 98, thread: "M12 x 1.25", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI01' },
    "Strada": { nm: 120, thread: "M12 x 1.25", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI01' },
    "Toro": { nm: 135, thread: "M12 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "Uno": { nm: 98, thread: "M12 x 1.25", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI01' }
  },
  "Ford": {
    "EcoSport": { nm: 135, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Fiesta": { nm: 110, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Focus": { nm: 135, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Ka": { nm: 110, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Kuga": { nm: 135, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Mondeo": { nm: 135, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Ranger": { nm: 135, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "F-100": { nm: 150, thread: "1/2\"", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI06' }
  },
  "Honda": {
    "Civic": { nm: 108, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' }, // Honda orig lleva asiento esferico, pero ANTI05 suele ser conico. Revisar si hay ANTI Honda. Asumimos 05 por rosca.
    "CR-V": { nm: 108, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Fit / City": { nm: 108, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "HR-V": { nm: 108, thread: "M12 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' }
  },
  "Hyundai": {
    "Creta": { nm: 110, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Tucson": { nm: 110, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Santa Fe": { nm: 110, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "i10 / i30": { nm: 110, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' }
  },
  "Jeep": {
    "Renegade": { nm: 120, thread: "M12 x 1.25", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI01' },
    "Compass": { nm: 120, thread: "M12 x 1.25", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI01' },
    "Grand Cherokee": { nm: 130, thread: "M14 x 1.5", hex: "22mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI09' },
    "Wrangler": { nm: 130, thread: "M14 x 1.5", hex: "19mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI09' }
  },
  "Kia": {
    "Sportage": { nm: 110, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Sorento": { nm: 110, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' },
    "Rio / Picanto": { nm: 110, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI05' }
  },
  "Nissan": {
    "Frontier": { nm: 112, thread: "M12 x 1.25", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI04' },
    "Kicks": { nm: 112, thread: "M12 x 1.25", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI04' },
    "Versa": { nm: 112, thread: "M12 x 1.25", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI04' },
    "March / Note": { nm: 112, thread: "M12 x 1.25", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI04' },
    "Sentra": { nm: 112, thread: "M12 x 1.25", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI04' }
  },
  "Peugeot": {
    "208": { nm: 100, thread: "M12 x 1.25", hex: "17mm", type: 'Bulón', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI01', alloy: 'ANTI07' } },
    "308 / 408": { nm: 100, thread: "M12 x 1.25", hex: "17mm", type: 'Bulón', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI01', alloy: 'ANTI07' } },
    "2008 / 3008": { nm: 100, thread: "M12 x 1.25", hex: "17mm", type: 'Bulón', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI01', alloy: 'ANTI07' } },
    "Partner": { nm: 100, thread: "M12 x 1.25", hex: "17/19mm", type: 'Bulón', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI01', alloy: 'ANTI07' } },
    "206 / 207": { nm: 90, thread: "M12 x 1.25", hex: "19mm", type: 'Bulón', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI01', alloy: 'ANTI07' } }
  },
  "Renault": {
    "Clio": { nm: 105, thread: "M12 x 1.5", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "Kangoo": { nm: 105, thread: "M12 x 1.5", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "Sandero / Logan": { nm: 105, thread: "M12 x 1.5", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "Duster / Oroch": { nm: 105, thread: "M12 x 1.5", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "Master": { nm: 170, thread: "M14 x 1.5", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI03' },
    "Alaskan": { nm: 112, thread: "M12 x 1.25", hex: "21mm", type: 'Tuerca', lockStrategy: 'simple', lockCode: 'ANTI04' }
  },
  "Toyota": {
    "Corolla": { nm: 103, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI05', alloy: 'ANTI11' } },
    "Hilux": { nm: 105, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI05', alloy: 'ANTI11' } },
    "Etios": { nm: 103, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI05', alloy: 'ANTI11' } },
    "Yaris": { nm: 103, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI05', alloy: 'ANTI11' } },
    "Rav4": { nm: 103, thread: "M12 x 1.5", hex: "21mm", type: 'Tuerca', lockStrategy: 'rim_dependent', lockCode: { steel: 'ANTI05', alloy: 'ANTI11' } }
  },
  "Volkswagen": {
    "Gol / Saveiro": { nm: 110, thread: "M12 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "Suran / Fox": { nm: 110, thread: "M14 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI03' },
    "Amarok": { nm: 180, thread: "M14 x 1.5", hex: "19mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI03' },
    "Vento / Golf": { nm: 120, thread: "M14 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI03' },
    "Bora": { nm: 120, thread: "M14 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI03' },
    "Up": { nm: 110, thread: "M12 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI02' },
    "Taos": { nm: 140, thread: "M14 x 1.5", hex: "17mm", type: 'Bulón', lockStrategy: 'simple', lockCode: 'ANTI03' }
  }
};

export const TorqueFinder: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [rimType, setRimType] = useState<'alloy' | 'steel'>('alloy'); // Default to Alloy
  const [showHelp, setShowHelp] = useState(false);

  // Derived state for models list
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    return Object.keys(VEHICLE_DB[selectedBrand] || {}).sort();
  }, [selectedBrand]);

  // Derived state for result
  const result = useMemo(() => {
    if (!selectedBrand || !selectedModel) return null;
    return VEHICLE_DB[selectedBrand]?.[selectedModel] || null;
  }, [selectedBrand, selectedModel]);

  // Helper conversions
  const getFtLb = (nm: number) => Math.round(nm * 0.73756);
  const getKgm = (nm: number) => (nm * 0.10197).toFixed(1);

  // Helper for Lock Recommendation
  const getLockRecommendation = () => {
    if (!result || !result.lockCode) return null;

    let code = '';
    if (result.lockStrategy === 'simple') {
      code = result.lockCode as string;
    } else if (result.lockStrategy === 'rim_dependent') {
      const codes = result.lockCode as { steel: string, alloy: string };
      code = rimType === 'alloy' ? codes.alloy : codes.steel;
    }

    // @ts-ignore
    const description = LOCKS[code] || "Consultar Catálogo";
    return { code, description };
  };

  const lockInfo = getLockRecommendation();

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg border-t-4 border-t-orange-500 animate-fade-in transition-colors">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-4 text-orange-600 dark:text-orange-400">
              <Gauge className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Torque y Antirrobos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Especificaciones de apriete y códigos de seguridad.</p>
            </div>
          </div>
          {/* Help Button */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-900/30 px-3 py-2 rounded-md border border-orange-200 dark:border-orange-800 hover:border-orange-300 transition-colors"
            title="Info de apriete"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ayuda</span>
          </button>
        </div>

        {/* HELP SECTION */}
        {showHelp && (
          <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 animate-fade-in relative">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-2 right-2 text-orange-400 hover:text-orange-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Recomendaciones de Seguridad
            </h4>
            <ul className="text-xs text-orange-800 dark:text-orange-200 space-y-1 list-disc list-inside">
              <li>El torque final debe realizarse siempre con torquímetro calibrado y en orden cruzado.</li>
              <li>Limpie las superficies de apoyo del cubo y la llanta antes del montaje.</li>
              <li>Verifique si el bulón/tuerca requiere asiento cónico o plano según la llanta.</li>
              <li>Re-apretar luego de 50-100 km de rodado si es una llanta nueva o de aleación.</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          
          {/* SELECTION AREA */}
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Seleccione Vehículo
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Marca</label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedBrand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setSelectedModel('');
                        // Reset rim type preference when brand changes just in case
                        setRimType('alloy'); 
                      }}
                      className="block w-full pl-10 pr-3 py-2.5 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    >
                      <option value="">-- Seleccionar Marca --</option>
                      {Object.keys(VEHICLE_DB).sort().map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Modelo</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={!selectedBrand}
                      className="block w-full pl-10 pr-3 py-2.5 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400"
                    >
                      <option value="">-- Seleccionar Modelo --</option>
                      {availableModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* RIM TYPE TOGGLE (Only if needed or generic) */}
              {/* We show this always or only if lockStrategy is rim_dependent? 
                  Better to show it always or only when vehicle is selected to make user aware of the difference. 
                  Showing only for relevant cars might be cleaner. */}
              {result && result.lockStrategy === 'rim_dependent' && (
                 <div className="mt-4 animate-fade-in">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tipo de Llanta</label>
                    <div className="flex bg-white dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-600">
                       <button 
                         onClick={() => setRimType('alloy')}
                         className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center transition-all ${rimType === 'alloy' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                       >
                         <Disc className="w-3 h-3 mr-1" /> Aleación (Original)
                       </button>
                       <button 
                         onClick={() => setRimType('steel')}
                         className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center transition-all ${rimType === 'steel' ? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                       >
                         <CircleDot className="w-3 h-3 mr-1" /> Chapa / Acero
                       </button>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 italic">
                      * El código del antirrobo varía según el asiento de la llanta.
                    </p>
                 </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => { setSelectedBrand(''); setSelectedModel(''); setRimType('alloy'); }}
                  className="text-xs text-gray-500 hover:text-orange-500 flex items-center transition-colors"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>

          {/* RESULT AREA */}
          <div>
            {result ? (
              <div className="bg-white dark:bg-gray-800 border-2 border-orange-100 dark:border-orange-900 rounded-xl p-6 shadow-md h-full flex flex-col justify-center relative overflow-hidden animate-fade-in">
                {/* Background Decoration */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 dark:bg-orange-900/30 rounded-full blur-3xl opacity-60"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{result.nm} <span className="text-lg text-gray-500 dark:text-gray-400 font-medium">Nm</span></h3>
                    <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>≈ {getFtLb(result.nm)} ft-lb</span>
                      <span>≈ {getKgm(result.nm)} kg-m</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Hexagon className="w-5 h-5 mr-3 text-orange-500" />
                        <span className="font-medium text-sm">Medida Hexágono</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{result.hex}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Settings className="w-5 h-5 mr-3 text-orange-500" />
                        <span className="font-medium text-sm">Rosca</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{result.thread}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <CircleDot className="w-5 h-5 mr-3 text-orange-500" />
                        <span className="font-medium text-sm">Tipo Fijación</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{result.type}</span>
                    </div>

                    {/* LOCK RECOMMENDATION CARD */}
                    {lockInfo && (
                      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg animate-fade-in">
                         <div className="flex items-start">
                            <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2 mt-0.5" />
                            <div>
                               <span className="block text-xs font-bold text-orange-800 dark:text-orange-300 uppercase mb-1">
                                 Antirrobo Recomendado
                               </span>
                               <span className="block text-lg font-extrabold text-gray-900 dark:text-white leading-none">
                                 {lockInfo.code}
                               </span>
                               <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">
                                 {lockInfo.description}
                               </span>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50">
                <Wrench className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-sm font-medium text-center">Seleccione marca y modelo para ver los valores de apriete.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
