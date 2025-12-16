
import React, { useState } from 'react';
import { Manual, NewsItem, FeedbackItem, IpAlias, Supplier } from '../types';
import { LogIn, Lock, XCircle, AlertOctagon, Trash2, LogOut, ShieldAlert } from 'lucide-react';
import { AdminManuals } from '../components/admin/AdminManuals';
import { AdminNews } from '../components/admin/AdminNews';
import { AdminCourses } from '../components/admin/AdminCourses';
import { AdminFeedback } from '../components/admin/AdminFeedback';
import { AdminSuppliers } from '../components/admin/AdminSuppliers';
import { AdminSystem } from '../components/admin/AdminSystem';
import { SectionHero } from '../components/SectionHero';
import { storageService } from '../services/storage';

interface AdminProps {
  manuals: Manual[];
  news: NewsItem[];
  feedbackItems?: FeedbackItem[];
  ipAliases?: IpAlias[];
  suppliers?: Supplier[];
  onAddManual: (manual: Manual) => void;
  onDeleteManual: (id: string) => void;
  onAddNews: (news: NewsItem) => void;
  onUpdateNews: (news: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onUpdateFeedback?: (item: FeedbackItem) => void;
  onDeleteFeedback?: (id: string) => void;
  onAddIpAlias?: (alias: IpAlias) => void;
  onDeleteIpAlias?: (id: string) => void;
  onAddSupplier?: (supplier: Supplier) => void;
  onUpdateSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (id: string) => void;
  onImportData?: (data: any) => void;
}

export const Admin: React.FC<AdminProps> = ({ 
  manuals, 
  news, 
  feedbackItems = [],
  ipAliases = [],
  suppliers = [],
  onAddManual, 
  onDeleteManual, 
  onAddNews, 
  onUpdateNews,
  onDeleteNews,
  onUpdateFeedback,
  onDeleteFeedback,
  onAddIpAlias,
  onDeleteIpAlias,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onImportData
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'manuals' | 'news' | 'messages' | 'courses' | 'suppliers' | 'system'>('manuals');
  
  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'moscato2024') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('La contraseña ingresada es incorrecta.');
      setPassword(''); 
    }
  };

  // Clear History Handler
  const handleClearHistory = async () => {
    await storageService.clearVisits();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="bg-white p-8 rounded-xl shadow-xl border border-brand-200 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900">Acceso Administrativo</h2>
            <p className="text-gray-500 text-sm mt-1">Ingrese la contraseña de super usuario.</p>
          </div>
          
          {loginError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center animate-fade-in">
              <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (loginError) setLoginError('');
              }}
              placeholder="Contraseña"
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900 ${
                loginError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="submit"
              className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-md hover:bg-brand-700 transition-colors flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative animate-fade-in">
      
      <SectionHero
        title="Panel de Administración"
        subtitle="Gestión centralizada de contenidos, manuales, novedades y usuarios del sistema."
        badgeText="Acceso Privilegiado"
        badgeIcon={ShieldAlert}
      >
        <button 
          onClick={() => {
            setIsAuthenticated(false);
            setPassword('');
            setLoginError('');
          }}
          className="flex items-center px-6 py-3 bg-red-600/90 hover:bg-red-700 text-white font-bold rounded-xl transition-colors backdrop-blur-sm border border-red-500 shadow-lg"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar Sesión
        </button>
      </SectionHero>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-h-[600px]">
        {/* Admin Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
          {['manuals', 'news', 'courses', 'messages', 'suppliers', 'system'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-white text-brand-600 border-b-2 border-brand-600 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
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
          {activeTab === 'manuals' && (
            <AdminManuals 
              manuals={manuals} 
              onAddManual={onAddManual} 
              onDeleteManual={onDeleteManual} 
            />
          )}

          {activeTab === 'news' && (
            <AdminNews 
              news={news} 
              onAddNews={onAddNews} 
              onUpdateNews={onUpdateNews} 
              onDeleteNews={onDeleteNews} 
            />
          )}

          {activeTab === 'courses' && (
            <AdminCourses />
          )}

          {activeTab === 'messages' && onDeleteFeedback && onUpdateFeedback && (
            <AdminFeedback 
              feedbackItems={feedbackItems} 
              onUpdateFeedback={onUpdateFeedback}
              onDeleteFeedback={onDeleteFeedback} 
            />
          )}

          {activeTab === 'suppliers' && onAddSupplier && onUpdateSupplier && onDeleteSupplier && (
            <AdminSuppliers 
              suppliers={suppliers} 
              onAddSupplier={onAddSupplier} 
              onUpdateSupplier={onUpdateSupplier} 
              onDeleteSupplier={onDeleteSupplier} 
            />
          )}

          {activeTab === 'system' && onAddIpAlias && onDeleteIpAlias && onImportData && (
            <AdminSystem 
              ipAliases={ipAliases}
              onAddIpAlias={onAddIpAlias}
              onDeleteIpAlias={onDeleteIpAlias}
              onImportData={onImportData}
              onClearHistory={handleClearHistory}
              fullDataExport={{ manuals, news, feedbackItems }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};
