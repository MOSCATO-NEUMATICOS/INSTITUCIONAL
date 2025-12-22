
import React, { useState, useEffect, useMemo } from 'react';
import { IpAlias, DeviceAlias, VisitRecord, Manual, ManualCategory, NewsItem } from '../../types';
import { storageService } from '../../services/storage';
import { Globe, Calendar, BarChart2, Network, Trash2, Database, Loader2, Download, RefreshCw, Smartphone, Monitor, CheckCircle2, AlertCircle, Maximize, ChevronDown, ChevronUp, Shield, List, Fingerprint, Clock, Activity, MapPin, Search, Copy, UserCheck, BookPlus, Sparkles } from 'lucide-react';

interface AdminSystemProps {
  ipAliases: IpAlias[];
  deviceAliases: DeviceAlias[];
  onAddIpAlias: (alias: IpAlias) => void;
  onDeleteIpAlias: (id: string) => void;
  onAddDeviceAlias: (alias: DeviceAlias) => void;
  onDeleteDeviceAlias: (id: string) => void;
  onImportData: (data: any) => void;
  onClearHistory?: () => void;
  fullDataExport: any; 
  onAddManual: (manual: Manual) => Promise<void>;
  onAddNews: (news: NewsItem) => Promise<void>;
}

export const AdminSystem: React.FC<AdminSystemProps> = ({ 
  ipAliases = [], deviceAliases = [], onAddIpAlias, onDeleteIpAlias, onAddDeviceAlias, onDeleteDeviceAlias, onImportData, onClearHistory, fullDataExport, onAddManual, onAddNews 
}) => {
  const [visitStats, setVisitStats] = useState({ total: 0, today: 0, previousVisit: '-' });
  const [recentVisitsLog, setRecentVisitsLog] = useState<VisitRecord[]>([]);
  const [newIpAlias, setNewIpAlias] = useState({ ip: '', name: '' });
  const [newDeviceAlias, setNewDeviceAlias] = useState({ deviceId: '', name: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [currentSession, setCurrentSession] = useState({
    deviceId: '',
    ip: 'Cargando...',
    userAgent: navigator.userAgent
  });

  const [showRanking, setShowRanking] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const myId = storageService.getOrCreateDeviceId();
      let myIp = 'Desconocida';
      try {
        const resp = await fetch('https://ipinfo.io/json');
        if (resp.ok) {
          const data = await resp.json();
          myIp = data.ip;
        }
      } catch(e) {}
      setCurrentSession(prev => ({ ...prev, deviceId: myId, ip: myIp }));

      const visits = await storageService.getVisits();
      const todayStr = new Date().toLocaleDateString('es-AR');
      const todayCount = visits.filter(v => v.dateString === todayStr).length;
      let prevVisit = '-';
      if (visits.length > 1) {
        prevVisit = new Date(visits[0].timestamp).toLocaleString('es-AR', { 
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
      }
      setVisitStats({ total: visits.length, today: todayCount, previousVisit: prevVisit });
      setRecentVisitsLog(visits);
    };
    loadStats();
  }, [ipAliases, deviceAliases]);

  const ranking = useMemo(() => {
    const aggMap = new Map<string, { count: number, lastDate: number, ip: string, deviceId: string, type: string }>();
    recentVisitsLog.forEach(v => {
      const key = v.deviceId || v.ip || 'desconocido';
      const current = aggMap.get(key) || { count: 0, lastDate: 0, ip: v.ip || '', deviceId: v.deviceId || '', type: v.deviceInfo || '' };
      aggMap.set(key, { ...current, count: current.count + 1, lastDate: Math.max(current.lastDate, v.timestamp) });
    });
    return Array.from(aggMap.values()).sort((a, b) => b.count - a.count).slice(0, 15);
  }, [recentVisitsLog]);

  const getAliasName = (ip?: string, deviceId?: string) => {
    const dAlias = deviceAliases.find(a => a.deviceId === deviceId);
    if (dAlias) return { name: dAlias.name, type: 'device' as const };
    const iAlias = ipAliases.find(a => a.ip === ip);
    if (iAlias) return { name: iAlias.name, type: 'ip' as const };
    return null;
  };

  const getDeviceIcon = (ua: string = '') => {
    if (/Mobile|Android|iPhone/i.test(ua)) return <Smartphone className="w-4 h-4 text-brand-500" />;
    return <Monitor className="w-4 h-4 text-gray-500" />;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado: ' + text);
  };

  const preFillMyDevice = () => {
    setNewDeviceAlias(prev => ({ ...prev, deviceId: currentSession.deviceId }));
    document.getElementById('alias-name-input')?.focus();
  };

  const handleFullSeeding = async () => {
    if (!confirm("Esta acción cargará todos los manuales institucionales (Balanceo, Neumáticos, Garantías, etc.) y las novedades base en Firebase. ¿Desea continuar?")) return;
    
    setIsSeeding(true);
    const date = new Date().toLocaleDateString('es-AR');

    const manualsToLoad: Omit<Manual, 'id'>[] = [
      {
        title: "Balanceo de Ruedas",
        category: ManualCategory.TALLER,
        description: "Procedimiento estándar para garantizar un rodado seguro, sin vibraciones y con durabilidad.",
        lastUpdated: date,
        textContent: "1. OBJETIVO: Estandarizar el procedimiento de balanceo.\n\n3. HERRAMIENTAS: Balanceadora, Plomos, Pinza, Inflador, Trapo y Alcohol, EPP.\n\n4. PASOS:\n- Retirar rueda.\n- Verificar presión y ajustar.\n- Centrar en balanceadora.\n- Ingresar medidas (Ancho, Diámetro, Distancia).\n- Girar y esperar lectura.\n- Colocar plomos (Limpiar si son adhesivos).\n- Repetir hasta marcar 0-0.\n- Montar y ajustar en cruz (DI, DD, TD, TI)."
      },
      {
        title: "Cambio de Neumáticos",
        category: ManualCategory.TALLER,
        description: "Protocolo de seguridad y rapidez para el servicio de gomería.",
        lastUpdated: date,
        textContent: "1. OBJETIVO: Asegurar seguridad y calidad.\n\n4. PASOS:\n- Aflojar tuercas en el piso.\n- Elevar vehículo de forma segura.\n- Desarmar con desarmadora.\n- Revisar llanta y válvula.\n- Montar nuevo/reparado.\n- Balancear si es nuevo.\n- Inflar a presión recomendada.\n- Ajustar en cruz y dar torque final con vehículo en piso."
      },
      {
        title: "Cambio de Válvulas TPMS",
        category: ManualCategory.TALLER,
        description: "Procedimiento específico para sensores de presión en Chevrolet y Ford.",
        lastUpdated: date,
        textContent: "CHEVROLET:\n- Auto en marcha, P o N, freno de mano.\n- Mantener OK 10 seg hasta bocinas.\n- Sensar en orden: DI, DD, TD, TI.\n- Bocina confirma cada sensor. 2 bocinas al final.\n\nFORD:\n- P o N, freno de mano.\n- Pisar/soltar freno.\n- Contacto 3 veces (terminar en ON).\n- Pisar/soltar freno.\n- Contacto 3 veces.\n- Bocina indica inicio.\n- Sensar con aparato TPMS en el pico."
      },
      {
        title: "Reparación de Ruedas (Pinchaduras)",
        category: ManualCategory.TALLER,
        description: "Estándar de reparación para neumáticos sin cámara.",
        lastUpdated: date,
        textContent: "1. OBJETIVO: Garantizar seguridad y durabilidad.\n\n4. PASOS:\n- Retirar rueda.\n- Inflar y revisar en agua.\n- Marcar pérdida y posición del pico.\n- Desarmar e inspeccionar interior.\n- Pulir superficie interior con torno.\n- Aplicar cemento en frío (esperar 2-3 min).\n- Colocar parche según daño y vulcanizar con rodillo.\n- Confirmar ausencia de pérdidas en agua final."
      },
      {
        title: "Políticas de Garantía",
        category: ManualCategory.ADMINISTRACION,
        description: "Plazos y alcances de la garantía de servicios y productos.",
        lastUpdated: date,
        textContent: "ALCANCE: Solo trabajos realizados en Moscato con piezas nuestras.\n\nPLAZOS:\n- Neumáticos: Garantía de fábrica.\n- Balanceo/Alineación: 30 días o 1.000 km.\n- Tren Delantero: 3 meses o 5.000 km.\n- Reparaciones: 15 días sobre el parche.\n\nRECLAMOS: Presentar factura, revisión exclusiva en nuestro taller."
      },
      {
        title: "Guía de Trabajo - Atención y Orden",
        category: ManualCategory.ADMINISTRACION,
        description: "Manual de convivencia, atención al cliente y limpieza de la sucursal.",
        lastUpdated: date,
        textContent: "1. ATENCIÓN: Saludar con buena onda, escuchar al cliente, explicar sin jergas.\n\n2. TALLER: Revisar antes de intervenir, anotar observaciones, cuidar herramientas.\n\n3. ADM: Registrar todo en sistema, emitir facturas correctas.\n\n4. ORDEN: Puesto limpio al terminar, herramientas acomodadas, oficinas impecables.\n\n5. RESOLUCIÓN: Escuchar antes de discutir, nunca prometer lo imposible."
      },
      {
        title: "Carga de Clientes WhatsApp",
        category: ManualCategory.VENTAS,
        description: "Normas para el registro de contactos en listas de difusión.",
        lastUpdated: date,
        textContent: "REGLA: Nombre + Código (MMM YY).\nEjemplo: Juan Pérez ENE25.\n\nPROCESO:\n- Cargar contacto nuevo con mes actual.\n- No modificar código al volver.\n- SIEMPRE en mayúsculas y al final del nombre.\n- Sirve para segmentación y conteo mensual."
      },
      {
        title: "Alineación 3D",
        category: ManualCategory.TALLER,
        description: "Protocolo técnico desde el ingreso hasta el informe impreso.",
        lastUpdated: date,
        textContent: "1. PREPARACIÓN: Revisar neumáticos (serrucho, cortes). Si hay falla mecánica, avisar a administración.\n2. SENSORES: Instalar garras y targets.\n3. ALABEO: Compensación según máquina.\n4. MEDICIÓN: Convergencia, Caída, Avance.\n5. AJUSTES: Aplicar torque correcto en fijaciones.\n6. CONTROL: Volante centrado, informe impreso en asiento, sticker de km pegado."
      }
    ];

    try {
      for (const m of manualsToLoad) {
        await onAddManual({ id: '', ...m } as Manual);
      }
      
      await onAddNews({
        id: '',
        title: "¡Base de Conocimiento Actualizada!",
        category: "Administración",
        date: date,
        timestamp: Date.now(),
        description: "Se han cargado todos los manuales de procedimiento, políticas de garantía y guías de atención. Ya están disponibles en la sección 'Manuales'.",
        highlight: true,
        highlightDuration: 15,
        autoDelete: false
      });

      alert("¡ÉXITO! Se han cargado " + manualsToLoad.length + " manuales y la novedad de bienvenida en Firebase. El sistema se reiniciará para sincronizar.");
      window.location.reload();
    } catch (e) {
      alert("Error durante la carga: " + (e as Error).message);
    } finally {
      setIsSeeding(false);
    }
  };

  /**
   * Helper to clean data of circular references and non-serializable Firebase objects
   */
  const sanitizeForExport = (obj: any): any => {
    const cache = new WeakSet();
    
    const recursiveSanitize = (val: any): any => {
      if (val === null || typeof val !== 'object') return val;
      if (val instanceof Date) return val.toISOString();
      
      // Handle Firestore Timestamps (common cause of Q$1 error)
      if (val.seconds !== undefined && val.nanoseconds !== undefined) {
        return new Date(val.seconds * 1000).toISOString();
      }

      if (cache.has(val)) return '[Circular Reference]';
      cache.add(val);

      if (Array.isArray(val)) {
        return val.map(recursiveSanitize);
      }

      const cleanObj: any = {};
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key)) {
          const property = val[key];
          // Skip internal firebase/react fields or functions
          if (typeof property === 'function' || key.startsWith('_')) continue;
          cleanObj[key] = recursiveSanitize(property);
        }
      }
      return cleanObj;
    };

    return recursiveSanitize(obj);
  };

  const handleExportData = () => {
    setIsExporting(true);
    try {
      // Step 1: Sanitize data to remove non-JSON objects and circularities
      const sanitizedData = sanitizeForExport(fullDataExport);
      
      const dataStr = JSON.stringify(sanitizedData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const exportFileDefaultName = `moscato_backup_${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.download = exportFileDefaultName;
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      alert("Error al exportar datos: Se detectó un objeto no serializable en la base de datos.");
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
        const data = JSON.parse(event.target?.result as string);
        if (window.confirm('¿Está seguro de restaurar este backup? Los datos actuales serán importados.')) {
          onImportData(data);
        }
      } catch (error) {
        alert("Error al procesar el archivo de backup.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* TARJETA: TU ACCESO ACTUAL */}
        <div className="bg-gradient-to-r from-brand-900 to-blue-900 text-white rounded-2xl p-6 shadow-xl border-b-4 border-gold-400 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <UserCheck className="w-24 h-24" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-gold-400" />
                    <h3 className="font-bold text-lg">Tu Información de Sesión Actual</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-brand-300 mb-1">ID Unico de este dispositivo</p>
                        <div className="flex items-center gap-2">
                            <code className="bg-black/30 px-3 py-1.5 rounded font-mono text-sm border border-white/10 break-all">
                                {currentSession.deviceId}
                            </code>
                            <button onClick={() => copyToClipboard(currentSession.deviceId)} className="p-2 hover:bg-white/10 rounded transition-colors" title="Copiar ID">
                                <Copy className="w-4 h-4 text-gold-400" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-brand-300 mb-1">Tu Dirección IP Detectada</p>
                        <div className="flex items-center gap-2">
                            <code className="bg-black/30 px-3 py-1.5 rounded font-mono text-sm border border-white/10">
                                {currentSession.ip}
                            </code>
                            <button onClick={() => copyToClipboard(currentSession.ip)} className="p-2 hover:bg-white/10 rounded transition-colors" title="Copiar IP">
                                <Copy className="w-4 h-4 text-gold-400" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={preFillMyDevice}
                            className="bg-gold-400 hover:bg-gold-300 text-brand-900 font-black px-6 py-2 rounded-xl text-sm transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <Fingerprint className="w-4 h-4" />
                            ASOCIAR MI DISPOSITIVO
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Resumen de Analíticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4 text-blue-600 dark:text-blue-400"><Activity className="w-8 h-8" /></div>
            <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Sesiones Totales</p><p className="text-3xl font-black text-gray-900 dark:text-white">{visitStats.total}</p></div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl mr-4 text-green-600 dark:text-green-400"><Calendar className="w-8 h-8" /></div>
            <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Visitas Hoy</p><p className="text-3xl font-black text-gray-900 dark:text-white">{visitStats.today}</p></div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl mr-4 text-purple-600 dark:text-purple-400"><Clock className="w-8 h-8" /></div>
            <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Último Acceso</p><p className="text-lg font-bold text-gray-900 dark:text-white">{visitStats.previousVisit}</p></div>
          </div>
        </div>

        {/* Gestión de Identificación y Alias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-800 dark:bg-gray-900 text-white px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Fingerprint className="w-5 h-5 mr-2 text-gold-400" />
                        <h4 className="font-bold">Alias de Dispositivos</h4>
                    </div>
                </div>
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <form onSubmit={(e) => { e.preventDefault(); if(newDeviceAlias.deviceId && newDeviceAlias.name) { onAddDeviceAlias({ id: Date.now().toString(), ...newDeviceAlias }); setNewDeviceAlias({ deviceId: '', name: '' }); }}} className="flex flex-col gap-3">
                    <input type="text" placeholder="ID de Dispositivo (ej: dev-123...)" className="w-full p-2.5 text-xs border rounded bg-white dark:bg-gray-700 dark:text-white font-mono" value={newDeviceAlias.deviceId} onChange={e => setNewDeviceAlias({...newDeviceAlias, deviceId: e.target.value})} />
                    <div className="flex gap-2">
                        <input id="alias-name-input" type="text" placeholder="Nombre (ej: PC Marcos)" className="flex-1 p-2.5 text-xs border rounded bg-white dark:bg-gray-700 dark:text-white" value={newDeviceAlias.name} onChange={e => setNewDeviceAlias({...newDeviceAlias, name: e.target.value})} />
                        <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-4 rounded-lg font-bold text-xs transition-colors">Vincular</button>
                    </div>
                  </form>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {deviceAliases.length > 0 ? deviceAliases.map(a => (
                    <div key={a.id} className="p-3 border-b dark:border-gray-700 flex justify-between items-center text-xs hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div>
                        <span className="font-bold text-brand-600 dark:text-brand-400 block">{a.name}</span>
                        <span className="text-gray-400 font-mono text-[10px] break-all">{a.deviceId}</span>
                      </div>
                      <button onClick={() => onDeleteDeviceAlias(a.id)} className="text-gray-300 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )) : (
                      <p className="p-4 text-center text-gray-400 text-xs">No hay alias de dispositivos registrados.</p>
                  )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-800 dark:bg-gray-900 text-white px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-gold-400" />
                        <h4 className="font-bold">Alias de IPs</h4>
                    </div>
                </div>
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <form onSubmit={(e) => { e.preventDefault(); if(newIpAlias.ip && newIpAlias.name) { onAddIpAlias({ id: Date.now().toString(), ...newIpAlias }); setNewIpAlias({ ip: '', name: '' }); }}} className="flex flex-col gap-3">
                    <input type="text" placeholder="Dirección IP (ej: 181.10...)" className="w-full p-2.5 text-xs border rounded bg-white dark:bg-gray-700 dark:text-white font-mono" value={newIpAlias.ip} onChange={e => setNewIpAlias({...newIpAlias, ip: e.target.value})} />
                    <div className="flex gap-2">
                        <input type="text" placeholder="Nombre (ej: Oficina Central)" className="flex-1 p-2.5 text-xs border rounded bg-white dark:bg-gray-700 dark:text-white" value={newIpAlias.name} onChange={e => setNewIpAlias({...newIpAlias, name: e.target.value})} />
                        <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-4 rounded-lg font-bold text-xs transition-colors">Vincular</button>
                    </div>
                  </form>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {ipAliases.length > 0 ? ipAliases.map(a => (
                    <div key={a.id} className="p-3 border-b dark:border-gray-700 flex justify-between items-center text-xs hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div>
                        <span className="font-bold text-green-600 block">{a.name}</span>
                        <span className="text-gray-400 font-mono text-[10px]">{a.ip}</span>
                      </div>
                      <button onClick={() => onDeleteIpAlias(a.id)} className="text-gray-300 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )) : (
                      <p className="p-4 text-center text-gray-400 text-xs">No hay alias de IP registrados.</p>
                  )}
                </div>
            </div>
        </div>

        {/* Ranking Desplegable */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-md">
            <button 
                onClick={() => setShowRanking(!showRanking)}
                className="w-full flex justify-between items-center px-6 py-4 bg-brand-900 text-white hover:bg-brand-800 transition-colors"
            >
                <div className="flex items-center">
                    <BarChart2 className="w-5 h-5 mr-2 text-gold-400" />
                    <h3 className="font-bold">Ranking de Conexiones Frecuentes</h3>
                </div>
                {showRanking ? <ChevronUp className="text-gold-400" /> : <ChevronDown className="text-gold-400" />}
            </button>
            
            {showRanking && (
                <div className="animate-fade-in overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold uppercase text-[10px]">
                            <tr>
                                <th className="px-6 py-3 text-left">Dispositivo / Identidad</th>
                                <th className="px-6 py-3 text-left">ID Técnico</th>
                                <th className="px-6 py-3 text-center">Accesos</th>
                                <th className="px-6 py-3 text-right">Última Actividad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {ranking.map((r, i) => {
                              const alias = getAliasName(r.ip, r.deviceId);
                              const isMe = r.deviceId === currentSession.deviceId;
                              return (
                                <tr key={i} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isMe ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center">
                                      <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">{getDeviceIcon(r.type)}</div>
                                      <div>
                                        <p className={`font-bold ${alias ? 'text-brand-600 dark:text-brand-400' : 'text-gray-900 dark:text-white'}`}>
                                          {alias?.name || 'Dispositivo Desconocido'}
                                          {isMe && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black">TÚ</span>}
                                        </p>
                                        <span className="text-[9px] uppercase font-bold text-gray-400">
                                            {alias ? `Alias ${alias.type}` : 'Sin identificar'}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <code className="text-[10px] text-gray-500 bg-gray-50 dark:bg-gray-900 px-1.5 py-0.5 rounded w-fit border dark:border-gray-700 mb-1" title="Device ID">
                                            ID: {r.deviceId || 'N/A'}
                                        </code>
                                        <code className="text-[10px] text-brand-600/70 font-bold" title="IP Address">
                                            IP: {r.ip}
                                        </code>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className={`inline-block w-10 py-1 rounded-full font-black text-xs ${r.count > 20 ? 'bg-brand-600 text-white' : 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'}`}>
                                      {r.count}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right text-xs text-gray-500 font-medium">
                                    {new Date(r.lastDate).toLocaleDateString('es-AR', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* Log de Actividad Detallado */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-md">
            <button onClick={() => setShowActivityLog(!showActivityLog)} className="w-full flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b dark:border-gray-700">
               <span className="font-bold flex items-center text-gray-800 dark:text-white">
                   <List className="w-5 h-5 mr-2 text-brand-600" />
                   Historial de Actividad Detallado
               </span>
               {showActivityLog ? <ChevronUp /> : <ChevronDown />}
            </button>
            {showActivityLog && (
                <div className="overflow-x-auto max-h-[600px] animate-fade-in">
                <table className="w-full text-[11px]">
                    <thead className="bg-gray-100 dark:bg-gray-950 text-gray-500 font-bold sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-3 text-left">Fecha/Hora</th>
                            <th className="px-4 py-3 text-left">Identidad / Dispositivo</th>
                            <th className="px-4 py-3 text-left">Datos de Conexión</th>
                            <th className="px-4 py-3 text-left">Recorrido</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {recentVisitsLog.map((v) => {
                        const alias = getAliasName(v.ip, v.deviceId);
                        const isMe = v.deviceId === currentSession.deviceId;
                        return (
                          <tr key={v.id} className={`hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors ${isMe ? 'bg-blue-50/20 dark:bg-blue-900/5' : ''}`}>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap font-medium">
                              {new Date(v.timestamp).toLocaleString('es-AR', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center mb-1">
                                {getDeviceIcon(v.deviceInfo)}
                                <span className={`ml-2 font-bold ${alias ? 'text-brand-600 dark:text-brand-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                  {alias?.name || 'Desconocido'}
                                </span>
                                {isMe && <span className="ml-2 text-[8px] bg-blue-100 text-blue-600 px-1 py-0.5 rounded font-black uppercase">Tú</span>}
                                {alias && !isMe && (
                                    <CheckCircle2 className="w-3 h-3 ml-1 text-blue-500" />
                                )}
                              </div>
                              <div className="text-[9px] text-gray-400 flex flex-col gap-0.5">
                                <span className="font-mono bg-gray-50 dark:bg-gray-700 px-1 rounded border dark:border-gray-600 w-fit">ID: {v.deviceId}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-mono font-bold text-brand-700 dark:text-brand-300">{v.ip}</div>
                              <div className="text-[10px] text-gray-400 italic max-w-[150px] truncate" title={v.isp}>{v.isp}</div>
                              <div className="flex gap-2 mt-1 opacity-60">
                                <span className="flex items-center"><Maximize className="w-2.5 h-2.5 mr-1" />{v.screenResolution}</span>
                                <span className="flex items-center"><Globe className="w-2.5 h-2.5 mr-1" />{v.timezone}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {v.sectionsVisited?.map((s, i) => (
                                    <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-[4px] text-[9px] font-bold text-gray-600 dark:text-gray-300 border dark:border-gray-600">
                                        {s}
                                    </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                    })}
                    </tbody>
                </table>
                </div>
            )}
        </div>

        {/* Gestión de Datos y Backups */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                <span className="flex items-center"><Database className="w-5 h-5 mr-2 text-brand-600" /> Administración del Sistema</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={handleFullSeeding} 
                  disabled={isSeeding} 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-md group relative overflow-hidden"
                >
                    {isSeeding ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 group-hover:scale-120 transition-transform" />}
                    CARGAR BASE CONOCIMIENTO
                </button>
                <button onClick={handleExportData} disabled={isExporting} className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm">
                    {isExporting ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5 text-brand-600" />}
                    Exportar Backup
                </button>
                <div className="relative flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-bold shadow-sm">
                    <label htmlFor="import-file" className="cursor-pointer flex items-center gap-2 w-full justify-center">
                        <RefreshCw className="w-5 h-5 text-green-600" />
                        <span>Restaurar Backup</span>
                        <input id="import-file" type="file" accept=".json" className="sr-only" onChange={handleImportFile} />
                    </label>
                </div>
                <button onClick={() => onClearHistory?.()} className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">
                    <Trash2 className="w-5 h-5" /> Borrar Logs Visitas
                </button>
            </div>
        </div>
    </div>
  );
};
