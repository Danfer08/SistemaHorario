import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Edit, Trash2, Eye, X, User, Loader } from 'lucide-react';
import apiClient from '../../api/apiConfig';
import { useToast } from '../../contexts/ToastContext';

const GestionProfesoresView = () => {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(false);

  const [profesores, setProfesores] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0
  });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    correo: '',
    telefono: '',
    categoria: 'ordinario',
    estado: 'activo'
  });



  // No necesitamos configurar el token aquí ya que apiClient lo maneja

  // Cargar profesores al montar el componente
  useEffect(() => {
    cargarProfesores();
  }, []);

  const cargarProfesores = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/profesores');
      const profArray = response?.data?.data ?? response?.data ?? [];
      const safeProfesores = Array.isArray(profArray) ? profArray : [];
      setProfesores(safeProfesores);

      // Calcular estadísticas de forma segura
      const total = safeProfesores.length;
      const activos = safeProfesores.filter(p => (p?.estado ?? '') === 'activo').length;
      setStats({
        total,
        activos,
        inactivos: total - activos
      });

    } catch (error) {
      console.error('Error al cargar profesores:', error);
      showToast(error.response?.data?.message || 'Error al cargar los profesores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, profesor = null) => {
    setModalMode(mode);
    setSelectedProfesor(profesor);
    if (profesor && mode === 'edit') {
      setFormData({
        nombre: profesor.nombre,
        apellido: profesor.apellido,
        dni: profesor.dni,
        correo: profesor.correo,
        telefono: profesor.telefono || '',
        categoria: profesor.categoria || 'ordinario',
        estado: profesor.estado
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        correo: '',
        telefono: '',
        categoria: 'ordinario',
        estado: 'activo'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProfesor(null);
  };

  const saveProfesor = async (closeModal = true) => {
    setLoading(true);

    try {
      if (modalMode === 'create') {
        await apiClient.post('/profesores', formData);
        showToast('Profesor creado exitosamente', 'success');
        await cargarProfesores();
        if (closeModal) handleCloseModal();
      } else {
        await apiClient.put(`/profesores/${selectedProfesor.idProfesor}`, formData);
        showToast('Profesor actualizado exitosamente', 'success');
        await cargarProfesores();
        if (!closeModal) {
          console.log('Auto-saved successfully');
        }
        if (closeModal) handleCloseModal();
      }
    } catch (error) {
      console.error('Error al guardar profesor:', error);
      const msg = error.response?.data?.message || 'Error al guardar el profesor';
      showToast(msg, 'error');
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        validationErrors.forEach(err => showToast(err, 'error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfesor(true);
  };



  const handleDelete = async (profesor) => {
    if (!confirm(`¿Estás seguro de eliminar a ${profesor.nombre} ${profesor.apellido}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.delete(`/profesores/${profesor.idProfesor}`);
      if (response.data.status === 'success') {
        showToast('Profesor eliminado exitosamente', 'success');
        await cargarProfesores();
      }
    } catch (error) {
      console.error('Error al eliminar profesor:', error);
      showToast(error.response?.data?.message || 'Error al eliminar el profesor', 'error');
    } finally {
      setLoading(false);
    }
  };



  const profesoresArrayForFilter = Array.isArray(profesores) ? profesores : [];
  const term = (searchTerm || '').toString().toLowerCase();
  const filteredProfesores = profesoresArrayForFilter.filter(p => {
    const nombre = (p?.nombre || '').toString().toLowerCase();
    const apellido = (p?.apellido || '').toString().toLowerCase();
    const dni = (p?.dni || '').toString();
    const correo = (p?.correo || '').toString().toLowerCase();
    return (
      nombre.includes(term) ||
      apellido.includes(term) ||
      dni.includes(term) ||
      correo.includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Profesores</h1>
            </div>
            <p className="text-gray-600">Administra el registro de docentes y su disponibilidad horaria</p>
          </div>
          <button
            onClick={() => handleOpenModal('create')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            Nuevo Profesor
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI o correo..."
              className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black">
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Profesores</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <User className="w-12 h-12 text-blue-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Activos</p>
              <p className="text-3xl font-bold text-green-600">{stats.activos}</p>
            </div>
            <User className="w-12 h-12 text-green-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Inactivos</p>
              <p className="text-3xl font-bold text-red-600">{stats.inactivos}</p>
            </div>
            <User className="w-12 h-12 text-red-100" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Nombre Completo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">DNI</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Correo</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Carga Horaria</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProfesores.map((profesor, index) => (
                <tr key={profesor.idProfesor} className={`hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {profesor.nombre.charAt(0)}{profesor.apellido.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-black">{profesor.nombre} {profesor.apellido}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-black">{profesor.dni}</td>
                  <td className="px-6 py-4 text-black">{profesor.correo}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-600">Carga horaria</span>
                      <span className="text-sm font-semibold text-blue-600">0/20h</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profesor.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {profesor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal('edit', profesor)}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(profesor)}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition"
                        title="Eliminar"
                        disabled={loading}
                      >
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {modalMode === 'create' && 'Nuevo Profesor'}
                {modalMode === 'edit' && 'Editar Profesor'}
                {modalMode === 'view' && 'Detalles del Profesor'}
              </h3>
              <button onClick={handleCloseModal} className="text-white hover:text-blue-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Nombre</label>
                  <input
                    type="text"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Apellido</label>
                  <input
                    type="text"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">DNI</label>
                  <input
                    type="text"
                    maxLength={8}
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Correo</label>
                  <input
                    type="email"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Categoría</label>
                  <select
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  >
                    <option value="ordinario">Ordinario</option>
                    <option value="contratado">Contratado</option>
                    <option value="jefe_practica">Jefe de Práctica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Carga Horaria Máxima</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.cargaMaxima}
                    onChange={(e) => setFormData({ ...formData, cargaMaxima: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Estado</label>
                  <select
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {modalMode !== 'view' && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    {modalMode === 'create' ? 'Crear Profesor' : 'Guardar Cambios'}
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProfesoresView;