
import React, { useState, useEffect } from 'react';
import { RecommendedCourse, EmployeeCourse } from '../../types';
import { storageService } from '../../services/storage';
import { Plus, Edit2, X, Save, Trash2, ExternalLink, GraduationCap, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

export const AdminCourses: React.FC = () => {
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
  const [employeeCourses, setEmployeeCourses] = useState<EmployeeCourse[]>([]);
  
  const [newRecCourse, setNewRecCourse] = useState<Partial<RecommendedCourse>>({ title: '', platform: '', description: '', link: '' });
  const [editingRecCourseId, setEditingRecCourseId] = useState<string | null>(null);

  const [editingEmpCourseId, setEditingEmpCourseId] = useState<string | null>(null);
  const [empCourseForm, setEmpCourseForm] = useState<Partial<EmployeeCourse>>({});

  useEffect(() => {
    const loadCourses = async () => {
      const rCourses = await storageService.getRecommendedCourses();
      const eCourses = await storageService.getEmployeeCourses();
      setRecommendedCourses(rCourses);
      setEmployeeCourses(eCourses);
    };
    loadCourses();
  }, []);

  // --- RECOMMENDED COURSES LOGIC ---
  const submitRecCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecCourse.title || !newRecCourse.link) return;

    if (editingRecCourseId) {
      const updatedCourse: RecommendedCourse = {
        ...(newRecCourse as RecommendedCourse),
        id: editingRecCourseId
      };
      await storageService.updateRecommendedCourse(updatedCourse);
      setRecommendedCourses(recommendedCourses.map(c => c.id === editingRecCourseId ? updatedCourse : c));
      setEditingRecCourseId(null);
      setNewRecCourse({ title: '', platform: '', description: '', link: '' });
    } else {
      const course: RecommendedCourse = {
        id: Date.now().toString(),
        title: newRecCourse.title!,
        platform: newRecCourse.platform || 'General',
        description: newRecCourse.description || '',
        link: newRecCourse.link!
      };
      await storageService.addRecommendedCourse(course);
      setRecommendedCourses([course, ...recommendedCourses]);
      setNewRecCourse({ title: '', platform: '', description: '', link: '' });
    }
  };

  const deleteRecCourse = async (id: string) => {
    if (confirm('¿Eliminar esta recomendación?')) {
      await storageService.deleteRecommendedCourse(id);
      setRecommendedCourses(recommendedCourses.filter(c => c.id !== id));
    }
  };

  const handleEditRecCourse = (course: RecommendedCourse) => {
    setNewRecCourse({ ...course });
    setEditingRecCourseId(course.id);
  };

  // --- EMPLOYEE COURSES LOGIC ---
  const handleEditEmpCourse = (course: EmployeeCourse) => {
    setEmpCourseForm({ ...course });
    setEditingEmpCourseId(course.id);
  };

  const handleUpdateEmpCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmpCourseId || !empCourseForm.employeeName || !empCourseForm.courseTitle) return;

    const updatedCourse: EmployeeCourse = {
      ...(empCourseForm as EmployeeCourse),
      id: editingEmpCourseId
    };

    await storageService.updateEmployeeCourse(updatedCourse);
    setEmployeeCourses(employeeCourses.map(c => c.id === editingEmpCourseId ? updatedCourse : c));
    setEditingEmpCourseId(null);
    setEmpCourseForm({});
  };

  const deleteEmpCourse = async (id: string) => {
    if (confirm('¿Eliminar este registro de curso de empleado?')) {
      await storageService.deleteEmployeeCourse(id);
      setEmployeeCourses(employeeCourses.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* SECTION 1: RECOMMENDED COURSES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`bg-gray-50 p-6 rounded-lg border h-fit ${editingRecCourseId ? 'border-orange-400' : 'border-gray-200'}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            {editingRecCourseId ? <Edit2 className="w-5 h-5 mr-2 text-orange-500" /> : <Plus className="w-5 h-5 mr-2" />}
            {editingRecCourseId ? 'Editar Recomendación' : 'Agregar Curso Recomendado'}
          </h3>
          <form onSubmit={submitRecCourse} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input type="text" required value={newRecCourse.title} onChange={e => setNewRecCourse({...newRecCourse, title: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plataforma</label>
              <input type="text" placeholder="Ej: Goodyear, YouTube" value={newRecCourse.platform} onChange={e => setNewRecCourse({...newRecCourse, platform: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" required value={newRecCourse.link} onChange={e => setNewRecCourse({...newRecCourse, link: e.target.value})} className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border p-2 bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea rows={2} value={newRecCourse.description} onChange={e => setNewRecCourse({...newRecCourse, description: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white" />
            </div>
            <div className="flex gap-2">
              {editingRecCourseId && (
                <button type="button" onClick={() => { setEditingRecCourseId(null); setNewRecCourse({ title: '', platform: '', description: '', link: '' }); }} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-md hover:bg-gray-300">Cancelar</button>
              )}
              <button type="submit" className={`flex-1 text-white font-bold py-2 rounded-md ${editingRecCourseId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-brand-600 hover:bg-brand-700'}`}>Guardar</button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recomendaciones Activas</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {recommendedCourses.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recommendedCourses.map(course => (
                  <li key={course.id} className="p-4 flex justify-between items-start hover:bg-gray-50">
                    <div>
                      <h4 className="font-bold text-brand-800 flex items-center">
                        {course.title} 
                        <a href={course.link} target="_blank" rel="noreferrer" className="ml-2 text-gray-400 hover:text-brand-600"><ExternalLink className="w-3 h-3" /></a>
                      </h4>
                      <p className="text-xs text-gray-500 font-bold uppercase">{course.platform}</p>
                      <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button onClick={() => handleEditRecCourse(course)} className="p-2 text-gray-400 hover:text-orange-500"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteRecCourse(course.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p className="p-4 text-gray-500 text-sm">No hay cursos recomendados.</p>}
          </div>
        </div>
      </div>

      {/* SECTION 2: EMPLOYEE ACTIVITY LOG */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <GraduationCap className="w-6 h-6 mr-2 text-brand-600" />
          Historial de Capacitación del Personal
        </h3>
        
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Empleado</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Curso / Plataforma</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Certificado</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeCourses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50">
                  {editingEmpCourseId === course.id ? (
                    <>
                      <td className="px-6 py-4"><input type="text" value={empCourseForm.date} onChange={e => setEmpCourseForm({...empCourseForm, date: e.target.value})} className="border rounded w-24 text-xs p-1" /></td>
                      <td className="px-6 py-4"><input type="text" value={empCourseForm.employeeName} onChange={e => setEmpCourseForm({...empCourseForm, employeeName: e.target.value})} className="border rounded w-full text-xs p-1 font-bold" /></td>
                      <td className="px-6 py-4">
                        <input type="text" value={empCourseForm.courseTitle} onChange={e => setEmpCourseForm({...empCourseForm, courseTitle: e.target.value})} className="border rounded w-full text-xs p-1 mb-1" placeholder="Curso" />
                        <input type="text" value={empCourseForm.platform} onChange={e => setEmpCourseForm({...empCourseForm, platform: e.target.value})} className="border rounded w-full text-xs p-1" placeholder="Plataforma" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" checked={empCourseForm.hasCertificate} onChange={e => setEmpCourseForm({...empCourseForm, hasCertificate: e.target.checked})} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={handleUpdateEmpCourse} className="text-green-600 font-bold text-xs mr-2">Guardar</button>
                        <button onClick={() => setEditingEmpCourseId(null)} className="text-gray-500 text-xs">Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{course.employeeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="font-medium">{course.courseTitle}</div>
                        <div className="text-xs text-gray-500">{course.platform}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {course.hasCertificate ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">-</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditEmpCourse(course)} className="text-indigo-600 hover:text-indigo-900 mr-3"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteEmpCourse(course.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
