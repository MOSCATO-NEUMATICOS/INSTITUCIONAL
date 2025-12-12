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
      case 'bug': return <Wrench className="w-4 h-4 text-gray-500" />;
      case 'request': return <FileQuestion className="w-4 h-4 text-blue-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: FeedbackStatus = 'new') => {
    switch(status) {
      case 'new': return { text: 'Nuevo', bg: 'bg-blue-100', textCol: 'text-blue-800', icon: <Inbox className="w-3 h-3 mr-1" /> };
      case 'in_progress': return { text: 'En Proceso', bg: 'bg-yellow-100', textCol: 'text-yellow-800', icon: <Clock className="w-3 h-3 mr-1" /> };
      case 'resolved': return { text: 'Resuelto', bg: 'bg-green-100', textCol: 'text-green-800', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> };
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
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Inbox className="w-6 h-6 mr-2 text-brand-600" />
            Gestión de Tickets
          </h3>
          <p className="text-sm text-gray-500 mt-1">Organiza reclamos, sugerencias y pedidos internos.</p>
        </div>
        
        {/* Stat Cards */}
        <div className="flex space-x-2">
           <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
             <span className="block text-xl font-bold text-blue-700">{stats.new}</span>
             <span className="text-[10px] uppercase font-bold text-blue-500">Nuevos</span>
           </div>
           <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
             <span className="block text-xl font-bold text-yellow-700">{stats.pending}</span>
             <span className="text-[10px] uppercase font-bold text-yellow-500">En Proceso</span>
           </div>
           <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-center">
             <span className="block text-xl font-bold text-green-700">{stats.resolved}</span>
             <span className="text-[10px] uppercase font-bold text-green-500">Resueltos</span>
           </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 mb-6 space-x-6 overflow-x-auto">
        <button 
          onClick={() => setFilterStatus('new')} 
          className={`pb-2 text-sm font-bold flex items-center ${filterStatus === 'new' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Inbox className="w-4 h-4 mr-2" /> Bandeja de Entrada
        </button>
        <button 
          onClick={() => setFilterStatus('in_progress')} 
          className={`pb-2 text-sm font-bold flex items-center ${filterStatus === 'in_progress' ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Clock className="w-4 h-4 mr-2" /> En Seguimiento
        </button>
        <button 
          onClick={() => setFilterStatus('archived')} 
          className={`pb-2 text-sm font-bold flex items-center ${filterStatus === 'archived' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
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
              <div key={item.id} className={`bg-white border rounded-lg p-5 transition-all shadow-sm hover:shadow-md ${item.priority === 'high' ? 'border-l-4 border-l-red-500' : 'border-gray-200'}`}>
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${item.isAnonymous ? 'bg-gray-100 text-gray-400' : 'bg-brand-100 text-brand-600'}`}>
                      {item.isAnonymous ? <UserX className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">
                          {item.isAnonymous ? 'Anónimo' : item.name}
                        </span>
                        {item.priority === 'high' && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold border border-red-200 flex items-center">
                            <Flag className="w-3 h-3 mr-1 fill-current" /> Alta Prioridad
                          </span>
                        )}
                      </div>
                      <span className="flex items-center text-xs text-gray-400 mt-0.5">
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
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 text-sm italic relative">
                    <span className="absolute top-2 left-2 text-gray-300 text-4xl leading-none">“</span>
                    <p className="relative z-10 pl-4">{item.message}</p>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 ml-0 md:ml-12">
                  
                  {/* Left: Categorization */}
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <button className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-3 py-1.5 rounded-md transition-colors">
                        <Tag className="w-3 h-3 mr-1.5" />
                        {item.type === 'claim' ? 'Reclamo' : 
                         item.type === 'suggestion' ? 'Sugerencia' : 
                         item.type === 'bug' ? 'Falla Técnica' : 
                         item.type === 'request' ? 'Pedido' : 'Sin Clasificar'}
                      </button>
                      {/* Dropdown for Type */}
                      <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex flex-col bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10 w-40">
                        <button onClick={() => handleTypeChange(item, 'claim')} className="px-3 py-2 text-xs text-left hover:bg-red-50 text-red-700 flex items-center"><AlertTriangle className="w-3 h-3 mr-2"/> Reclamo</button>
                        <button onClick={() => handleTypeChange(item, 'suggestion')} className="px-3 py-2 text-xs text-left hover:bg-yellow-50 text-yellow-700 flex items-center"><Lightbulb className="w-3 h-3 mr-2"/> Sugerencia</button>
                        <button onClick={() => handleTypeChange(item, 'bug')} className="px-3 py-2 text-xs text-left hover:bg-gray-50 text-gray-700 flex items-center"><Wrench className="w-3 h-3 mr-2"/> Falla</button>
                        <button onClick={() => handleTypeChange(item, 'request')} className="px-3 py-2 text-xs text-left hover:bg-blue-50 text-blue-700 flex items-center"><FileQuestion className="w-3 h-3 mr-2"/> Pedido</button>
                      </div>
                    </div>

                    <button 
                      onClick={() => togglePriority(item)}
                      className={`p-1.5 rounded-md transition-colors ${item.priority === 'high' ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400'}`}
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
                        className="text-xs font-bold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 px-3 py-1.5 rounded flex items-center transition-colors"
                      >
                        <Clock className="w-3 h-3 mr-1.5" /> Iniciar Seguimiento
                      </button>
                    )}
                    
                    {item.status !== 'resolved' && (
                      <button 
                        onClick={() => handleStatusChange(item, 'resolved')}
                        className="text-xs font-bold text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded flex items-center transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1.5" /> Marcar Resuelto
                      </button>
                    )}

                    {item.status === 'resolved' && (
                      <button 
                        onClick={() => handleStatusChange(item, 'in_progress')}
                        className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded flex items-center transition-colors"
                      >
                        <RotateCcw className="w-3 h-3 mr-1.5" /> Reabrir
                      </button>
                    )}

                    <div className="h-4 w-px bg-gray-300 mx-1"></div>

                    <button 
                      onClick={() => onDeleteFeedback(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors"
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
          <div className="p-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
            {filterStatus === 'new' ? (
               <>
                 <CheckCircle2 className="w-16 h-16 text-green-200 mb-4" />
                 <h4 className="text-lg font-bold text-gray-900">¡Todo al día!</h4>
                 <p className="text-gray-500">No hay tickets nuevos pendientes de revisión.</p>
               </>
            ) : (
               <>
                 <Filter className="w-16 h-16 text-gray-200 mb-4" />
                 <p className="text-gray-500">No hay mensajes en esta categoría.</p>
               </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};