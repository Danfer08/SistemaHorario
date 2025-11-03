import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Eye, Loader, AlertCircle, Trash, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAcademicYears } from '../../utils/yearsHorario';


const GestionHorariosView = ({ setCurrentView }) => {


  const { years } = useAcademicYears();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHorarioData, setNewHorarioData] = useState({ año: '2025', etapa: 'I' });

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/horarios');
      setHorarios(response.data.data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los horarios. Intente de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHorario = async () => {
    try {
      const response = await axios.post('/api/horarios', newHorarioData);
      const nuevoHorario = response.data.data;
      setShowCreateModal(false);
      // Usar la función del dashboard para cambiar de vista
      setCurrentView(`crear-horario/${nuevoHorario.idHorario}`);
    } catch (err) {
      alert('Error al crear el horario. Verifique que no exista ya un borrador para ese período.');
      console.error(err);
    }
  };
  
  const handleEdit = (horario) => {
    if (horario.estado === 'borrador') {
      setCurrentView(`crear-horario/${horario.idHorario}`);
    }
    else if (horario.estado === 'confirmado'){
        setCurrentView(`ver-horario/${horario.idHorario}`);
    }
  };

  const handleDelete = async (horario) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el horario del año ${horario.año}, etapa ${horario.etapa}? Esta acción no se puede deshacer.`)) {
      return;
    }
    try{
      await axios.delete(`/api/horarios/${horario.idHorario}`);
      alert('Horario eliminado exitosamente.');
    }catch(error){
      alert('Error al eliminar el horario. Intente de nuevo más tarde.');
      console.error(error);
      return;
    }
    fetchHorarios();

  }

  const getStatusChip = (estado) => {
    switch (estado) {
      case 'borrador':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Horarios</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <Plus size={20} />
          Crear Nuevo Horario
        </button>
      </div>

      {loading && <div className="flex justify-center items-center p-8"><Loader className="animate-spin text-blue-500" /></div>}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center gap-2"><AlertCircle size={20} /> {error}</div>}

      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {horarios.map((horario) => (
                <tr key={horario.idHorario} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{horario.año}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{horario.etapa}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(horario.estado)}`}>
                      {horario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(horario.fecha).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(horario)}
                      className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {horario.estado === 'borrador' ? <Edit size={16} /> : <Eye size={16} />}
                      {horario.estado === 'borrador' ? 'Editar' : 'Ver'}
                    </button>
                    <button
                      onClick={() => handleDelete(horario)}
                      className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Crear Nuevo Horario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <select 
                  className="w-full px-4 py-2 border text-gray-900 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={newHorarioData.año}
                  onChange={(e) => setNewHorarioData({ ...newHorarioData, año: e.target.value })}
                >
                  {years.map(year => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
                <select
                  value={newHorarioData.etapa}
                  onChange={(e) => setNewHorarioData({ ...newHorarioData, etapa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  <option value="I">I</option>
                  <option value="II">II</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Cancelar
              </button>
              <button onClick={handleCreateHorario} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Crear y Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionHorariosView;
