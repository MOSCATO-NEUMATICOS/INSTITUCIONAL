
import React, { useState } from 'react';
import { Send, User, UserX, CheckCircle, Loader2 } from 'lucide-react';
import { FeedbackItem } from '../types';

interface FeedbackProps {
  onFeedbackSubmit?: (item: FeedbackItem) => void;
}

export const Feedback: React.FC<FeedbackProps> = ({ onFeedbackSubmit }) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. Simulate internal network delay
      await new Promise(resolve => setTimeout(resolve, 600));

      const newItem: FeedbackItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        date: new Date().toLocaleString('es-AR', { hour12: false }), // Force 24h format
        isAnonymous,
        // FIX: Firestore falla si enviamos 'undefined'. Si es anónimo, enviamos explícitamente el string 'Anónimo'.
        name: isAnonymous ? 'Anónimo' : name, 
        message,
      };

      // 2. Save internally (Cloud / LocalStorage)
      if (onFeedbackSubmit) {
        onFeedbackSubmit(newItem);
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage('');
    // Keep name if not anonymous for convenience
    if (isAnonymous) setName('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Buzón de Sugerencias y Reclamos</h2>
        <p className="mt-2 text-gray-500">
          Tu opinión es vital para mejorar. Puedes escribirnos con tu nombre o de forma anónima.
        </p>
      </div>

      {!submitted ? (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-brand-600 px-6 py-4">
            <h3 className="text-white font-medium flex items-center">
              {isAnonymous ? <UserX className="w-5 h-5 mr-2" /> : <User className="w-5 h-5 mr-2" />}
              {isAnonymous ? 'Nuevo Mensaje Anónimo' : 'Nuevo Mensaje Identificado'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6" autoComplete="off">
            {/* Campo oculto para evitar que Chrome piense que es un login y sugiera contraseñas */}
            <input type="text" name="fake_usernameremembered" style={{display: 'none'}} tabIndex={-1} />
            <input type="password" name="fake_passwordremembered" style={{display: 'none'}} tabIndex={-1} />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 gap-4">
               <div className="text-sm text-gray-500 italic">
                 Los campos marcados son obligatorios para el envío.
               </div>
               
               <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={isAnonymous} 
                    onChange={() => setIsAnonymous(!isAnonymous)} 
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${isAnonymous ? 'bg-gray-600' : 'bg-brand-200'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isAnonymous ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm font-medium text-gray-700">
                  {isAnonymous ? 'Modo Anónimo Activado' : 'Enviar con Nombre'}
                </div>
              </label>
            </div>

            {!isAnonymous && (
              <div className="transition-opacity duration-300 animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tu Nombre</label>
                <input
                  type="text"
                  name="feedback_author" // Nombre único para evitar autocompletado de usuario
                  id="feedback_author"
                  required={!isAnonymous}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm border p-3 bg-white text-gray-900"
                  placeholder="Juan Pérez"
                  autoComplete="off"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                name="feedback_content" // Nombre explícito
                id="feedback_content"
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm border p-3 bg-white text-gray-900"
                placeholder="Escribe aquí tu sugerencia, reclamo o comentario..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !message}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white transition-colors ${
                isSubmitting || !message
                  ? 'bg-brand-400 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Procesando...
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-2 h-4 w-4" />
                  Enviar Mensaje
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center border border-green-100 animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje Recibido!</h3>
          <p className="text-gray-500 mb-6">
            Gracias por tu aporte. Tu mensaje ha sido guardado correctamente en el sistema.
          </p>

          <div className="mt-6">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Enviar otro mensaje
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
