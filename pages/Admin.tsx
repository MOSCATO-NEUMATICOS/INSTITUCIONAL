
import React, { useState } from 'react';
import { Manual, NewsItem, FeedbackItem, IpAlias, Supplier } from '../types';
import { LogIn, Lock, XCircle, AlertOctagon, Trash2 } from 'lucide-react';
import { AdminManuals } from '../components/admin/AdminManuals';
import { AdminNews } from '../components/admin/AdminNews';
import { AdminCourses } from '../components/admin/AdminCourses';
import { AdminFeedback } from '../components/admin/AdminFeedback';
import { AdminSuppliers } from '../components/admin/AdminSuppliers';
import { AdminSystem } from '../components/admin/AdminSystem';

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

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Panel de Administración</h2>
        <button 
          onClick={() => {
            setIsAuthenticated(false);
            setPassword('');
            setLoginError('');
          }}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-h-[600px]">
        {/* Admin Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {['manuals', 'news', 'courses', 'messages', 'suppliers', 'system'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 min-w-[150px] py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors ${
                activeTab === tab ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'
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

          {activeTab === 'messages' && onDeleteFeedback && (
            <AdminFeedback 
              feedbackItems={feedbackItems} 
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
              fullDataExport={{ manuals, news, feedbackItems }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};
