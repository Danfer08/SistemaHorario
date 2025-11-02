// components/ModalAsignacion.js
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ModalAsignacion = ({ 
  showModal, 
  setShowModal, 
  cursoModal, 
  profesores, 
  salones, 
  handleAsignarCurso 
}) => {
  if (!showModal || !cursoModal) return null;
  
  const [profesorId, setProfesorId] = useState('');
  const [salonId, setSalonId] = useState('');
  const [grupo, setGrupo] = useState('1');
  const [estudiantes, setEstudiantes] = useState('');

  useEffect(() => {
    // Resetear estado cuando el modal se abre
    setProfesorId('');
    setSalonId('');
    setGrupo('1');
    setEstudiantes('');
  }, [cursoModal]);

  const handleSubmit = () => {
    if (!profesorId || !salonId || !grupo || !estudiantes) {
      alert('Por favor complete todos los campos');
      return;
    }
    
    const profesorSeleccionado = profesores.find(p => p.idProfesor === parseInt(profesorId));
    const salonSeleccionado = salones.find(s => s.idSalon === parseInt(salonId));
    
    handleAsignarCurso(profesorSeleccionado, salonSeleccionado, grupo, parseInt(estudiantes));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Asignar Detalles</h3>
          <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Curso</p>
            <p className="font-semibold text-lg">{cursoModal.nombre}</p>
            <p className="text-sm text-gray-600">{cursoModal.dia} - {cursoModal.hora}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grupo</label>
            <select 
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="1">Grupo 1</option>
              <option value="2">Grupo 2</option>
              <option value="3">Grupo 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profesor</label>
            <select 
              value={profesorId}
              onChange={(e) => setProfesorId(e.target.value)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Seleccionar profesor</option>
              {profesores.map(p => (
                <option key={p.idProfesor} value={p.idProfesor}>{p.nombre} {p.apellido}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salón</label>
            <select 
              value={salonId}
              onChange={(e) => setSalonId(e.target.value)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Seleccionar salón</option>
              {salones.map(s => (
                <option key={s.idSalon} value={s.idSalon}>{s.codigo} - Cap: {s.capacidad} ({s.tipo})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">N° Estudiantes</label>
            <input 
              type="number" 
              value={estudiantes}
              onChange={(e) => setEstudiantes(e.target.value)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Ej: 35"
              min="1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Asignar
            </button>
            <button
              onClick={() => setShowModal(false)}
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

export default ModalAsignacion;