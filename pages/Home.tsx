
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
      // Date format is strictly dd/mm/yyyy from storage
      const [day, month, year] = dateStr.split('/').map(Number);
      
      // Validar fecha
      if (!day || !month || !year) return 0;

      // Usar Mediodía (12:00) para evitar problemas de huso horario o DST al restar fechas
      const itemDate = new Date(year, month - 1, day, 12, 0, 0);
      const now = new Date();
      now.setHours(12, 0, 0, 0);
      
      // Calculate difference in milliseconds
      const diffTime = now.getTime() - itemDate.getTime();
      
      // Convert to days using floor
      // Si el item es del futuro (error de fecha), dará negativo, lo cual es <= duración, así que se muestra.
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
      return 0; // Ante error, asumir 0 días para que se muestre
    }
  };

  // 1. Filter out expired news (Auto-delete logic)
  const activeNews = news.filter(item => {
    // Si no tiene activado autoDelete, mostrar siempre.
    if (!item.autoDelete) return true; 
    
    const diffDays = getDaysDifference(item.date);
    
    // Asegurar que la duración sea un número y tenga un fallback
    const duration = Number(item.autoDeleteDuration) || 30;
    
    // Mantener si la diferencia de días es menor o igual a la duración
    // Ejemplo: Creado hoy (diff 0) <= Duración 5 -> TRUE (Se muestra)
    return diffDays <= duration;
  });

  // 2. Determine highlights based on custom duration
  const isActiveHighlight = (item: NewsItem) => {
    if (!item.highlight) return false;
    
    const diffDays = getDaysDifference(item.date);
    const duration = Number(item.highlightDuration) || 15;
    
    return diffDays <= duration;
  };

  const highlightedNews = activeNews.filter(isActiveHighlight);
  // Regular news are those that are NOT highlighted (even if they have highlight=true but expired the duration)
  const regularNews = activeNews.filter(n => !isActiveHighlight(n));

  const scrollToNews = () => {
    newsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in dark:text-gray-100">
      {/* Hero Section - Keeps Blue Brand Color in Dark Mode */}
      <div className="relative bg-brand-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] flex flex-col justify-center">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-800 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-900 opacity-50 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          {/* Logo Hero - Clean MOSCATO NEUMATICOS */}
          <div className="flex flex-col items-center justify-center mb-8 leading-none">
             <span className="text-6xl md:text-8xl font-semibold tracking-wide text-white drop-shadow-md" style={{fontFamily: 'Inter, sans-serif'}}>
               MOSCATO
             </span>
             <span className="text-xl md:text-3xl uppercase tracking-[0.35em] text-white/90 font-light mt-4">
               NEUMATICOS
             </span>
          </div>
          
          <h1 className="text-xl md:text-3xl font-bold tracking-widest text-gold-400 uppercase mt-8 mb-4">
            TU AUTO EN BUENAS MANOS
          </h1>
          
          <p className="text-lg md:text-xl text-brand-200 max-w-3xl mx-auto font-light mt-6 mb-10">
            Más de 45 años brindando calidad y confianza en Rosario.
          </p>

          <div className="flex flex-col items-center gap-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-gold-400/30 bg-brand-800/50 text-gold-100 font-semibold text-sm backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 mr-2 text-gold-400" /> Portal Interno Oficial
            </span>

            {/* NOTIFICATION BUTTON FOR HIGHLIGHTED NEWS */}
            {highlightedNews.length > 0 && (
              <button 
                onClick={scrollToNews}
                className="group mt-6 relative inline-flex items-center px-8 py-4 bg-gold-400 overflow-hidden text-brand-900 font-bold rounded-full hover:bg-gold-300 transition-all shadow-lg hover:shadow-gold-400/50 hover:-translate-y-1 animate-pulse-slow"
              >
                <BellRing className="w-6 h-6 mr-3 animate-wiggle" />
                <span className="text-lg">¡Hay {highlightedNews.length} Novedades Destacadas!</span>
                <ArrowDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Misión */}
            <div className="bg-brand-50 dark:bg-gray-800 rounded-2xl p-8 border-l-8 border-brand-600 shadow-sm dark:shadow-none transition-colors">
              <h2 className="text-2xl font-bold text-brand-900 dark:text-white mb-4 flex items-center">
                <span className="bg-brand-600 text-white p-2 rounded-lg mr-3">
                  <CheckCircle className="w-6 h-6" />
                </span>
                Nuestra Misión
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                Ofrecemos servicios de venta de neumáticos y mecánica especializada para garantizar la seguridad vial, el confort en el andar y cuidar la vida útil de los vehículos.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mt-4">
                Optimizamos los tiempos de reparación, destacándonos por un trato personalizado, profesional y cordial hacia nuestros clientes.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mt-4 font-medium">
                Impulsamos un entorno laboral donde las personas son felices y fomentamos el desarrollo profesional.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-gold-50 dark:bg-gray-800 rounded-2xl p-8 border-l-8 border-gold-400 shadow-sm dark:shadow-none transition-colors">
              <h2 className="text-2xl font-bold text-brand-900 dark:text-white mb-4 flex items-center">
                <span className="bg-gold-400 text-brand-900 p-2 rounded-lg mr-3">
                  <Star className="w-6 h-6" />
                </span>
                Nuestra Visión
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                “Consolidar nuestro legado como una gomería reconocida por su excelencia en Rosario y evolucionar en los próximos 2 años hacia un referente en servicios mecánicos integrales, alcanzando los estándares de calidad y atención propios de los servicios posventa de las principales agencias automotrices.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic mt-4">
                Queremos mantener la calidad y confianza que nos han distinguido por más de 45 años, mientras incorporamos tecnología y procesos innovadores para brindar soluciones completas a nuestros clientes, apoyando además desde nuestra posición empresarial, causas nobles y fomentamos el arte en nuestra comunidad.”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 dark:bg-gray-950 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-brand-600 dark:text-brand-400 font-bold tracking-wide uppercase">Nuestra Identidad</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Valores Institucionales: CREERTE
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              Los pilares que sostienen nuestro trabajo diario y nos guían hacia el futuro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Value Card Template for Reuse */}
            {/* C - Compromiso */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 p-6 border-t-4 border-brand-500 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-brand-100 dark:bg-brand-900 p-3 rounded-full text-brand-600 dark:text-brand-300 mr-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  <span className="text-2xl text-brand-600 dark:text-brand-400 mr-1">C</span>ompromiso con la Seguridad
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Priorizar siempre la seguridad del cliente y de su vehículo mediante diagnósticos responsables y prácticas confiables.
              </p>
            </div>

            {/* R - Responsabilidad */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 p-6 border-t-4 border-gold-400 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-gold-100 dark:bg-yellow-900/30 p-3 rounded-full text-brand-800 dark:text-gold-400 mr-4">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  <span className="text-2xl text-gold-500 mr-1">R</span>esponsabilidad y Transparencia
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Ser claros, honestos y coherentes en cada diagnóstico, presupuesto y comunicación.
              </p>
            </div>

            {/* E - Excelencia */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 p-6 border-t-4 border-brand-500 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-brand-100 dark:bg-brand-900 p-3 rounded-full text-brand-600 dark:text-brand-300 mr-4">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  <span className="text-2xl text-brand-600 dark:text-brand-400 mr-1">E</span>xcelencia en el Servicio
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Brindar atención profesional, personalizada y orientada a la mejor experiencia posible.
              </p>
            </div>

            {/* E - Espacios */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 p-6 border-t-4 border-gold-400 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-gold-100 dark:bg-yellow-900/30 p-3 rounded-full text-brand-800 dark:text-gold-400 mr-4">
                  <HomeIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  <span className="text-2xl text-gold-500 mr-1">E</span>spacios que Inspiran Confianza
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Crear ambientes modernos, ordenados y cómodos que transmitan tranquilidad y profesionalismo.
              </p>
            </div>

            {/* R - Respeto */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 p-6 border-t-4 border-brand-500 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-brand-100 dark:bg-brand-900 p-3 rounded-full text-brand-600 dark:text-brand-300 mr-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  <span className="text-2xl text-brand-600 dark:text-brand-400 mr-1">R</span>espeto y Empatía
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tratar a clientes, proveedores y compañeros con escucha, respeto y comprensión.
              </p>
            </div>

            {/* T - Trabajo en Equipo */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 p-6 border-t-4 border-gold-400 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="bg-gold-100 dark:bg-yellow-900/30 p-3 rounded-full text-brand-800 dark:text-gold-400 mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  <span className="text-2xl text-gold-500 mr-1">T</span>rabajo en Equipo
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Colaborar para resolver problemas, mejorar procesos y ofrecer soluciones integrales.
              </p>
            </div>

            {/* E - Evolución */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 p-6 border-t-4 border-brand-500 hover:shadow-xl transition-all md:col-span-2 lg:col-span-3 xl:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-brand-100 dark:bg-brand-900 p-3 rounded-full text-brand-600 dark:text-brand-300 mr-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  <span className="text-2xl text-brand-600 dark:text-brand-400 mr-1">E</span>volución Continua
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Aprender, mejorar y adaptarse constantemente para brindar un servicio cada vez mejor.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Internal Notice Board - Dynamic */}
      <div ref={newsSectionRef} className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 border-t border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           
           {/* HIGHLIGHTED SECTION */}
           {highlightedNews.length > 0 && (
             <div className="mb-12 animate-fade-in-up">
               <div className="flex items-center mb-6">
                 <div className="bg-gold-400 h-8 w-1 mr-3 rounded-full"></div>
                 <h3 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                   <Sparkles className="w-8 h-8 mr-3 text-gold-500 fill-current animate-pulse" />
                   Cartelera Destacada
                 </h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {highlightedNews.map(item => (
                   <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-black border-l-8 border-l-gold-400 p-8 relative overflow-hidden group hover:transform hover:-translate-y-1 transition-all duration-300">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Star className="w-32 h-32 text-gold-400" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-100 text-yellow-800 dark:bg-yellow-900 dark:text-gold-400">
                            Importante
                          </span>
                          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 flex items-center bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                             <Clock className="w-4 h-4 mr-1" />
                             {item.date}
                          </span>
                        </div>
                        <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">{item.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">{item.description}</p>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* REGULAR NEWS SECTION */}
           <div className="mt-8">
             <div className="flex items-center mb-6">
               <div className="bg-brand-600 h-8 w-1 mr-3 rounded-full"></div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Novedades Generales</h3>
             </div>
             
             <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
               {regularNews.length > 0 ? (
                 <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                   {regularNews.map((item) => (
                     <li key={item.id}>
                       <div className="px-6 py-5 hover:bg-brand-50/50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group">
                         <div className="flex items-center justify-between">
                           <p className="text-lg font-bold text-brand-800 dark:text-brand-300 truncate group-hover:text-brand-600 dark:group-hover:text-white transition-colors">{item.title}</p>
                           <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                             <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                               item.category.includes('Ventas') ? 'bg-gold-100 text-yellow-800 border-gold-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700' :
                               item.category.includes('Taller') ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700' :
                               'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                             }`}>
                               {item.category}
                             </span>
                           </div>
                         </div>
                         <div className="mt-2 sm:flex sm:justify-between">
                           <div className="sm:flex">
                             <p className="flex items-center text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                               {item.description}
                             </p>
                           </div>
                           <div className="mt-2 flex items-center text-xs text-gray-400 sm:mt-0 font-medium">
                             <Clock className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-gray-400" />
                             <p>{item.date}</p>
                           </div>
                         </div>
                       </div>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                   <div className="inline-block p-4 rounded-full bg-white dark:bg-gray-700 mb-3 shadow-sm">
                      <Clock className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                   </div>
                   <p className="text-lg font-medium">No hay novedades recientes para mostrar.</p>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
