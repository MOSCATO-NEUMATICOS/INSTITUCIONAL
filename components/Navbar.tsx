
import React, { useState } from 'react';
import { Page } from '../types';
import { Menu, X, BookOpen, Wrench, MessageSquare, Home, Lock, BarChart3, GraduationCap } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { page: Page.HOME, label: 'Institucional', icon: Home },
    { page: Page.MANUALS, label: 'Manuales', icon: BookOpen },
    { page: Page.COURSES, label: 'Cursos', icon: GraduationCap },
    { page: Page.TOOLS, label: 'Herramientas', icon: Wrench },
    { page: Page.METRICS, label: 'Métricas', icon: BarChart3 },
    { page: Page.FEEDBACK, label: 'Buzón', icon: MessageSquare },
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="bg-brand-900 text-white sticky top-0 z-50 shadow-lg border-b-4 border-gold-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO MOSCATO NEUMATICOS - CLEAN STYLE */}
          <div className="flex flex-col items-center cursor-pointer group leading-none justify-center pt-2" onClick={() => handleNav(Page.HOME)}>
             <span className="font-semibold text-3xl tracking-wide text-white drop-shadow-sm" style={{fontFamily: 'Inter, sans-serif'}}>
                MOSCATO
             </span>
             <span className="text-[0.65rem] uppercase tracking-[0.35em] text-white/90 font-medium mt-1">
                NEUMATICOS
             </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-bold transition-all ${
                    currentPage === item.page
                      ? 'bg-gold-400 text-brand-900 shadow-md transform -translate-y-0.5'
                      : 'text-brand-100 hover:bg-brand-800 hover:text-gold-400'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              ))}
              {/* Admin Button separate */}
              <button
                 onClick={() => handleNav(Page.ADMIN)}
                 className={`flex items-center px-3 py-2 rounded-md text-sm font-bold transition-all ${
                  currentPage === Page.ADMIN
                    ? 'bg-brand-700 text-gold-400 border border-gold-400'
                    : 'text-brand-400 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Admin
              </button>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-brand-800 inline-flex items-center justify-center p-2 rounded-md text-brand-100 hover:text-white hover:bg-brand-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-bold ${
                  currentPage === item.page
                    ? 'bg-gold-400 text-brand-900'
                    : 'text-brand-100 hover:bg-brand-700 hover:text-gold-400'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
             <button
                onClick={() => handleNav(Page.ADMIN)}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-bold ${
                  currentPage === Page.ADMIN
                    ? 'bg-brand-700 text-gold-400'
                    : 'text-brand-400 hover:bg-brand-700 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Administración
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};
