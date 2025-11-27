import React from 'react';
import { ShieldCheck, Users, Zap, Heart, Star, CheckCircle, Home as HomeIcon, Clock, Eye } from 'lucide-react';
import { NewsItem } from '../types';

interface HomeProps {
  news: NewsItem[];
}

export const Home: React.FC<HomeProps> = ({ news }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-brand-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
          
          <p className="text-lg md:text-xl text-brand-200 max-w-3xl mx-auto font-light mt-6">
            Más de 45 años brindando calidad y confianza en Rosario.
          </p>
          <div className="mt-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-gold-400 bg-brand-800 text-gold-400 font-semibold text-sm">
              <CheckCircle className="w-4 h-4 mr-2" /> Portal Interno Oficial
            </span>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Misión */}
            <div className="bg-brand-50 rounded-2xl p-8 border-l-8 border-brand-600 shadow-sm">
              <h2 className="text-2xl font-bold text-brand-900 mb-4 flex items-center">
                <span className="bg-brand-600 text-white p-2 rounded-lg mr-3">
                  <CheckCircle className="w-6 h-6" />
                </span>
                Nuestra Misión
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Ofrecemos servicios de venta de neumáticos y mecánica especializada para garantizar la seguridad vial, el confort en el andar y cuidar la vida útil de los vehículos.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                Optimizamos los tiempos de reparación, destacándonos por un trato personalizado, profesional y cordial hacia nuestros clientes.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4 font-medium">
                Impulsamos un entorno laboral donde las personas son felices y fomentamos el desarrollo profesional.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-gold-50 rounded-2xl p-8 border-l-8 border-gold-400 shadow-sm">
              <h2 className="text-2xl font-bold text-brand-900 mb-4 flex items-center">
                <span className="bg-gold-400 text-brand-900 p-2 rounded-lg mr-3">
                  <Star className="w-6 h-6" />
                </span>
                Nuestra Visión
              </h2>
              <p className="text-gray-700 leading-relaxed italic">
                “Consolidar nuestro legado como una gomería reconocida por su excelencia en Rosario y evolucionar en los próximos 2 años hacia un referente en servicios mecánicos integrales, alcanzando los estándares de calidad y atención propios de los servicios posventa de las principales agencias automotrices.
              </p>
              <p className="text-gray-700 leading-relaxed italic mt-4">
                Queremos mantener la calidad y confianza que nos han distinguido por más de 45 años, mientras incorporamos tecnología y procesos innovadores para brindar soluciones completas a nuestros clientes, apoyando además desde nuestra posición empresarial, causas nobles y fomentamos el arte en nuestra comunidad.”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/90 backdrop-blur-sm rounded-3xl my-8">
        <div className="text-center mb-12">
          <h2 className="text-base text-brand-600 font-bold tracking-wide uppercase">Nuestra Identidad</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Valores Institucionales
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Los pilares que sostienen nuestro trabajo diario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Valor 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-brand-500 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <div className="bg-brand-100 p-3 rounded-full text-brand-600 mr-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Compromiso con la Seguridad</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Priorizar la seguridad de los clientes a través de productos de alta calidad y servicios confiables.
            </p>
          </div>

          {/* Valor 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-gold-400 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <div className="bg-gold-100 p-3 rounded-full text-brand-800 mr-4">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Responsabilidad y Transparencia</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Actuar con honestidad en cada diagnóstico y presupuesto.
            </p>
          </div>

          {/* Valor 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-brand-500 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <div className="bg-brand-100 p-3 rounded-full text-brand-600 mr-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Excelencia en el Servicio</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Brindar atención personalizada con profesionalismo y buena disposición en cada interacción e instalaciones acordes para que el cliente se sienta a gusto.
            </p>
          </div>

          {/* Valor 4 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-gold-400 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <div className="bg-gold-100 p-3 rounded-full text-brand-800 mr-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Innovación Continua</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Adoptar tecnologías avanzadas y prácticas eficientes, acompañado de la formación constante de nuestro equipo.
            </p>
          </div>

          {/* Valor 5 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-brand-500 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <div className="bg-brand-100 p-3 rounded-full text-brand-600 mr-4">
                <HomeIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Espacios que inspiran confianza</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Tener instalaciones modernas y confortables para la mejor experiencia del cliente.
            </p>
          </div>

          {/* Valor 6 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-gold-400 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <div className="bg-gold-100 p-3 rounded-full text-brand-800 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Trabajo en Equipo</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Fomentar la colaboración interna y con aliados estratégicos para ofrecer soluciones integrales.
            </p>
          </div>

          {/* Valor 7 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-brand-500 hover:shadow-xl transition-all md:col-span-2 lg:col-span-3 xl:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-brand-100 p-3 rounded-full text-brand-600 mr-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Respeto y Empatía</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Tratar a cada cliente, colaborador y proveedor con respeto y empatía, entendiendo sus necesidades y expectativas.
            </p>
          </div>

        </div>
      </div>
      
      {/* Internal Notice Board - Dynamic */}
      <div className="bg-gray-50/90 backdrop-blur-sm py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-center mb-6">
             <div className="bg-brand-600 h-8 w-1 mr-3"></div>
             <h3 className="text-2xl font-bold text-gray-900">Novedades Internas</h3>
           </div>
           
           <div className="bg-white shadow-md overflow-hidden sm:rounded-lg border border-gray-200">
             {news.length > 0 ? (
               <ul className="divide-y divide-gray-200">
                 {news.map((item) => (
                   <li key={item.id}>
                     <div className="px-4 py-5 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors">
                       <div className="flex items-center justify-between">
                         <p className="text-base font-bold text-brand-700 truncate">{item.title}</p>
                         <div className="ml-2 flex-shrink-0 flex">
                           <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                             item.category.includes('Ventas') ? 'bg-gold-100 text-yellow-800 border-gold-200' :
                             item.category.includes('Taller') ? 'bg-blue-100 text-blue-800 border-blue-200' :
                             'bg-gray-100 text-gray-800 border-gray-200'
                           }`}>
                             {item.category}
                           </span>
                         </div>
                       </div>
                       <div className="mt-2 sm:flex sm:justify-between">
                         <div className="sm:flex">
                           <p className="flex items-center text-sm text-gray-500">
                             {item.description}
                           </p>
                         </div>
                         <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                           <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                           <p>{item.date}</p>
                         </div>
                       </div>
                     </div>
                   </li>
                 ))}
               </ul>
             ) : (
               <div className="p-6 text-center text-gray-500">
                 No hay novedades recientes para mostrar.
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};