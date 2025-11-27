
import React, { useState } from 'react';
import { Database, Search, Car, Disc } from 'lucide-react';

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

export const OEGuide: React.FC = () => {
  const [searchTermOE, setSearchTermOE] = useState('');

  const filteredOEData = OE_DATA.filter(item => {
    const searchLower = searchTermOE.toLowerCase();
    return (
      item.marca.toLowerCase().includes(searchLower) ||
      item.modelo.toLowerCase().includes(searchLower) ||
      item.medida.toLowerCase().includes(searchLower) ||
      item.equipoOriginal.toLowerCase().includes(searchLower) ||
      item.linea.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg border-t-4 border-t-blue-600 animate-fade-in">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-blue-700">
              <Database className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Guía de Equipamiento Original</h3>
              <p className="text-sm text-gray-500">Base de datos de neumáticos homologados</p>
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
              placeholder="Buscar por auto, medida o marca..."
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vehículo / Equipo Original</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marca</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Medida</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Modelo</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOEData.length > 0 ? (
                  filteredOEData.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Car className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-bold text-gray-900">{item.equipoOriginal}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.marca === 'GOODYEAR' ? 'bg-gold-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.marca}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Disc className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-mono font-medium text-gray-900">{item.medida}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.modelo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {item.linea}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron resultados para "{searchTermOE}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
            <span>Mostrando {filteredOEData.length} resultados</span>
            <span>Fuente: Base de datos interna actualizada</span>
          </div>
        </div>
      </div>
    </div>
  );
};
