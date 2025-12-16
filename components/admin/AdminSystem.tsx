
import React, { useState, useEffect } from 'react';
import { IpAlias, VisitRecord } from '../../types';
import { storageService } from '../../services/storage';
import { Globe, Calendar, BarChart2, Network, Trash2, Database, Loader2, Download, RefreshCw, Smartphone, Monitor, Wifi, CheckCircle2, AlertCircle, Maximize, Languages, ChevronDown, ChevronUp, HelpCircle, Info, X, Shield, List, Fingerprint } from 'lucide-react';

interface AdminSystemProps {
  ipAliases: IpAlias[];
  onAddIpAlias: (alias: IpAlias) => void;
  onDeleteIpAlias: (id: string) => void;
  onImportData: (data: any) => void;
  onClearHistory?: () => void; // Prop for clearing history
  fullDataExport: any; 
}

interface ConnectionStat {
  key: string; 
  name: string;
  isKnown: boolean;
  count: number;
  lastSeen: number;
  ip: string; 
  isp?: string; 
  type: 'device' | 'ip'; 
}

export const AdminSystem: React.FC<AdminSystemProps> = ({ ipAliases, onAddIpAlias, onDeleteIpAlias, onImportData, onClearHistory, fullDataExport }) => {
  const [visitStats, setVisitStats] = useState<{total: number, today: number, previousVisit: string}>({ total: 0, today: 0, previousVisit: '-' });
  const [recentVisitsLog, setRecentVisitsLog] = useState<VisitRecord[]>([]);
  const [connectionStats, setConnectionStats] = useState<ConnectionStat[]>([]);
  const [newIpAlias, setNewIpAlias] = useState({ ip: '', name: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false); // Loading state for clearing
  
  // UI Toggles
  const [showIpRanking, setShowIpRanking] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showAliasHelp, setShowAliasHelp] = useState(false);
  const [showBackupHelp, setShowBackupHelp] = useState(false);

  // Load stats function to be reusable
  const loadStats = async () => {
    const visits = await storageService.getVisits();
    const todayStr = new Date().toLocaleDateString('es-AR');
    
    const todayCount = visits.filter(v => v.dateString === todayStr).length;
    
    let prevVisit = 'Primer Ingreso';
    if (visits.length > 1) {
        const prev = visits[1]; 
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

    setRecentVisitsLog(visits.slice(0, 50));

    // --- DEVICE / IP AGGREGATION LOGIC ---
    const aggMap = new Map<string, { count: number, lastDate: number, ip: string, isp?: string, type: 'device' | 'ip' }>();

    visits.forEach(v => {
      const hasDeviceId = !!v.deviceId;
      const key = hasDeviceId ? v.deviceId! : (v.ip || 'Desconocido');
      const type = hasDeviceId ? 'device' : 'ip';
      
      const current = aggMap.get(key) || { count: 0, lastDate: 0, ip: v.ip || '', isp: '', type };
      
      aggMap.set(key, {
        count: current.count + 1,
        lastDate: Math.max(current.lastDate, v.timestamp),
        ip: v.ip || current.ip, 
        isp: v.isp || current.isp,
        type: type
      });
    });

    const statsArray: ConnectionStat[] = Array.from(aggMap.entries()).map(([key, data]) => {
      const alias = ipAliases.find(a => a.ip === data.ip);
      return {
        key: key,
        name: alias ? alias.name : 'Desconocido',
        isKnown: !!alias,
        count: data.count,
        lastSeen: data.lastDate,
        ip: data.ip,
        isp: data.isp,
        type: data.type
      };
    }).sort((a, b) => b.count - a.count); 

    setConnectionStats(statsArray);
  };

  useEffect(() => {
    loadStats();
  }, [ipAliases]); 

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

  const formatISP = (org?: string) => {
    if (!org) return '';
    return org.replace(/^AS\d+\s+/, ''); 
  };

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
    else if (/iPhone|iPad/i.test(ua)) os = 'iOS';
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

  // --- HANDLE CLEAR HISTORY ---
  const handleClearClick = async () => {
    if (!onClearHistory) return;
    
    if (window.confirm("¿ESTÁS SEGURO? \n\nEsta acción eliminará PERMANENTEMENTE todo el registro de visitas, estadísticas y dispositivos únicos. \n\nNo se puede deshacer.")) {
        setIsClearing(true);
        try {
            await onClearHistory();
            // Refresh stats to show zero
            await loadStats();
            alert("Historial eliminado correctamente.");
        } catch (error) {
            console.error(error);
            alert("Hubo un error al intentar borrar el historial.");
        } finally {
            setIsClearing(false);
        }
    }
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
              <button onClick={() => setShowAliasHelp(!showAliasHelp)} className="text-gray-300 hover:text-white">
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            
            {showAliasHelp && (
              <div className="bg-gray-700 p-3 text-xs text-gray-200 border-b border-gray-600 relative">
                <button onClick={() => setShowAliasHelp(false)} className="absolute top-1 right-1 text-gray-400 hover:text-white"><X className="w-3 h-3"/></button>
                <p>Asigna nombres amigables a las IPs recurrentes para identificarlas fácil en los reportes (ej: "Oficina Central", "Taller", "Casa Diego").</p>
              </div>
            )}

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

        {/* ACCESS LOGS TABLE (Hidden by default) */}
        <div className="lg:col-span-2">
            <button 
              onClick={() => setShowActivityLog(!showActivityLog)}
              className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm mb-2"
            >
               <span className="font-bold text-gray-800 flex items-center">
                 <List className="w-5 h-5 mr-2 text-brand-600" />
                 Log de Actividad Detallado (Últimos 50)
               </span>
               {showActivityLog ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {showActivityLog && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-fade-in">
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-100 text-gray-500 font-semibold uppercase">
                    <tr>
                        <th className="px-4 py-3 text-left tracking-wider">Fecha / Hora</th>
                        <th className="px-4 py-3 text-left tracking-wider">Usuario / Dispositivo</th>
                        <th className="px-4 py-3 text-left tracking-wider">Detalles Técnicos</th>
                        <th className="px-4 py-3 text-left tracking-wider">Recorrido</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {recentVisitsLog.map((visit) => {
                        const ipInfo = getIpLabel(visit.ip);
                        return (
                        <tr key={visit.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-gray-600 font-medium">
                              {new Date(visit.timestamp).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                              <div className="flex items-center mb-1">
                                {getDeviceIcon(visit.deviceInfo)}
                                <span className="font-bold">{getDeviceName(visit.deviceInfo)}</span>
                              </div>
                              <div className="font-mono text-[10px] text-gray-500">
                                {visit.deviceId && (
                                  <span className="block mb-1 text-gray-400" title={`ID Persistente: ${visit.deviceId}`}>
                                    ID: {visit.deviceId.substring(0, 8)}...
                                  </span>
                                )}
                                {ipInfo.isAlias ? (
                                    <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold mr-1">{ipInfo.label}</span>
                                ) : (
                                    <span className="mr-1">{ipInfo.label}</span>
                                )}
                                {visit.isp && <span className="text-gray-400 italic block">{formatISP(visit.isp)}</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {visit.screenResolution && (
                                <div className="flex items-center mb-1" title="Resolución de pantalla">
                                  <Maximize className="w-3 h-3 mr-1" /> {visit.screenResolution}
                                </div>
                              )}
                              {visit.language && (
                                <div className="flex items-center" title="Idioma del navegador">
                                  <Languages className="w-3 h-3 mr-1" /> {visit.language}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {visit.sectionsVisited && visit.sectionsVisited.length > 0 ? (
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {visit.sectionsVisited.map((sec, i) => (
                                      <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] text-gray-600">
                                        {sec}
                                      </span>
                                    ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">-</span>
                              )}
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
                </div>
              </div>
            )}
        </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
            <span className="flex items-center"><Database className="w-5 h-5 mr-2" /> Gestión de Datos y Copias de Seguridad</span>
            <button onClick={() => setShowBackupHelp(!showBackupHelp)} className="text-gray-400 hover:text-brand-600"><HelpCircle className="w-5 h-5"/></button>
        </h3>
        
        {showBackupHelp && (
          <div className="mb-4 bg-white border border-gray-200 rounded p-4 text-sm text-gray-600 animate-fade-in relative">
             <button onClick={() => setShowBackupHelp(false)} className="absolute top-2 right-2 text-gray-300 hover:text-gray-500"><X className="w-4 h-4"/></button>
             <p className="mb-2"><strong className="text-gray-800">¿Por qué descargar copias?</strong> Esta aplicación guarda datos en la nube (si hay internet) o en tu navegador localmente. Descargar el archivo JSON asegura que no pierdas manuales, noticias ni configuraciones si se borra el historial o cambia la base de datos.</p>
             <p><strong>Restaurar:</strong> Usa el botón "Restaurar desde Archivo" para cargar una copia previa y recuperar toda la información.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap">
            <button 
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 flex-1 min-w-[200px]"
            >
            {isExporting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Download className="w-5 h-5 mr-2 text-brand-600" />}
            {isExporting ? 'Generando...' : 'Descargar Copia de Seguridad'}
            </button>
            
            <div className="relative flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500 cursor-pointer flex-1 min-w-[200px]">
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

            {/* Clear History Button */}
            <button 
              onClick={handleClearClick}
              disabled={isClearing}
              className="flex items-center justify-center px-4 py-3 bg-red-50 border border-red-200 rounded-md shadow-sm text-sm font-bold text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex-1 min-w-[200px]"
            >
              {isClearing ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Trash2 className="w-5 h-5 mr-2" />}
              {isClearing ? 'Borrando...' : 'Borrar Historial de Visitas'}
            </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
            * Se recomienda realizar una copia semanal o mensual. El borrado de historial es irreversible.
        </p>
        </div>

        {/* IP RANKING TABLE (Hidden by default, at the bottom) */}
        <div className="mt-12 pt-8 border-t border-gray-200">
            <button 
              onClick={() => setShowIpRanking(!showIpRanking)}
              className="flex items-center justify-center w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-lg transition-colors mb-4"
            >
               {showIpRanking ? <ChevronUp className="w-5 h-5 mr-2" /> : <ChevronDown className="w-5 h-5 mr-2" />}
               {showIpRanking ? 'Ocultar Ranking de Conexiones' : 'Ver Ranking de Conexiones por Dispositivo'}
            </button>

            {showIpRanking && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-fade-in">
                <div className="bg-brand-900 text-white px-6 py-4 flex justify-between items-center border-b border-brand-800">
                    <h3 className="font-bold flex items-center">
                    <Fingerprint className="w-5 h-5 mr-2 text-gold-400" />
                    Dispositivos Únicos
                    </h3>
                    <span className="text-xs bg-brand-800 px-3 py-1 rounded-full text-brand-200">
                    {connectionStats.length} identificados
                    </span>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Identificación</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID Dispositivo / IP</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Visitas Totales</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Última Vez</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {connectionStats.map((stat, index) => (
                        <tr key={stat.key} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                                {index < 3 && (
                                <span className={`mr-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white ${
                                    index === 0 ? 'bg-gold-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                                }`}>
                                    {index + 1}
                                </span>
                                )}
                                {stat.isKnown ? (
                                <span className="flex items-center text-brand-700 font-bold">
                                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-500" />
                                    {stat.name}
                                </span>
                                ) : (
                                <span className="flex items-center text-gray-500 italic">
                                    <AlertCircle className="w-4 h-4 mr-1.5 text-gray-300" />
                                    Desconocido
                                </span>
                                )}
                            </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex flex-col">
                                {stat.type === 'device' && (
                                  <div className="flex items-center text-xs text-brand-600 font-mono font-bold mb-1" title={stat.key}>
                                    <Fingerprint className="w-3 h-3 mr-1" />
                                    {stat.key.substring(0, 10)}...
                                  </div>
                                )}
                                <div className="text-gray-500 font-mono text-[10px]">{stat.ip}</div>
                                {stat.isp && (
                                    <div className="text-[10px] text-gray-400 font-bold truncate max-w-[200px]">
                                    {formatISP(stat.isp)}
                                    </div>
                                )}
                            </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-center">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                stat.count > 50 ? 'bg-purple-100 text-purple-800' :
                                stat.count > 20 ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {stat.count}
                            </span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-right text-gray-500 text-xs">
                            {new Date(stat.lastSeen).toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            )}
        </div>
    </div>
  );
};
