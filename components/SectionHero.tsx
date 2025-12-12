
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeroProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeIcon?: LucideIcon;
  children?: React.ReactNode; // Para contenido extra a la derecha (búsqueda, stats, etc.)
}

export const SectionHero: React.FC<SectionHeroProps> = ({ title, subtitle, badgeText, badgeIcon: Icon, children }) => {
  return (
    <div className="bg-brand-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border-b-8 border-gold-400 mb-10 transition-all duration-500 animate-fade-in">
      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-800 opacity-50 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-900 opacity-30 blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          {badgeText && (
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-800/80 border border-brand-700 text-gold-400 font-bold text-sm mb-6 backdrop-blur-sm shadow-sm">
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {badgeText}
            </div>
          )}
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-sm">
            {title}
          </h2>
          <p className="text-brand-200 text-lg md:text-xl max-w-xl leading-relaxed font-light">
            {subtitle}
          </p>
        </div>
        
        {/* Right Side Content (Optional) */}
        {children && (
          <div className="relative flex justify-center lg:justify-end">
             {children}
          </div>
        )}
      </div>
    </div>
  );
};
