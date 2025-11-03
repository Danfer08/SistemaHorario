// components/PanelCursos.js
import React from 'react';
import { Plus, CheckCircle, Edit2, Move, Clock } from 'lucide-react';

const PanelCursos = ({ 
  cursosPendientes = [], 
  planificaciones,
  cursosAsignados = [], 
  cursosDisponibles = [],
  profesores,
  handleAbrirPlanificador,
  handleDragStart
}) => {
  
  // Validaciones para evitar errores
  const cursosPendientesSafe = Array.isArray(cursosPendientes) ? cursosPendientes : [];
  const cursosAsignadosSafe = Array.isArray(cursosAsignados) ? cursosAsignados : [];
  const cursosDisponiblesSafe = Array.isArray(cursosDisponibles) ? cursosDisponibles : [];
  
  const porcentajeProgreso = cursosDisponiblesSafe.length > 0 
    ? (cursosAsignadosSafe.length / cursosDisponiblesSafe.length) * 100 
    : 0;

  const getProfesorNombre = (profesorId) => {
    if (!profesores || profesores.length === 0) return 'N/A';
    const profesor = profesores.find(p => p.idProfesor.toString() === profesorId.toString());
    return profesor ? `${profesor.nombre} ${profesor.apellido}` : 'Profesor no encontrado';
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cursos Pendientes</h3>
        
        {cursosPendientesSafe.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Todos los cursos asignados</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {cursosPendientesSafe.map(curso => (
              <div key={curso.idCurso} className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-400 transition">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800">{curso.nombre}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                                {curso.horas_totales}h
                            </span>
                            <span className="text-xs text-gray-600">Ciclo {curso.ciclo}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                                curso.tipo_curso === 'obligatorio' 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-purple-200 text-purple-800'
                            }`}>
                                {curso.tipo_curso}
                            </span>
                            {planificaciones[curso.idCurso] && (
                                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                                    Planificado ({planificaciones[curso.idCurso].reduce((acc, g) => acc + g.sesiones.length, 0)} ses. restantes)
                                </span>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => handleAbrirPlanificador(curso)}
                        className="p-2 rounded-full hover:bg-blue-200 text-blue-600 flex-shrink-0"
                        title={planificaciones[curso.idCurso] ? "Editar Planificación" : "Planificar Curso"}
                    >
                        {planificaciones[curso.idCurso] ? (
                            <Edit2 className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- INICIO: SECCIÓN DE SESIONES PLANIFICADAS PARA ARRASTRAR --- */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sesiones Planificadas</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {Object.keys(planificaciones).length > 0 ? (
              Object.entries(planificaciones).map(([cursoId, grupos]) => {
                const curso = cursosDisponiblesSafe.find(c => c.idCurso.toString() === cursoId);
                if (!curso || grupos.every(g => g.sesiones.length === 0)) return null;

                return (
                  <div key={cursoId}>
                    {grupos.map((grupo, grupoIndex) => (
                      grupo.sesiones.length > 0 && (
                        <div key={`${cursoId}-${grupo.id}`} className="space-y-2 mb-3">
                          {grupo.sesiones.map((sesion, sesionIndex) => (
                            <div
                              key={sesion.id}
                              draggable
                              onDragStart={() => handleDragStart({ curso, grupo, duracion: sesion.duracion }, 'sesion', sesion)}
                              className="p-3 bg-gray-50 border-2 border-gray-200 rounded-lg cursor-move hover:bg-gray-100 hover:border-gray-400 transition"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 text-xs">
                                  <p className="font-bold text-gray-800">{curso.nombre} (G{grupo.id})</p>
                                  <p className="text-gray-600">{getProfesorNombre(grupo.profesorId)}</p>
                                  <p className="text-gray-600 flex items-center gap-1 mt-1"><Clock size={12} /> {sesion.duracion} horas</p>
                                </div>
                                <Move className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ))}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No hay sesiones planificadas para arrastrar.</p>
            )}
          </div>
        </div>
        {/* --- FIN: SECCIÓN DE SESIONES PLANIFICADAS --- */}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-2">Progreso:</p>
            <div className="flex justify-between mb-1">
              <span>Asignados</span>
              <span className="font-bold text-blue-600">
                {cursosAsignadosSafe.length}/{cursosDisponiblesSafe.length}
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${porcentajeProgreso}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelCursos;