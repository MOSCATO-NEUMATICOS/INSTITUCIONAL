
import React, { useState, useEffect } from 'react';
import { IpAlias, VisitRecord } from '../../types';
import { storageService } from '../../services/storage';
import { Globe, Calendar, BarChart2, Network, Trash2, Database, Loader2, Download, RefreshCw, Smartphone, Monitor } from 'lucide-react';

interface AdminSystemProps {
  ipAliases: IpAlias[];
  onAddIpAlias: (alias: IpAlias) => void;
  onDeleteIpAlias: (id: string) => void;
  onImportData: (data: any) => void;
  fullDataExport: any; // All data props from parent
}

export const AdminSystem: React.FC<AdminSystemProps> = ({ ipAliases, onAddIpAlias, onDeleteIpAlias, onImportData, fullDataExport }) => {
  const [visitStats, setVisitStats] = useState<{total: number, today: number, previousVisit: string}>({ total: 0, today: 0, previousVisit: '-' });
  const [recentVisitsLog, setRecentVisitsLog] = useState<VisitRecord[]>([]);
  const [newIpAlias, setNewIpAlias] = useState({ ip: '', name: '' });
  const [isExporting, setIsExporting] = useState(false);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      const visits = await storageService.getVisits();
      const todayStr = new Date().toLocaleDateString('es-AR');
      
      const todayCount = visits.filter(v => v.dateString === todayStr).length;
      
      // Logic for Previous Visit (Index 1, since Index 0 is "now")
      let prevVisit = 'Primer Ingreso';
      if (visits.length > 1) {
          const prev = visits[1]; // Get the second item
          prevVisit = new Date(prev.timestamp).toLocaleString('es-AR', { 
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
          });
      } else if (visits.length === 0) {
          prevVisit = '-';
      }

      setVisitStats({
        total: visits.length,
        today: todayCount,
        previousVisit: prevVisit
      });

      // Store log for table (Top 20)
      setRecentVisitsLog(visits.slice(0, 20));
    };
    loadStats();
  }, []);

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpAlias.ip || !newIpAlias.name) return;
    
    onAddIpAlias({
      id: Date.now().toString(),
      ip: newIpAlias.ip.trim(),
      name: newIpAlias.name.trim()
    });
    setNewIpAlias({ ip: '', name: '' });
  };

  // Helper to parse User Agent
  const getDeviceIcon = (ua: string = '') => {
    if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
      return <Smartphone className="w-4 h-4 text-brand-500 inline mr-1" />;
    }
    return <Monitor className="w-4 h-4 text-gray-500 inline mr-1" />;
  };

  const getDeviceName = (ua: string = '') => {
    let os = 'Desconocido';
    if (/Windows/i.test(ua)) os = 'PC Windows';
    else if (/Mac/i.test(ua)) os = 'Mac';
    else if (/iPhone|iPad/i.test(ua)) os = 'iPhone/iPad';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/Linux/i.test(ua)) os = 'Linux';

    let browser = '';
    if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Edge/i.test(ua)) browser = 'Edge';

    return `${os} ${browser ? `(${browser})` : ''}`;
  };

  const getIpLabel = (ip: string | undefined) => {
    if (!ip) return { label: '-', isAlias: false };
    const alias = ipAliases.find(a => a.ip === ip);
    if (alias) {
      return { label: alias.name, ip: ip, isAlias: true };
    }
    return { label: ip, isAlias: false };
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const freshRecCourses = await storageService.getRecommendedCourses();
      const freshEmpCourses = await storageService.getEmployeeCourses();
      const freshAliases = await storageService.getIpAliases();
      const freshSuppliers = await storageService.getSuppliers();

      // Merge current props with fresh fetch
      const data = {
        ...fullDataExport,
        recommendedCourses: freshRecCourses,
        employeeCourses: freshEmpCourses,
        ipAliases: freshAliases,
        suppliers: freshSuppliers
      };
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_moscato_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      alert("Hubo un error al generar la copia de seguridad.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (onImportData) {
          if (confirm('ATENCIÓN: Esto reemplazará los datos actuales con los del archivo. ¿Desea continuar?')) {
            onImportData(json);
            alert('¡Datos restaurados con éxito!');
          }
        }
      } catch (error) {
        alert('Error al leer el archivo. Asegúrese de que sea un JSON válido.');
        console.error(error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4 text-blue-600">
            <Globe className="w-6 h-6" />
            </div>
            <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Visitas Totales</p>
            <p className="text-2xl font-bold text-gray-900">{visitStats.total}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600">
            <Calendar className="w-6 h-6" />
            </div>
            <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Visitas Hoy</p>
            <p className="text-2xl font-bold text-gray-900">{visitStats.today}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
            <div className="p-3 bg-purple-100 rounded-full mr-4 text-purple-600">
            <BarChart2 className="w-6 h-6" />
            </div>
            <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Último Ingreso</p>
            <p className="text-sm font-bold text-gray-900">{visitStats.previousVisit}</p>
            </div>
        </div>
        </div>

        {/* Security & Access Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* IP ALIAS MANAGER */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg overflow-hidden h-fit">
            <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
            <h4 className="font-bold text-sm flex items-center"><Network className="w-4 h-4 mr-2" /> IPs Conocidas (Alias)</h4>
            </div>
            <div className="p-4 bg-gray-50 border-b border-gray-200">
            <form onSubmit={handleAddAlias} className="space-y-2">
                <input 
                type="text" 
                placeholder="Dirección IP (ej: 181.10.20.30)" 
                className="w-full p-2 text-xs border rounded bg-white text-gray-900"
                value={newIpAlias.ip}
                onChange={e => setNewIpAlias({...newIpAlias, ip: e.target.value})}
                />
                <input 
                type="text" 
                placeholder="Nombre (ej: Oficina, Casa)" 
                className="w-full p-2 text-xs border rounded bg-white text-gray-900"
                value={newIpAlias.name}
                onChange={e => setNewIpAlias({...newIpAlias, name: e.target.value})}
                />
                <button type="submit" className="w-full bg-gray-600 text-white text-xs font-bold py-2 rounded hover:bg-gray-700">Guardar Alias</button>
            </form>
            </div>
            <ul className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
            {ipAliases.map(alias => (
                <li key={alias.id} className="p-3 flex justify-between items-center hover:bg-gray-50 text-xs">
                <div>
                    <span className="font-bold block text-gray-800">{alias.name}</span>
                    <span className="text-gray-500 font-mono">{alias.ip}</span>
                </div>
                <button onClick={() => onDeleteIpAlias(alias.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </li>
            ))}
            </ul>
        </div>

        {/* ACCESS LOGS TABLE */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">Registro de Actividad Reciente</h3>
            </div>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha / Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispositivo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP / Origen</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {recentVisitsLog.map((visit) => {
                    const ipInfo = getIpLabel(visit.ip);
                    return (
                    <tr key={visit.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(visit.timestamp).toLocaleString('es-AR', { hour12: false })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {getDeviceIcon(visit.deviceInfo)}
                        <span className="text-xs ml-1">{getDeviceName(visit.deviceInfo)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">
                        {ipInfo.isAlias ? (
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">{ipInfo.label}</span>
                        ) : (
                            ipInfo.label
                        )}
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
        </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" /> Gestión de Datos y Copias de Seguridad
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
            <button 
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
            {isExporting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Download className="w-5 h-5 mr-2 text-brand-600" />}
            {isExporting ? 'Generando...' : 'Descargar Copia de Seguridad (JSON)'}
            </button>
            
            <div className="relative flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500 cursor-pointer">
            <label htmlFor="import-file" className="cursor-pointer flex items-center w-full justify-center">
                <RefreshCw className="w-5 h-5 mr-2 text-green-600" />
                <span>Restaurar desde Archivo</span>
                <input 
                id="import-file" 
                type="file" 
                accept=".json" 
                className="sr-only" 
                onChange={handleImportFile}
                />
            </label>
            </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
            * Descargue una copia regularmente para evitar pérdida de datos en caso de limpieza de caché del navegador o problemas de conexión.
        </p>
        </div>
    </div>
  );
};
