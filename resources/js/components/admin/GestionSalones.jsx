import React, { useState, useEffect } from 'react';
import { Factory, Plus, Search, Edit, Trash2, Eye, X, Users, Monitor, CheckCircle, XCircle, Loader } from 'lucide-react';
import apiClient from '../../api/apiConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const GestionSalonesView = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [loading, setLoading] = useState(false);

  const [salones, setSalones] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    habilitados: 0,
    deshabilitados: 0
  });

  const [formData, setFormData] = useState({
    codigo: '',
    capacidad: 30,
    tipo: 'normal',
    disponibilidad: 'habilitado',
    pabellon: 'A',
    piso: '1',
    equipamiento: []
  });

  const equipamientoOpciones = [
    'Proyector',
    'Pizarra',
    'Pizarra Digital',
    'Computadoras',
    'Aire acondicionado',
    'Audio',
    'Micrófonos'
  ];

  useEffect(() => {
    cargarSalones();
  }, []);

  const cargarSalones = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/salones');
      const salonesArray = response?.data?.data ?? response?.data ?? [];
      const safeSalones = Array.isArray(salonesArray) ? salonesArray : [];
      setSalones(safeSalones);

      // Calcular estadísticas de forma segura
      const total = safeSalones.length;
      const habilitados = safeSalones.filter(s => (s?.disponibilidad ?? '') === 'habilitado').length;
      setStats({
        total,
        habilitados,
        deshabilitados: total - habilitados
      });

    } catch (err) {
      showToast(err.response?.data?.message || 'Error al cargar los salones', 'error');
      console.error('Error al cargar salones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalMode === 'create') {
        await apiClient.post('/salones', formData);
        showToast('Salón creado exitosamente', 'success');
        await cargarSalones();
        setShowModal(false);
        resetForm();
      } else {
        await apiClient.put(`/salones/${selectedSalon.idSalon}`, formData);
        showToast('Salón actualizado exitosamente', 'success');
        await cargarSalones();
        setShowModal(false);
        resetForm();
      }
    } catch (err) {
      console.error('Error al guardar salón:', err);
      const msg = err.response?.data?.message || 'Error al guardar el salón';
      showToast(msg, 'error');
      if (err.response?.data?.errors) {
        // Mostrar errores de validación específicos
        const validationErrors = Object.values(err.response.data.errors).flat();
        validationErrors.forEach(error => showToast(error, 'error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      showToast('Error: Identificador de salón no válido', 'error');
      return;
    }

    if (!window.confirm('¿Estás seguro de deshabilitar este salón?')) return;

    setLoading(true);
    try {
      await apiClient.delete(`/salones/${id}`);
      showToast('Salón deshabilitado exitosamente', 'success');
      await cargarSalones();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al eliminar el salón';
      showToast('Error: ' + msg, 'error');
      console.error('Error al eliminar salón:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, salon = null) => {
    setModalMode(mode);
    setSelectedSalon(salon);
    if (salon && mode === 'edit') {
      setFormData({
        codigo: salon.codigo,
        capacidad: salon.capacidad,
        tipo: salon.tipo,
        disponibilidad: salon.disponibilidad,
        pabellon: salon.pabellon,
        piso: salon.piso,
        equipamiento: salon.equipamiento || []
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      capacidad: 30,
      tipo: 'normal',
      disponibilidad: 'habilitado',
      pabellon: 'A',
      piso: '1',
      equipamiento: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEquipamientoChange = (item) => {
    setFormData(prev => ({
      ...prev,
      equipamiento: prev.equipamiento.includes(item)
        ? prev.equipamiento.filter(i => i !== item)
        : [...prev.equipamiento, item]
    }));
  };

  const salonesArrayForFilter = Array.isArray(salones) ? salones : [];
  const term = (searchTerm || '').toString().toLowerCase();
  const filteredSalones = salonesArrayForFilter
    .filter(salon => {
      const codigo = (salon?.codigo || '').toString().toLowerCase();
      const pabellon = (salon?.pabellon || '').toString().toLowerCase();
      return codigo.includes(term) || pabellon.includes(term);
    })
    .filter(salon => !filterTipo || salon?.tipo === filterTipo)
    .filter(salon => !filterEstado || salon?.disponibilidad === filterEstado);


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Salones</h1>
        <p className="mt-2 text-gray-600">Administra los salones y laboratorios de la facultad</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Salones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Factory className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Habilitados</p>
              <p className="text-2xl font-bold text-green-600">{stats.habilitados}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deshabilitados</p>
              <p className="text-2xl font-bold text-red-600">{stats.deshabilitados}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por código o pabellón..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Todos los tipos</option>
                <option value="normal">Normal</option>
                <option value="laboratorio">Laboratorio</option>
              </select>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Todos los estados</option>
                <option value="habilitado">Habilitado</option>
                <option value="deshabilitado">Deshabilitado</option>
              </select>
              <button
                onClick={() => handleOpenModal('create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span>Nuevo Salón</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}


      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Lista de Salones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipamiento</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSalones.map((salon) => (
                <tr key={salon.idSalon || salon.id || salon.codigo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{salon.codigo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{salon.capacidad} personas</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${salon.tipo === 'laboratorio'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                      }`}>
                      {salon.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${salon.disponibilidad === 'habilitado'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {salon.disponibilidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Pabellón {salon.pabellon} - Piso {salon.piso}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {salon.equipamiento?.map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal('edit', salon)}
                      className="text-black hover:bg-gray-100 p-1 rounded mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(salon.idSalon)}
                      className="text-black hover:bg-gray-100 p-1 rounded"
                      title="Deshabilitar Salón"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Capacidad
                    </label>
                    <input
                      type="number"
                      name="capacidad"
                      value={formData.capacidad}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Tipo
                    </label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    >
                      <option value="normal">Normal</option>
                      <option value="laboratorio">Laboratorio</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Estado
                  </label>
                  <select
                    name="disponibilidad"
                    value={formData.disponibilidad}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  >
                    <option value="habilitado">Habilitado</option>
                    <option value="deshabilitado">Deshabilitado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Equipamiento
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {equipamientoOpciones.map((item) => (
                      <label key={item} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.equipamiento.includes(item)}
                          onChange={() => handleEquipamientoChange(item)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center"><Loader className="w-4 h-4 mr-2 animate-spin" />Guardando...</span>
                  ) : (
                    modalMode === 'create' ? 'Crear Salón' : 'Actualizar Salón'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default GestionSalonesView;