
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const ModalPlanificadorGrupos = ({ show, onClose, curso, profesores, onSavePlanificacion }) => {
  const [numGrupos, setNumGrupos] = useState(1);
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    if (curso) {
      // Inicializa el primer grupo por defecto
      const initialGrupos = Array.from({ length: numGrupos }, (_, i) => ({
        id: i + 1,
        profesorId: '',
        estudiantes: '1',
        sesiones: [{ duracion: curso.horas_totales }] // Inicia con una sesión que cubre todas las horas
      }));
      setGrupos(initialGrupos);
    }
  }, [curso, numGrupos]);

  if (!show || !curso) return null;

  const handleGrupoChange = (index, field, value) => {
    const nuevosGrupos = [...grupos];
    nuevosGrupos[index][field] = value;
    setGrupos(nuevosGrupos);
  };

  const handleSesionChange = (grupoIndex, sesionIndex, value) => {
    const nuevosGrupos = [...grupos];
    nuevosGrupos[grupoIndex].sesiones[sesionIndex].duracion = parseInt(value, 10) || 0;
    setGrupos(nuevosGrupos);
  };

  const addSesion = (grupoIndex) => {
    const nuevosGrupos = [...grupos];
    nuevosGrupos[grupoIndex].sesiones.push({ id: Date.now(), duracion: 1 });
    setGrupos(nuevosGrupos);
  };

  const removeSesion = (grupoIndex, sesionIndex) => {
    const nuevosGrupos = [...grupos];
    if (nuevosGrupos[grupoIndex].sesiones.length > 1) { // Solo permite eliminar si hay más de una
      nuevosGrupos[grupoIndex].sesiones.splice(sesionIndex, 1);
      setGrupos(nuevosGrupos);
    }
  };

  const handleSubmit = () => {
    for (const grupo of grupos) {
      if (!grupo.profesorId || !grupo.estudiantes) {
        alert(`Por favor, complete todos los campos para el Grupo ${grupo.id}.`);
        return;
      }
      const totalHorasSesiones = grupo.sesiones.reduce((acc, sesion) => acc + sesion.duracion, 0);
      if (totalHorasSesiones !== curso.horas_totales) {
        alert(`La suma de las horas de las sesiones del Grupo ${grupo.id} (${totalHorasSesiones}h) no coincide con las horas totales del curso (${curso.horas_totales}h).`);
        return;
      }
    }
    onSavePlanificacion(curso.idCurso, grupos);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Planificar Grupos para {curso.nombre}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">Horas totales del curso: <span className="font-bold">{curso.horas_totales}</span></p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">¿Cuántos grupos tendrá este curso?</label>
            <select
              value={numGrupos}
              onChange={(e) => setNumGrupos(parseInt(e.target.value, 10))}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="1">1 Grupo</option>
              <option value="2">2 Grupos</option>
              <option value="3">3 Grupos</option>
            </select>
          </div>

          {grupos.map((grupo, grupoIndex) => {
            const totalHorasAsignadas = grupo.sesiones.reduce((acc, s) => acc + s.duracion, 0);
            const horasRestantes = curso.horas_totales - totalHorasAsignadas;

            return (
              <div key={grupo.id} className="border border-gray-300 rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-lg text-blue-700">Grupo {grupo.id}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profesor</label>
                    <select
                      value={grupo.profesorId}
                      onChange={(e) => handleGrupoChange(grupoIndex, 'profesorId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
                    >
                      <option value="">Seleccionar profesor</option>
                      {profesores.map(p => (
                        <option key={p.idProfesor} value={p.idProfesor}>{p.nombre} {p.apellido}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° Estudiantes</label>
                    <input
                      type="number"
                      value={grupo.estudiantes}
                      onChange={(e) => handleGrupoChange(grupoIndex, 'estudiantes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
                      placeholder="Ej: 30"
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sesiones por semana</label>
                  <div className="space-y-2">
                    {grupo.sesiones.map((sesion, sesionIndex) => (
                      <div key={sesionIndex} className="flex items-center gap-2">
                        <span className="block text-sm font-medium text-gray-700 mb-2">Sesión {sesionIndex + 1}:</span>
                        <input
                          type="number"
                          value={sesion.duracion}
                          onChange={(e) => handleSesionChange(grupoIndex, sesionIndex, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
                          min="1"
                          max={curso.horas_totales}
                        />
                        <span className="block text-sm font-medium text-gray-700 mb-2">horas</span>
                        {grupo.sesiones.length > 1 && (
                          <button onClick={() => removeSesion(grupoIndex, sesionIndex)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button onClick={() => addSesion(grupoIndex)} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      <Plus size={16} /> Añadir Sesión
                    </button>
                    <span className={`text-sm font-semibold ${horasRestantes === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {horasRestantes === 0 ? 'Horas completas' : `Faltan ${horasRestantes}h`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Guardar Planificación
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPlanificadorGrupos;
