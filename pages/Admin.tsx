
import React, { useState, useEffect } from 'react';
import { Manual, NewsItem, FeedbackItem, IpAlias, Supplier, DeviceAlias } from '../types';
import { LogIn, Lock, XCircle, LogOut, ShieldAlert, Type, Clock, AlertTriangle } from 'lucide-react';
import { AdminManuals } from '../components/admin/AdminManuals';
import { AdminNews } from '../components/admin/AdminNews';
import { AdminCourses } from '../components/admin/AdminCourses';
import { AdminFeedback } from '../components/admin/AdminFeedback';
import { AdminSuppliers } from '../components/admin/AdminSuppliers';
import { AdminSystem } from '../components/admin/AdminSystem';
import { SectionHero } from '../components/SectionHero';
import { storageService } from '../services/storage';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 30;

export const Admin: React.FC<AdminProps> = ({ 
  manuals, news, feedbackItems = [], ipAliases = [], deviceAliases = [], suppliers = [],
  onAddManual, onDeleteManual, onAddNews, onUpdateNews, onDeleteNews, onUpdateFeedback,
  onDeleteFeedback, onAddIpAlias, onDeleteIpAlias, onAddDeviceAlias, onDeleteDeviceAlias,
  onAddSupplier, onUpdateSupplier, onDeleteSupplier, onImportData
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [activeTab, setActiveTab] = useState<'manuals' | 'news' | 'messages' | 'courses' | 'suppliers' | 'system'>('manuals');
  
  const [attempts, setAttempts] = useState(() => Number(localStorage.getItem('admin_attempts')) || 0);
  const [lockoutTime, setLockoutTime] = useState(() => Number(localStorage.getItem('admin_lockout')) || 0);
  const [remainingTime, setRemainingTime] = useState<string>('');

  const handleClearHistory = async () => {
    if (window.confirm('¿Está seguro de eliminar todo el historial de visitas? Esta acción no se puede deshacer.')) {
      await storageService.clearVisits();
      window.location.reload(); 
    }
  };

  useEffect(() => {
    const checkLockout = () => {
      const now = Date.now();
      if (lockoutTime > now) {
        const diff = lockoutTime - now;
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setRemainingTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      } else if (lockoutTime > 0) {
        setLockoutTime(0);
        setAttempts(0);
        localStorage.removeItem('admin_lockout');
        localStorage.removeItem('admin_attempts');
      }
    };

    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) setIsCapsLockOn(true);
    else setIsCapsLockOn(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > Date.now()) return;

    if (password === 'moscato2024') {
      setIsAuthenticated(true);
      setAttempts(0);
      localStorage.removeItem('admin_attempts');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('admin_attempts', String(newAttempts));

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + (LOCKOUT_MINUTES * 60000);
        setLockoutTime(until);
        localStorage.setItem('admin_lockout', String(until));
        setLoginError(`Acceso bloqueado por ${LOCKOUT_MINUTES} minutos.`);
      } else {
        setLoginError(`Contraseña incorrecta. Intentos restantes: ${MAX_ATTEMPTS - newAttempts}`);
      }
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    const isLocked = lockoutTime > Date.now();
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-brand-200 dark:border-gray-700 max-w-md w-full transition-all relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="bg-brand-100 dark:bg-brand-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white">Panel de Control</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Uso restringido para administradores</p>
          </div>

          {isLocked ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-xl text-center animate-pulse">
              <Clock className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
              <h3 className="font-bold text-red-800 dark:text-red-200 uppercase tracking-wider">Acceso Bloqueado</h3>
              <div className="text-4xl font-mono font-bold text-red-600 dark:text-red-400 my-2">{remainingTime}</div>
              <p className="text-xs text-red-700 dark:text-red-300">Demasiados intentos fallidos. Por seguridad espere el tiempo indicado.</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm font-medium flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 shrink-0" /> {loginError}
                </div>
              )}
              
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña de Super Usuario"
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
                {isCapsLockOn && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-orange-500 pointer-events-none" title="Mayúsculas activas">
                    <Type className="w-5 h-5 mr-1" />
                    <span className="text-[10px] font-bold uppercase">Mayús</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center group"
              >
                <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Ingresar al Sistema
              </button>
              
              <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
                Límite de seguridad: {MAX_ATTEMPTS} intentos permitidos.
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative animate-fade-in">
      <SectionHero
        title="Panel de Administración"
        subtitle="Gestión centralizada de contenidos, manuales, novedades y usuarios del sistema."
        badgeText="Super Usuario"
        badgeIcon={ShieldAlert}
      >
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors border border-red-500 shadow-lg"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar Sesión
        </button>
      </SectionHero>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[600px] transition-colors">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto bg-gray-50 dark:bg-gray-900/50">
          {['manuals', 'news', 'courses', 'messages', 'suppliers', 'system'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab === 'manuals' && 'Manuales'}
              {tab === 'news' && 'Novedades'}
              {tab === 'courses' && 'Capacitación'}
              {tab === 'messages' && 'Buzón'}
              {tab === 'suppliers' && 'Proveedores'}
              {tab === 'system' && 'Sistema'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'manuals' && <AdminManuals manuals={manuals} onAddManual={onAddManual} onDeleteManual={onDeleteManual} />}
          {activeTab === 'news' && <AdminNews news={news} onAddNews={onAddNews} onUpdateNews={onUpdateNews} onDeleteNews={onDeleteNews} />}
          {activeTab === 'courses' && <AdminCourses />}
          {activeTab === 'messages' && <AdminFeedback feedbackItems={feedbackItems} onUpdateFeedback={onUpdateFeedback} onDeleteFeedback={onDeleteFeedback} />}
          {activeTab === 'suppliers' && <AdminSuppliers suppliers={suppliers} onAddSupplier={onAddSupplier} onUpdateSupplier={onUpdateSupplier} onDeleteSupplier={onDeleteSupplier} />}
          {activeTab === 'system' && (
            <AdminSystem 
              ipAliases={ipAliases} deviceAliases={deviceAliases}
              onAddIpAlias={onAddIpAlias} onDeleteIpAlias={onDeleteIpAlias}
              onAddDeviceAlias={onAddDeviceAlias} onDeleteDeviceAlias={onDeleteDeviceAlias}
              onImportData={onImportData} onClearHistory={handleClearHistory}
              // Fixed: Added onAddNews and onAddManual with correct types for AdminSystem
              onAddManual={onAddManual}
              onAddNews={onAddNews}
              fullDataExport={{ manuals, news, feedbackItems, deviceAliases }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface AdminProps {
  manuals: Manual[];
  news: NewsItem[];
  feedbackItems?: FeedbackItem[];
  ipAliases?: IpAlias[];
  deviceAliases?: DeviceAlias[];
  suppliers?: Supplier[];
  // Fixed: onAddManual and onAddNews updated to Promise<void> to match implementation in App.tsx and requirements of AdminSystem
  onAddManual: (manual: Manual) => Promise<void>;
  onDeleteManual: (id: string) => void;
  onAddNews: (news: NewsItem) => Promise<void>;
  onUpdateNews: (news: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onUpdateFeedback: (item: FeedbackItem) => void;
  onDeleteFeedback: (id: string) => void;
  onAddIpAlias: (alias: IpAlias) => void;
  onDeleteIpAlias: (id: string) => void;
  onAddDeviceAlias: (alias: DeviceAlias) => void;
  onDeleteDeviceAlias: (id: string) => void;
  onAddSupplier: (supplier: Supplier) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
  onImportData: (data: any) => void;
}
