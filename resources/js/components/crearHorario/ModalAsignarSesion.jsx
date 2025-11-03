import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ModalAsignarSesion = ({ 
  show, 
  onClose, 
  sesion, 
  salones,
  onAsignar 
}) => {
  const [salonId, setSalonId] = useState('');

  useEffect(() => {
    setSalonId('');
  }, [sesion]);

  if (!show || !sesion) return null;

  const handleSubmit = () => {
    if (!salonId) {
      alert('Por favor, seleccione un salón.');
      return;
    }
    onAsignar(parseInt(salonId));
  };

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Asignar Salón a Sesión</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Curso: <span className="font-semibold text-lg">{sesion.curso.nombre} (G{sesion.grupo.id})</span></p>
            <p className="text-sm text-gray-600">Horario: <span className="font-semibold">{sesion.dia} de {sesion.hora_inicio} a {sesion.hora_fin}</span></p>
            <p className="text-sm text-gray-600">Duración: <span className="font-semibold">{sesion.duracion} horas</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salón</label>
            <select 
              value={salonId}
              onChange={(e) => setSalonId(e.target.value)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Seleccionar un salón</option>
              {salones.map(s => (
                <option key={s.idSalon} value={s.idSalon}>{s.codigo} - Cap: {s.capacidad} ({s.tipo})</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Asignar
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

export default ModalAsignarSesion;
