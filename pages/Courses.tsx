
import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Calendar, CheckCircle2, GraduationCap, Medal, Plus, ExternalLink, User } from 'lucide-react';
import { EmployeeCourse, RecommendedCourse } from '../types';
import { storageService } from '../services/storage';

export const Courses: React.FC = () => {
  const [employeeCourses, setEmployeeCourses] = useState<EmployeeCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('');
  const [hasCertificate, setHasCertificate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const eCourses = await storageService.getEmployeeCourses();
      const rCourses = await storageService.getRecommendedCourses();
      setEmployeeCourses(eCourses);
      setRecommendedCourses(rCourses);
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCourseTitle || !newPlatform) return;

    setIsSubmitting(true);

    // CREATE NEW
    const newCourse: EmployeeCourse = {
      id: Date.now().toString(),
      employeeName: newName.trim().toUpperCase(), // Normalize name
      courseTitle: newCourseTitle,
      platform: newPlatform,
      date: new Date().toLocaleDateString('es-AR'),
      hasCertificate: hasCertificate,
      timestamp: Date.now()
    };
    await storageService.addEmployeeCourse(newCourse);
    
    // Refresh list
    const updated = await storageService.getEmployeeCourses();
    setEmployeeCourses(updated);
    
    // Reset Form
    setNewCourseTitle('');
    setNewPlatform('');
    setHasCertificate(false);
    setIsSubmitting(false);
    // Keep name for convenience
  };

  // --- RANKING LOGIC ---
  const ranking = React.useMemo(() => {
    const counts: Record<string, number> = {};
    employeeCourses.forEach(c => {
      const name = c.employeeName;
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5
  }, [employeeCourses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* HEADER & RANKING SECTION */}
      <div className="bg-brand-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border-b-8 border-gold-400">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-800 opacity-50 blur-3xl"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-800 border border-brand-700 text-gold-400 font-bold text-sm mb-6">
              <Award className="w-4 h-4 mr-2" /> Programa de Capacitación 2026
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Creciendo Juntos
            </h2>
            <p className="text-brand-200 text-lg max-w-xl">
              Celebramos el aprendizaje continuo. Cada curso suma puntos para tu desarrollo profesional en Moscato Neumáticos.
            </p>
          </div>

          {/* PODIUM CARD */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-4 flex items-center text-gold-400">
              <Medal className="w-6 h-6 mr-2" /> Top Alumnos del Mes
            </h3>
            <div className="space-y-4">
              {ranking.length > 0 ? ranking.map((rank, index) => (
                <div key={rank.name} className="flex items-center justify-between p-3 rounded-lg bg-brand-800/50 border border-brand-700">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${
                      index === 0 ? 'bg-gold-400 text-brand-900' :
                      index === 1 ? 'bg-gray-300 text-gray-800' :
                      index === 2 ? 'bg-orange-400 text-white' :
                      'bg-brand-700 text-brand-200'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-bold">{rank.name}</span>
                  </div>
                  <span className="text-sm font-medium bg-brand-900 px-2 py-1 rounded text-gold-400">
                    {rank.count} {rank.count === 1 ? 'curso' : 'cursos'}
                  </span>
                </div>
              )) : (
                <p className="text-brand-300 text-center italic py-4">Aún no hay cursos registrados. ¡Sé el primero!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: ADD COURSE FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Plus className="w-6 h-6 mr-2 text-brand-600" />
              Registrar Nuevo Curso
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tu Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej: Juan Perez"
                    className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 uppercase font-medium bg-white text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Curso</label>
                <input 
                  type="text" 
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="Ej: Alineación Avanzada"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Plataforma / Institución</label>
                <input 
                  type="text" 
                  required
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  placeholder="Ej: Goodyear, YouTube, Presencial"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white text-gray-900"
                />
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input 
                  type="checkbox" 
                  id="certCheck"
                  checked={hasCertificate}
                  onChange={(e) => setHasCertificate(e.target.checked)}
                  className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300"
                />
                <label htmlFor="certCheck" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Tengo certificado / diploma
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex justify-center items-center"
              >
                {isSubmitting ? 'Guardando...' : 'Sumar a mi Historial'}
              </button>
            </form>
          </div>
        </div>

        {/* CENTER/RIGHT: RECENT ACTIVITY & RESOURCES */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Activity Feed */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-brand-600" />
                Últimos Cursos Completados
              </h3>
              <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                Total: {employeeCourses.length}
              </span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {employeeCourses.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {employeeCourses.map((course) => (
                    <li key={course.id} className="p-4 hover:bg-brand-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="font-bold text-brand-900 mr-2">{course.employeeName}</span>
                            {course.hasCertificate && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Certificado
                              </span>
                            )}
                          </div>
                          <p className="text-gray-800 font-medium">{course.courseTitle}</p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs mr-2">{course.platform}</span>
                            <Calendar className="w-3 h-3 mr-1" /> {course.date}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <GraduationCap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay actividad reciente.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Resources */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <ExternalLink className="w-6 h-6 mr-2 text-brand-600" />
              Dónde Capacitarse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedCourses.map(rec => (
                <a 
                  key={rec.id} 
                  href={rec.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase text-brand-500 tracking-wider">{rec.platform}</span>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-brand-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-700">{rec.title}</h4>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </a>
              ))}
              {recommendedCourses.length === 0 && (
                <p className="text-gray-500 italic col-span-full">No hay cursos recomendados cargados por el momento.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
