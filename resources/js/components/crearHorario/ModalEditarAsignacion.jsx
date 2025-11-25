import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const ModalEditarAsignacion = ({ show, onClose, asignacion, profesores, onSave }) => {
  const [profesorId, setProfesorId] = useState('');

  useEffect(() => {
    if (asignacion && asignacion.profesor) {
      setProfesorId(asignacion.profesor.id);
    }
  }, [asignacion]);

  if (!show || !asignacion) return null;

  const handleSubmit = () => {
    if (!profesorId) {
      alert('Debe seleccionar un profesor');
      return;
    }
    onSave(asignacion.id, profesorId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Editar Asignación</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Curso</p>
            <p className="font-bold text-blue-900">{asignacion.nombre}</p>
            <p className="text-sm text-gray-600 mt-2">Horario</p>
            <p className="font-medium">{asignacion.dia} {asignacion.hora} - {asignacion.hora_fin}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profesor</label>
            <select
              value={profesorId}
              onChange={(e) => setProfesorId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Seleccionar profesor</option>
              {profesores.map(p => (
                <option key={p.idProfesor} value={p.idProfesor}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Save size={18} /> Guardar Cambios
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

export default ModalEditarAsignacion;
