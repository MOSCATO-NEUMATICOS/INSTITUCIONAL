
import React, { useState, useMemo } from 'react';
import { Database, Search, Car, Disc, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// --- ORIGINAL EQUIPMENT DATA (From PDF) ---
interface OERecord {
  id: string;
  linea: string;
  marca: string;
  medida: string;
  modelo: string;
  equipoOriginal: string;
}

const OE_DATA: OERecord[] = [
  // PAGE 1 - GITI
  { id: '1', linea: 'AUTO', marca: 'GITI', medida: '195/55R16', modelo: 'GITICOMFORT 228', equipoOriginal: 'VW POLO HIGHLINE' },
  { id: '2', linea: 'CAMIONETA', marca: 'GITI', medida: '205/50R16', modelo: 'GITICOMFORT 228', equipoOriginal: 'BAIC X35' },
  { id: '3', linea: 'AUTO', marca: 'GITI', medida: '205/50R17', modelo: 'GITICOMFORT F22', equipoOriginal: 'CHERY ARRIZO 6 -HYBRID-' },
  { id: '4', linea: 'CAMIONETA', marca: 'GITI', medida: '215/50R17', modelo: 'GITICOMFORT F22', equipoOriginal: 'BAIC EU5 Plus' },
  { id: '5', linea: 'CAMIONETA', marca: 'GITI', medida: '215/50R17', modelo: 'GITICOMFORT 228', equipoOriginal: 'BAIC X25' },
  { id: '6', linea: 'CAMIONETA', marca: 'GITI', medida: '215/50R17', modelo: 'GITICOMFORT 228', equipoOriginal: 'BAIC X35 (3° Generación)' },
  { id: '7', linea: 'CAMIONETA', marca: 'GITI', medida: '215/50R17', modelo: 'GITICOMFORT F22', equipoOriginal: 'JAC JS4' },
  { id: '8', linea: 'CAMIONETA', marca: 'GITI', medida: '215/50R18', modelo: 'GITICOMFORT 225', equipoOriginal: 'ORA3 ELECTRICO' },
  { id: '9', linea: 'AUTO', marca: 'GITI', medida: '215/55R17', modelo: 'GITICOMFORT F22', equipoOriginal: 'BYD KING' },
  { id: '10', linea: 'AUTO', marca: 'GITI', medida: '215/55R17', modelo: 'GITICOMFORT F22', equipoOriginal: 'JAC E-J7' },
  { id: '11', linea: 'CAMIONETA', marca: 'GITI', medida: '215/55R18', modelo: 'GITICMFRT 520V1', equipoOriginal: 'CHERY TIGGO 4 PRO (Luxury)' },
  { id: '12', linea: 'CAMIONETA', marca: 'GITI', medida: '215/60R17', modelo: 'GITI4X4 HT152', equipoOriginal: 'BYD YUAN PRO' },
  { id: '13', linea: 'CAMIONETA', marca: 'GITI', medida: '215/60R17', modelo: 'GITICOMFORT F50', equipoOriginal: 'CHERY TIGGO 4 PRO (Comfort)' },
  { id: '14', linea: 'CAMIONETA', marca: 'GITI', medida: '225/50R18', modelo: 'GITICOMFORT 228', equipoOriginal: 'BAIC X55' },
  { id: '15', linea: 'CAMIONETA', marca: 'GITI', medida: '225/55R19', modelo: 'GITIXROSS HT71', equipoOriginal: 'NEW PEUGEOT 3008' },
  { id: '16', linea: 'CAMIONETA', marca: 'GITI', medida: '225/55R19', modelo: 'GITIXROSS HT71', equipoOriginal: 'NEW PEUGEOT 5008' },
  { id: '17', linea: 'CAMIONETA', marca: 'GITI', medida: '225/60R18', modelo: 'GITICOMFORT F50', equipoOriginal: 'BYD SONG PRO' },
  { id: '18', linea: 'CAMIONETA', marca: 'GITI', medida: '225/60R18', modelo: 'GITICOMFORT F50', equipoOriginal: 'CHERY TIGGO 7' },
  { id: '19', linea: 'CAMIONETA', marca: 'GITI', medida: '235/55R18', modelo: 'GITICOMFORT F50', equipoOriginal: 'FORD TERRITORY' },
  { id: '20', linea: 'CAMIONETA', marca: 'GITI', medida: '235/60R19', modelo: 'GITICOMFORT F50', equipoOriginal: 'BAIC BJ30' },
  { id: '21', linea: 'CAMIONETA', marca: 'GITI', medida: '255/45R20', modelo: 'GITICOMFORT F50', equipoOriginal: 'GEELY JETOUR X70 PLUS' },
  { id: '22', linea: 'CAMIONETA', marca: 'GITI', medida: '255/45R20', modelo: 'GITICOMFORT F50', equipoOriginal: 'JETOUR DASHING' },
  { id: '23', linea: 'CAMIONETA', marca: 'GITI', medida: '265/60R18', modelo: 'GITI4X4 HT152', equipoOriginal: 'JAC HUNTER' },
  
  // PAGE 1 - GOODYEAR
  { id: '24', linea: 'AUTO', marca: 'GOODYEAR', medida: '175/65R14', modelo: 'ASSURANCE MAXLIFE', equipoOriginal: 'FIAT MOBI' },
  { id: '25', linea: 'AUTO', marca: 'GOODYEAR', medida: '175/70R14', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'FIAT DOBLO' },
  { id: '26', linea: 'AUTO', marca: 'GOODYEAR', medida: '175/70R14', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'FIAT FIORINO' },
  { id: '27', linea: 'AUTO', marca: 'GOODYEAR', medida: '175/70R14', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'FIAT STRADA' },
  { id: '28', linea: 'AUTO', marca: 'GOODYEAR', medida: '185/60R15', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'FIAT ARGO' },
  { id: '29', linea: 'AUTO', marca: 'GOODYEAR', medida: '185/60R15', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'FIAT UNO' },
  { id: '30', linea: 'AUTO', marca: 'GOODYEAR', medida: '185/65R15', modelo: 'EAGLE TOURING', equipoOriginal: 'PEUGEOT 208' },
  { id: '31', linea: 'AUTO', marca: 'GOODYEAR', medida: '185/65R15', modelo: 'EAGLE TOURING', equipoOriginal: 'VW POLO' },
  { id: '32', linea: 'AUTO', marca: 'GOODYEAR', medida: '185/65R15', modelo: 'EAGLE TOURING', equipoOriginal: 'VW VIRTUS' },
  { id: '33', linea: 'AUTO', marca: 'GOODYEAR', medida: '185/70R14', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'CHEVROLET ONIX' },
  { id: '34', linea: 'AUTO', marca: 'GOODYEAR', medida: '195/55R15', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'VW FOX' },
  { id: '35', linea: 'AUTO', marca: 'GOODYEAR', medida: '195/55R15', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'VW GOL' },
  { id: '36', linea: 'AUTO', marca: 'GOODYEAR', medida: '195/55R15', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'VW VOYAGE' },
  { id: '37', linea: 'AUTO', marca: 'GOODYEAR', medida: '195/55R16', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'HYUNDAI HB20' },
  { id: '38', linea: 'AUTO', marca: 'GOODYEAR', medida: '195/55R16', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'PEUGEOT 208' },
  { id: '39', linea: 'AUTO', marca: 'GOODYEAR', medida: '195/60R16', modelo: 'EAGLE TOURING', equipoOriginal: 'FIAT PULSE' },
  { id: '40', linea: 'AUTO', marca: 'GOODYEAR', medida: '195/65R15', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'C3 2025' },
  { id: '41', linea: 'AUTO', marca: 'GOODYEAR', medida: '195/65R15', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'FIAT STRADA' },
  { id: '42', linea: 'ULT', marca: 'GOODYEAR', medida: '195/75R16', modelo: 'C CARGO MARATHON 2', equipoOriginal: 'FORD TRANSIT' },
  { id: '43', linea: 'ULT', marca: 'GOODYEAR', medida: '195/75R16', modelo: 'C CARGO MARATHON 2', equipoOriginal: 'IVECO DAILY' },
  { id: '44', linea: 'AUTO', marca: 'GOODYEAR', medida: '205/45R17', modelo: 'EAGLE TOURING', equipoOriginal: 'PEUGEOT 208' },
  { id: '45', linea: 'AUTO', marca: 'GOODYEAR', medida: '205/45R18', modelo: 'EAGLE TOURING', equipoOriginal: 'VW POLO GTS' },
  { id: '46', linea: 'AUTO', marca: 'GOODYEAR', medida: '205/50R17', modelo: 'EAGLE TOURING', equipoOriginal: 'VW POLO' },
  { id: '47', linea: 'AUTO', marca: 'GOODYEAR', medida: '205/50R17', modelo: 'EAGLE TOURING', equipoOriginal: 'VW VIRTUS' },
  { id: '48', linea: 'AUTO', marca: 'GOODYEAR', medida: '205/55R16', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'VW GOLF' },
  { id: '49', linea: 'AUTO', marca: 'GOODYEAR', medida: '205/55R16', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'VW VIRTUS' },
  { id: '50', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '205/55R17', modelo: 'WRANGLER TERRITORY HT', equipoOriginal: 'CITROEN C4 CACTUS' },
  { id: '51', linea: 'AUTO', marca: 'GOODYEAR', medida: '205/60R15', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'VW SAVEIRO' },
  { id: '52', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '205/60R16', modelo: 'EFFICIENTGRIP SUV', equipoOriginal: 'PEUGEOT 2008' },
  { id: '53', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '205/60R16', modelo: 'WRANGLER TERRITORY HT', equipoOriginal: 'VW NIVUS' },
  { id: '54', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '205/65R16', modelo: 'EFFICIENTGRIP SUV', equipoOriginal: 'HYUNDAI CRETA' },
  { id: '55', linea: 'AUTO', marca: 'GOODYEAR', medida: '215/50R17', modelo: 'EFFICIENTGRIP PERFORMANCE', equipoOriginal: 'HONDA CIVIC G10' },
  { id: '56', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '215/55R17', modelo: 'EFFICIENTGRIP SUV', equipoOriginal: 'CHEVROLET TRACKER' },
  { id: '57', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '215/55R18', modelo: 'WRANGLER TERRITORY HT', equipoOriginal: 'VW TAOS' },
  { id: '58', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '215/60R17', modelo: 'EFFICIENTGRIP SUV', equipoOriginal: 'CITROEN C3 AIRCROSS' },
  
  // PAGE 2
  { id: '59', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '215/60R17', modelo: 'EFFICIENTGRIP SUV', equipoOriginal: 'HYUNDAI CRETA' },
  { id: '60', linea: 'ULT', marca: 'GOODYEAR', medida: '225/65R16', modelo: 'C G32 CARGO', equipoOriginal: 'RENAULT MASTER' },
  { id: '61', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '235/45R19', modelo: 'WRANGLER TERRITORY HT', equipoOriginal: 'VW TAOS' },
  { id: '62', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '235/50R18', modelo: 'ASSURANCE FUEL MAX', equipoOriginal: 'FORD TERRITORY' },
  { id: '63', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '235/50R19', modelo: 'EFFICIENTGRIP SUV', equipoOriginal: 'FORD TERRITORY' },
  { id: '64', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '235/55R17', modelo: 'ASSURANCE FUEL MAX', equipoOriginal: 'FORD TERRITORY (2020-2022)' },
  { id: '65', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '235/55R18', modelo: 'EFFICIENTGRIP SUV', equipoOriginal: 'CHERY TIGGO 8' },
  { id: '66', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '235/60R18', modelo: 'WRANGLER TERRITORY HT', equipoOriginal: 'DODGE RAMPAGE' },
  { id: '67', linea: 'ULT', marca: 'GOODYEAR', medida: '235/65R16', modelo: 'C CARGO MARATHON 2', equipoOriginal: 'FORD TRANSIT' },
  { id: '68', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '265/60R18', modelo: 'WRANGLER TERRITORY HT', equipoOriginal: 'CHEVROLET - S10' },
  { id: '69', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '265/60R18', modelo: 'WRANGLER TERRITORY AT', equipoOriginal: 'FIAT TITANO' },
  { id: '70', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '265/60R18', modelo: 'WRANGLER TERRITORY AT', equipoOriginal: 'PEUGEOT LANDTREK' },
  { id: '71', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '265/65R17', modelo: 'WRANGLER TERRITORY AT', equipoOriginal: 'FIAT TITANO' },
  { id: '72', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '265/65R17', modelo: 'WRANGLER TERRITORY AT', equipoOriginal: 'PEUGEOT LANDTRAK' },
  { id: '73', linea: 'CAMIONETA', marca: 'GOODYEAR', medida: '265/70R17', modelo: 'WRANGLER DURATRAC', equipoOriginal: 'MITSUBISHI L200 SAVANA' },
  { id: '74', linea: 'CAMIONETA', marca: 'GT', medida: '215/60R17', modelo: 'FE2 (SUV)', equipoOriginal: 'NEW PEUGEOT 2008' },
  { id: '75', linea: 'CAMIONETA', marca: 'WANLI', medida: '235/50R19', modelo: 'WANLI SU027', equipoOriginal: 'JAC JS8-Pro' },
];

type SortKey = keyof OERecord;
type SortDirection = 'asc' | 'desc';

export const OEGuide: React.FC = () => {
  const [searchTermOE, setSearchTermOE] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: SortDirection }>({ 
    key: null, 
    direction: 'asc' 
  });

  const filteredOEData = useMemo(() => {
    let data = OE_DATA.filter(item => {
      const searchLower = searchTermOE.toLowerCase();
      return (
        item.marca.toLowerCase().includes(searchLower) ||
        item.modelo.toLowerCase().includes(searchLower) ||
        item.medida.toLowerCase().includes(searchLower) ||
        item.equipoOriginal.toLowerCase().includes(searchLower) ||
        item.linea.toLowerCase().includes(searchLower)
      );
    });

    if (sortConfig.key) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.key!].toString().toLowerCase();
        const bValue = b[sortConfig.key!].toString().toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [searchTermOE, sortConfig]);

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400 opacity-50" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1 text-blue-500" /> 
      : <ArrowDown className="w-3 h-3 ml-1 text-blue-500" />;
  };

  const getBrandStyle = (brand: string) => {
    switch (brand.toUpperCase()) {
      case 'GOODYEAR':
        return 'bg-brand-700 text-gold-400 border border-gold-400 shadow-sm font-bold tracking-wide';
      case 'GITI':
        return 'bg-yellow-400 text-black border border-black shadow-sm font-extrabold';
      case 'GT':
        return 'bg-gray-800 text-white border border-gray-600 shadow-sm font-bold';
      case 'WANLI':
        return 'bg-red-600 text-white border border-red-800 shadow-sm font-bold';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg border-t-4 border-t-blue-600 animate-fade-in transition-colors">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4 text-blue-700 dark:text-blue-400">
              <Database className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Guía de Equipamiento Original</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Base de datos de neumáticos homologados</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTermOE}
              onChange={(e) => setSearchTermOE(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-colors"
              placeholder="Buscar por auto, medida o marca..."
            />
          </div>
        </div>

        {/* RESULTS: TABLE FOR DESKTOP, CARDS FOR MOBILE */}
        
        {/* Mobile View (Cards) */}
        <div className="md:hidden space-y-4">
          {/* Sorting controls for mobile */}
          <div className="flex overflow-x-auto pb-2 gap-2 mb-2">
             <button onClick={() => handleSort('equipoOriginal')} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${sortConfig.key === 'equipoOriginal' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-white text-gray-600 border-gray-300'}`}>
                Auto {sortConfig.key === 'equipoOriginal' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
             </button>
             <button onClick={() => handleSort('medida')} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${sortConfig.key === 'medida' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-white text-gray-600 border-gray-300'}`}>
                Medida {sortConfig.key === 'medida' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
             </button>
             <button onClick={() => handleSort('marca')} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${sortConfig.key === 'marca' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-white text-gray-600 border-gray-300'}`}>
                Marca {sortConfig.key === 'marca' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
             </button>
          </div>

          {filteredOEData.length > 0 ? (
            filteredOEData.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center text-gray-900 dark:text-white font-bold">
                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                    {item.equipoOriginal}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    {item.linea}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Medida</span>
                    <div className="flex items-center mt-1">
                      <Disc className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">{item.medida}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${getBrandStyle(item.marca)}`}>
                      {item.marca}
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{item.modelo}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No se encontraron resultados para "{searchTermOE}"
            </div>
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none group"
                    onClick={() => handleSort('equipoOriginal')}
                  >
                    <div className="flex items-center">
                      Vehículo / Equipo Original
                      {getSortIcon('equipoOriginal')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none group"
                    onClick={() => handleSort('marca')}
                  >
                    <div className="flex items-center">
                      Marca
                      {getSortIcon('marca')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none group"
                    onClick={() => handleSort('medida')}
                  >
                    <div className="flex items-center">
                      Medida
                      {getSortIcon('medida')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none group"
                    onClick={() => handleSort('modelo')}
                  >
                    <div className="flex items-center">
                      Modelo
                      {getSortIcon('modelo')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none group"
                    onClick={() => handleSort('linea')}
                  >
                    <div className="flex items-center justify-center">
                      Tipo
                      {getSortIcon('linea')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOEData.length > 0 ? (
                  filteredOEData.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Car className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{item.equipoOriginal}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBrandStyle(item.marca)}`}>
                          {item.marca}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Disc className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">{item.medida}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.modelo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                        {item.linea}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No se encontraron resultados para "{searchTermOE}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
            <span>Mostrando {filteredOEData.length} resultados</span>
            <span>Fuente: Base de datos interna actualizada</span>
          </div>
        </div>
      </div>
    </div>
  );
};
