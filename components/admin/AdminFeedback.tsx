
import React, { useState, useMemo } from 'react';
import { FeedbackItem, FeedbackStatus, FeedbackType, FeedbackPriority } from '../../types';
import { User, UserX, MessageSquare, Trash2, Calendar, CheckCircle2, Clock, AlertCircle, Inbox, Archive, Filter, Lightbulb, Wrench, FileQuestion, AlertTriangle, Tag, Flag, RotateCcw } from 'lucide-react';

interface AdminFeedbackProps {
  feedbackItems: FeedbackItem[];
  onDeleteFeedback: (id: string) => void;
  onUpdateFeedback: (item: FeedbackItem) => void;
}

export const AdminFeedback: React.FC<AdminFeedbackProps> = ({ feedbackItems, onDeleteFeedback, onUpdateFeedback }) => {
  const [filterStatus, setFilterStatus] = useState<FeedbackStatus | 'all' | 'archived'>('new');
  
  // Categorization helpers
  const getTypeIcon = (type?: FeedbackType) => {
    switch(type) {
      case 'claim': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'bug': return <Wrench className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
      case 'request': return <FileQuestion className="w-4 h-4 text-blue-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: FeedbackStatus = 'new') => {
    switch(status) {
      case 'new': return { text: 'Nuevo', bg: 'bg-blue-100 dark:bg-blue-900/30', textCol: 'text-blue-800 dark:text-blue-200', icon: <Inbox className="w-3 h-3 mr-1" /> };
      case 'in_progress': return { text: 'En Proceso', bg: 'bg-yellow-100 dark:bg-yellow-900/30', textCol: 'text-yellow-800 dark:text-yellow-200', icon: <Clock className="w-3 h-3 mr-1" /> };
      case 'resolved': return { text: 'Resuelto', bg: 'bg-green-100 dark:bg-green-900/30', textCol: 'text-green-800 dark:text-green-200', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> };
    }
  };

  // Logic to handle items without status (legacy compatibility)
  const safeItems = feedbackItems.map(item => ({
    ...item,
    status: item.status || 'new', // Default to new
    type: item.type || 'other',
    priority: item.priority || 'normal'
  }));

  const filteredItems = useMemo(() => {
    if (filterStatus === 'all') return safeItems.filter(i => i.status !== 'resolved'); // Show active work
    if (filterStatus === 'archived') return safeItems.filter(i => i.status === 'resolved');
    return safeItems.filter(i => i.status === filterStatus);
  }, [safeItems, filterStatus]);

  const stats = {
    new: safeItems.filter(i => i.status === 'new').length,
    pending: safeItems.filter(i => i.status === 'in_progress').length,
    resolved: safeItems.filter(i => i.status === 'resolved').length
  };

  const handleStatusChange = (item: FeedbackItem, newStatus: FeedbackStatus) => {
    onUpdateFeedback({ ...item, status: newStatus });
  };

  const handleTypeChange = (item: FeedbackItem, newType: FeedbackType) => {
    onUpdateFeedback({ ...item, type: newType });
  };

  const togglePriority = (item: FeedbackItem) => {
    const newPriority = item.priority === 'high' ? 'normal' : 'high';
    onUpdateFeedback({ ...item, priority: newPriority });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Inbox className="w-6 h-6 mr-2 text-brand-600 dark:text-brand-400" />
            Gestión de Tickets
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Organiza reclamos, sugerencias y pedidos internos.</p>
        </div>
        
        {/* Stat Cards */}
        <div className="flex space-x-2">
           <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
             <span className="block text-xl font-bold text-blue-700 dark:text-blue-300">{stats.new}</span>
             <span className="text-[10px] uppercase font-bold text-blue-500 dark:text-blue-400">Nuevos</span>
           </div>
           <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
             <span className="block text-xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</span>
             <span className="text-[10px] uppercase font-bold text-yellow-500 dark:text-yellow-400">En Proceso</span>
           </div>
           <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
             <span className="block text-xl font-bold text-green-700 dark:text-green-300">{stats.resolved}</span>
             <span className="text-[10px] uppercase font-bold text-green-500 dark:text-green-400">Resueltos</span>
           </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 space-x-6 overflow-x-auto">
        <button 
          onClick={() => setFilterStatus('new')} 
          className={`pb-2 text-sm font-bold flex items-center ${filterStatus === 'new' ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          <Inbox className="w-4 h-4 mr-2" /> Bandeja de Entrada
        </button>
        <button 
          onClick={() => setFilterStatus('in_progress')} 
          className={`pb-2 text-sm font-bold flex items-center ${filterStatus === 'in_progress' ? 'text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          <Clock className="w-4 h-4 mr-2" /> En Seguimiento
        </button>
        <button 
          onClick={() => setFilterStatus('archived')} 
          className={`pb-2 text-sm font-bold flex items-center ${filterStatus === 'archived' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          <Archive className="w-4 h-4 mr-2" /> Historial / Resueltos
        </button>
      </div>

      {/* Message List */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const statusStyle = getStatusLabel(item.status);
            return (
              <div key={item.id} className={`bg-white dark:bg-gray-800 border rounded-lg p-5 transition-all shadow-sm hover:shadow-md ${item.priority === 'high' ? 'border-l-4 border-l-red-500 dark:border-l-red-500 border-t-gray-200 dark:border-t-gray-700 border-r-gray-200 dark:border-r-gray-700 border-b-gray-200 dark:border-b-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${item.isAnonymous ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' : 'bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400'}`}>
                      {item.isAnonymous ? <UserX className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          {item.isAnonymous ? 'Anónimo' : item.name}
                        </span>
                        {item.priority === 'high' && (
                          <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-1.5 py-0.5 rounded font-bold border border-red-200 dark:border-red-800 flex items-center">
                            <Flag className="w-3 h-3 mr-1 fill-current" /> Alta Prioridad
                          </span>
                        )}
                      </div>
                      <span className="flex items-center text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        <Calendar className="w-3 h-3 mr-1" /> {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.textCol}`}>
                    {statusStyle.icon} {statusStyle.text}
                  </div>
                </div>

                {/* Content */}
                <div className="ml-0 md:ml-12 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm italic relative">
                    <span className="absolute top-2 left-2 text-gray-300 dark:text-gray-600 text-4xl leading-none">“</span>
                    <p className="relative z-10 pl-4">{item.message}</p>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-700 ml-0 md:ml-12">
                  
                  {/* Left: Categorization */}
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <button className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-md transition-colors">
                        <Tag className="w-3 h-3 mr-1.5" />
                        {item.type === 'claim' ? 'Reclamo' : 
                         item.type === 'suggestion' ? 'Sugerencia' : 
                         item.type === 'bug' ? 'Falla Técnica' : 
                         item.type === 'request' ? 'Pedido' : 'Sin Clasificar'}
                      </button>
                      {/* Dropdown for Type */}
                      <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md overflow-hidden z-10 w-40">
                        <button onClick={() => handleTypeChange(item, 'claim')} className="px-3 py-2 text-xs text-left hover:bg-red-50 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center"><AlertTriangle className="w-3 h-3 mr-2"/> Reclamo</button>
                        <button onClick={() => handleTypeChange(item, 'suggestion')} className="px-3 py-2 text-xs text-left hover:bg-yellow-50 dark:hover:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 flex items-center"><Lightbulb className="w-3 h-3 mr-2"/> Sugerencia</button>
                        <button onClick={() => handleTypeChange(item, 'bug')} className="px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center"><Wrench className="w-3 h-3 mr-2"/> Falla</button>
                        <button onClick={() => handleTypeChange(item, 'request')} className="px-3 py-2 text-xs text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center"><FileQuestion className="w-3 h-3 mr-2"/> Pedido</button>
                      </div>
                    </div>

                    <button 
                      onClick={() => togglePriority(item)}
                      className={`p-1.5 rounded-md transition-colors ${item.priority === 'high' ? 'text-red-500 bg-red-50 dark:bg-red-900/30' : 'text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-300'}`}
                      title={item.priority === 'high' ? "Quitar prioridad" : "Marcar como urgente"}
                    >
                      <Flag className={`w-4 h-4 ${item.priority === 'high' ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Right: Workflow Actions */}
                  <div className="flex items-center gap-2">
                    {item.status === 'new' && (
                      <button 
                        onClick={() => handleStatusChange(item, 'in_progress')}
                        className="text-xs font-bold text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 px-3 py-1.5 rounded flex items-center transition-colors"
                      >
                        <Clock className="w-3 h-3 mr-1.5" /> Iniciar Seguimiento
                      </button>
                    )}
                    
                    {item.status !== 'resolved' && (
                      <button 
                        onClick={() => handleStatusChange(item, 'resolved')}
                        className="text-xs font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 px-3 py-1.5 rounded flex items-center transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1.5" /> Marcar Resuelto
                      </button>
                    )}

                    {item.status === 'resolved' && (
                      <button 
                        onClick={() => handleStatusChange(item, 'in_progress')}
                        className="text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1.5 rounded flex items-center transition-colors"
                      >
                        <RotateCcw className="w-3 h-3 mr-1.5" /> Reabrir
                      </button>
                    )}

                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

                    <button 
                      onClick={() => onDeleteFeedback(item.id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                      title="Eliminar permanentemente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
            {filterStatus === 'new' ? (
               <>
                 <CheckCircle2 className="w-16 h-16 text-green-200 dark:text-green-800 mb-4" />
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white">¡Todo al día!</h4>
                 <p className="text-gray-500 dark:text-gray-400">No hay tickets nuevos pendientes de revisión.</p>
               </>
            ) : (
               <>
                 <Filter className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" />
                 <p className="text-gray-500 dark:text-gray-400">No hay mensajes en esta categoría.</p>
               </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
