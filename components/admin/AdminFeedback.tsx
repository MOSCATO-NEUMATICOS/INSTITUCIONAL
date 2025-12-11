
import React from 'react';
import { FeedbackItem } from '../../types';
import { User, UserX, MessageSquare, Trash2, Calendar } from 'lucide-react';

interface AdminFeedbackProps {
  feedbackItems: FeedbackItem[];
  onDeleteFeedback: (id: string) => void;
}

export const AdminFeedback: React.FC<AdminFeedbackProps> = ({ feedbackItems, onDeleteFeedback }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-brand-600" />
          Buzón de Mensajes ({feedbackItems.length})
        </h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {feedbackItems.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {feedbackItems.map((item) => (
              <li key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${item.isAnonymous ? 'bg-gray-200 text-gray-500' : 'bg-brand-100 text-brand-600'}`}>
                      {item.isAnonymous ? <UserX className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900">
                        {item.isAnonymous ? 'Anónimo' : item.name}
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.date}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteFeedback(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Borrar mensaje"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="ml-12">
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                    "{item.message}"
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">La bandeja de entrada está vacía.</p>
          </div>
        )}
      </div>
    </div>
  );
};
