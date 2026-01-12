
import React, { useRef } from 'react';
import { ShieldCheck, Users, TrendingUp, Heart, Star, CheckCircle, Home as HomeIcon, Clock, Eye, Sparkles, BellRing, ArrowDown } from 'lucide-react';
import { NewsItem } from '../types';

interface HomeProps {
  news: NewsItem[];
}

export const Home: React.FC<HomeProps> = ({ news }) => {
  const newsSectionRef = useRef<HTMLDivElement>(null);
  
  const getDaysDifference = (dateStr: string) => {
    try {
      if (!dateStr) return 0;
      const [day, month, year] = dateStr.split('/').map(Number);
      if (!day || !month || !year) return 0;
      const itemDate = new Date(year, month - 1, day, 12, 0, 0);
      const now = new Date();
      now.setHours(12, 0, 0, 0);
      const diffTime = now.getTime() - itemDate.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
      return 0;
    }
  };

  const activeNews = news.filter(item => {
    if (!item.autoDelete) return true; 
    const diffDays = getDaysDifference(item.date);
    const duration = Number(item.autoDeleteDuration) || 30;
    return diffDays <= duration;
  });

  const isActiveHighlight = (item: NewsItem) => {
    if (!item.highlight) return false;
    const diffDays = getDaysDifference(item.date);
    const duration = Number(item.highlightDuration) || 15;
    return diffDays <= duration;
  };

  const highlightedNews = activeNews.filter(isActiveHighlight);
  const regularNews = activeNews.filter(n => !isActiveHighlight(n));

  const scrollToNews = () => {
    newsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in dark:text-gray-100">
      {/* Hero Section - Reduced Height and Spacing */}
      <div className="relative bg-brand-900 text-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[50vh] md:min-h-[65vh] flex flex-col justify-center border-b border-white/5">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-800 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-900 opacity-40 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          {/* Logo Hero - Scaled down for better fold management */}
          <div className="flex flex-col items-center justify-center mb-6 leading-none">
             <span className="text-5xl md:text-7xl font-semibold tracking-wide text-white drop-shadow-md" style={{fontFamily: 'Inter, sans-serif'}}>
               MOSCATO
             </span>
             <span className="text-lg md:text-2xl uppercase tracking-[0.35em] text-white/90 font-light mt-3">
               NEUMATICOS
             </span>
          </div>
          
          <h1 className="text-lg md:text-2xl font-bold tracking-widest text-gold-400 uppercase mt-4 mb-3">
            TU AUTO EN BUENAS MANOS
          </h1>
          
          <p className="text-base md:text-lg text-brand-200 max-w-2xl mx-auto font-light mb-8">
            Más de 45 años brindando calidad y confianza en Rosario.
          </p>

          <div className="flex flex-col items-center gap-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-gold-400/30 bg-brand-800/50 text-gold-100 font-semibold text-xs backdrop-blur-sm">
              <CheckCircle className="w-3.5 h-3.5 mr-2 text-gold-400" /> Portal Interno Oficial
            </span>

            {/* NOTIFICATION BUTTON FOR HIGHLIGHTED NEWS - More compact */}
            {highlightedNews.length > 0 && (
              <button 
                onClick={scrollToNews}
                className="group mt-4 relative inline-flex items-center px-6 py-3 bg-gold-400 overflow-hidden text-brand-900 font-bold rounded-full hover:bg-gold-300 transition-all shadow-lg hover:shadow-gold-400/50 hover:-translate-y-1 animate-pulse-slow"
              >
                <BellRing className="w-5 h-5 mr-2.5 animate-wiggle" />
                <span className="text-base">¡Hay {highlightedNews.length} Novedades!</span>
                <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Misión */}
            <div className="bg-brand-50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 border-l-8 border-brand-600 shadow-sm dark:shadow-none transition-colors">
              <h2 className="text-xl font-bold text-brand-900 dark:text-white mb-4 flex items-center">
                <span className="bg-brand-600 text-white p-2 rounded-lg mr-3">
                  <CheckCircle className="w-5 h-5" />
                </span>
                Nuestra Misión
              </h2>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-base space-y-3">
                <p>Ofrecemos servicios de venta de neumáticos y mecánica especializada para garantizar la seguridad vial, el confort en el andar y cuidar la vida útil de los vehículos.</p>
                <p>Optimizamos los tiempos de reparación, destacándonos por un trato personalizado, profesional y cordial hacia nuestros clientes.</p>
                <p className="font-bold text-brand-700 dark:text-brand-400">Impulsamos un entorno laboral donde las personas son felices y fomentamos el desarrollo profesional.</p>
              </div>
            </div>

            {/* Visión */}
            <div className="bg-gold-50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 border-l-8 border-gold-400 shadow-sm dark:shadow-none transition-colors">
              <h2 className="text-xl font-bold text-brand-900 dark:text-white mb-4 flex items-center">
                <span className="bg-gold-400 text-brand-900 p-2 rounded-lg mr-3">
                  <Star className="w-5 h-5" />
                </span>
                Nuestra Visión
              </h2>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed italic text-base space-y-3">
                <p>“Consolidar nuestro legado como una gomería reconocida por su excelencia en Rosario y evolucionar en los próximos 2 años hacia un referente en servicios mecánicos integrales...”</p>
                <p>Queremos mantener la calidad y confianza que nos han distinguido por más de 45 años incorporando tecnología y procesos innovadores.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section - More compact grid */}
      <div className="bg-gray-50 dark:bg-gray-950 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase">Nuestra Identidad</h2>
            <p className="mt-1 text-2xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Valores Institucionales: <span className="text-brand-600 dark:text-gold-400">CREERTE</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* C - Compromiso */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-t-4 border-brand-500 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className="bg-brand-100 dark:bg-brand-900 p-2 rounded-full text-brand-600 dark:text-brand-300 mr-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  <span className="text-lg text-brand-600 dark:text-brand-400 mr-0.5">C</span>ompromiso
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                Priorizar siempre la seguridad del cliente mediante diagnósticos responsables y prácticas confiables.
              </p>
            </div>

            {/* R - Responsabilidad */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-t-4 border-gold-400 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className="bg-gold-100 dark:bg-yellow-900/30 p-2 rounded-full text-brand-800 dark:text-gold-400 mr-3">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  <span className="text-lg text-gold-500 mr-0.5">R</span>esponsabilidad
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                Ser claros, honestos y coherentes en cada diagnóstico, presupuesto y comunicación.
              </p>
            </div>

            {/* E - Excelencia */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-t-4 border-brand-500 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className="bg-brand-100 dark:bg-brand-900 p-2 rounded-full text-brand-600 dark:text-brand-300 mr-3">
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  <span className="text-lg text-brand-600 dark:text-brand-400 mr-0.5">E</span>xcelencia
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                Brindar atención profesional, personalizada y orientada a la mejor experiencia posible.
              </p>
            </div>

            {/* E - Espacios */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-t-4 border-gold-400 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className="bg-gold-100 dark:bg-yellow-900/30 p-2 rounded-full text-brand-800 dark:text-gold-400 mr-3">
                  <HomeIcon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  <span className="text-lg text-gold-500 mr-0.5">E</span>spacios
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                Crear ambientes modernos, ordenados y cómodos que transmitan tranquilidad y profesionalismo.
              </p>
            </div>

            {/* R - Respeto */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-t-4 border-brand-500 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className="bg-brand-100 dark:bg-brand-900 p-2 rounded-full text-brand-600 dark:text-brand-300 mr-3">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  <span className="text-lg text-brand-600 dark:text-brand-400 mr-0.5">R</span>espeto y Empatía
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                Tratar a clientes, proveedores y compañeros con escucha, respeto y comprensión.
              </p>
            </div>

            {/* T - Trabajo en Equipo */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-t-4 border-gold-400 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className="bg-gold-100 dark:bg-yellow-900/30 p-2 rounded-full text-brand-800 dark:text-gold-400 mr-3">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  <span className="text-lg text-gold-500 mr-0.5">T</span>rabajo en Equipo
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                Colaborar para resolver problemas, mejorar procesos y ofrecer soluciones integrales.
              </p>
            </div>

            {/* E - Evolución */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-t-4 border-brand-500 hover:shadow-md transition-all md:col-span-2">
              <div className="flex items-center mb-3">
                <div className="bg-brand-100 dark:bg-brand-900 p-2 rounded-full text-brand-600 dark:text-brand-300 mr-3">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  <span className="text-lg text-brand-600 dark:text-brand-400 mr-0.5">E</span>volución Continua
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                Aprender, mejorar y adaptarse constantemente para brindar un servicio cada vez mejor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Notice Board - Dynamic */}
      <div ref={newsSectionRef} className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 border-t border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           
           {/* HIGHLIGHTED SECTION */}
           {highlightedNews.length > 0 && (
             <div className="mb-10 animate-fade-in-up">
               <div className="flex items-center mb-6">
                 <div className="bg-gold-400 h-6 w-1 mr-3 rounded-full"></div>
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                   <Sparkles className="w-6 h-6 mr-3 text-gold-500 fill-current animate-pulse" />
                   Cartelera Destacada
                 </h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {highlightedNews.map(item => (
                   <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-black border-l-8 border-l-gold-400 p-6 relative overflow-hidden group hover:transform hover:-translate-y-1 transition-all duration-300">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Star className="w-24 h-24 text-gold-400" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-yellow-800 dark:bg-yellow-900 dark:text-gold-400">
                            Importante
                          </span>
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center">
                             <Clock className="w-3.5 h-3.5 mr-1" />
                             {item.date}
                          </span>
                        </div>
                        <h4 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">{item.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.description}</p>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* REGULAR NEWS SECTION */}
           <div className="mt-6">
             <div className="flex items-center mb-6">
               <div className="bg-brand-600 h-6 w-1 mr-3 rounded-full"></div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Novedades Generales</h3>
             </div>
             
             <div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
               {regularNews.length > 0 ? (
                 <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                   {regularNews.map((item) => (
                     <li key={item.id}>
                       <div className="px-6 py-4 hover:bg-brand-50/50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group">
                         <div className="flex items-center justify-between">
                           <p className="text-base font-bold text-brand-800 dark:text-brand-300 truncate group-hover:text-brand-600 dark:group-hover:text-white transition-colors">{item.title}</p>
                           <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                             <span className={`px-2 py-0.5 inline-flex text-[10px] leading-5 font-semibold rounded-full border ${
                               item.category.includes('Ventas') ? 'bg-gold-100 text-yellow-800 border-gold-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700' :
                               item.category.includes('Taller') ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700' :
                               'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                             }`}>
                               {item.category}
                             </span>
                           </div>
                         </div>
                         <div className="mt-1 sm:flex sm:justify-between">
                           <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-1">
                             {item.description}
                           </p>
                           <div className="mt-1 flex items-center text-[10px] text-gray-400 sm:mt-0 font-medium">
                             <Clock className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                             <p>{item.date}</p>
                           </div>
                         </div>
                       </div>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <div className="p-10 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                   <Clock className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-500 mb-2" />
                   <p className="text-base font-medium">No hay novedades recientes para mostrar.</p>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
