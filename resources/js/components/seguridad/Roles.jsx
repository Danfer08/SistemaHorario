import React, { useState, useEffect } from 'react';
import { Shield, Plus, Search, Edit, Trash2, Eye, X, CheckCircle, Lock, Loader } from 'lucide-react';
import { othersRoles } from '../../services/api';

const GestionRolesView = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRol, setSelectedRol] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [roles, setRoles] = useState([]);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesRes, permisosRes] = await Promise.all([
        othersRoles.getAll(),
        othersRoles.getPermissions()
      ]);

      if (rolesRes.success) {
        setRoles(rolesRes.data);
      } else {
        throw new Error(rolesRes.message || 'Error al cargar roles');
      }

      if (permisosRes.success) {
        setPermisosDisponibles(permisosRes.data);
      } else {
        throw new Error(permisosRes.message || 'Error al cargar permisos');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar los datos iniciales';
      setError(errorMessage);
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    permisos: []
  });

  const handleOpenModal = (mode, rol = null) => {
    setModalMode(mode);
    setSelectedRol(rol);
    setError(null); // Limpiar errores al abrir el modal

    if (rol) {
      setFormData({
        name: rol.name,
        permisos: rol.permisos
      });
    } else {
      setFormData({
        name: '',
        permisos: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRol(null);
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (modalMode === 'create') {
        const response = await othersRoles.create(formData);
        if (response.data.success) {
          setRoles([...roles, response.data.data]);
          alert('Rol creado exitosamente');
        }
      } else if (modalMode === 'edit') {
        const response = await othersRoles.update(selectedRol.id, formData);
        if (response.data.success) {
          setRoles(roles.map(r => (r.id === selectedRol.id ? response.data.data : r)));
          alert('Rol actualizado exitosamente');
        }
      }
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al guardar el rol';
      setError(errorMessage);
      console.error('Error guardando rol:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const rol = roles.find(r => r.id === id);

    if (window.confirm(`¿Estás seguro de eliminar el rol "${rol.name}"?`)) {
      setLoading(true);
      try {
        const response = await othersRoles.delete(id);
        if (response.data.success) {
          setRoles(roles.filter(r => r.id !== id));
          alert('Rol eliminado exitosamente');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar el rol';
        alert(errorMessage);
        console.error('Error eliminando rol:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePermiso = (permisoName) => {
    if (modalMode === 'view') return;

    // Prevenir la eliminación de permisos de roles protegidos
    if (modalMode === 'edit' && ['admin', 'profesor', 'coordinador'].includes(selectedRol.name)) {
      const permisoEsencial = ['admin.access', 'security.access'].includes(permisoName);
      if (selectedRol.name === 'admin' && permisoEsencial) {
        alert('No se pueden quitar permisos fundamentales del rol de administrador.');
        return;
      }
    }

    if (formData.permisos.includes(permisoName)) {
      setFormData({
        ...formData,
        permisos: formData.permisos.filter(p => p !== permisoName)
      });
    } else {
      setFormData({
        ...formData,
        permisos: [...formData.permisos, permisoName]
      });
    }
  };

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const permisosPorCategoria = permisosDisponibles.reduce((acc, permiso) => {
    if (!acc[permiso.categoria]) {
      acc[permiso.categoria] = [];
    }
    acc[permiso.categoria].push(permiso);
    return acc;
  }, {});

  if (loading && roles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Cargando roles y permisos...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Roles</h1>
            </div>
            <p className="text-gray-600">Define roles y permisos para el control de acceso</p>
          </div>
          <button 
            onClick={() => handleOpenModal('create')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Nuevo Rol
          </button>
        </div>
      </div>

      {error && !showModal && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar rol..."
            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Roles</p>
              <p className="text-3xl font-bold text-blue-600">{roles.length}</p>
            </div>
            <Shield className="w-12 h-12 text-blue-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Permisos</p>
              <p className="text-3xl font-bold text-blue-600">{permisosDisponibles.length}</p>
            </div>
            <Lock className="w-12 h-12 text-blue-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Usuarios Asignados</p>
              <p className="text-3xl font-bold text-blue-600">
                {roles.reduce((sum, r) => sum + r.usuarios, 0)}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-blue-100" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredRoles.map((rol) => (
          <div key={rol.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <div className={`p-4 ${
              rol.name === 'admin' ? 'bg-purple-600' :
              rol.name === 'coordinador' ? 'bg-blue-600' :
              'bg-green-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-white" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{rol.name}</h3>
                    <p className="text-sm text-white text-opacity-90">{rol.usuarios} usuario(s)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Permisos Asignados:</p>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">{rol.permisos.length}</span>
                  <span className="text-sm text-gray-600">de {permisosDisponibles.length}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(rol.permisos.length / permisosDisponibles.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {rol.permisos.length > 0 ? (
                  rol.permisos.map((permiso, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{permiso}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">Sin permisos asignados</p>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => handleOpenModal('view', rol)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
                <button 
                  onClick={() => handleOpenModal('edit', rol)}
                  disabled={loading || ['admin', 'profesor'].includes(rol.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title={['admin', 'profesor'].includes(rol.name) ? 'Rol protegido, no se puede editar' : 'Editar rol'}
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(rol.id)}
                  disabled={loading || ['admin', 'profesor', 'coordinador'].includes(rol.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title={['admin', 'profesor', 'coordinador'].includes(rol.name) ? 'Rol protegido, no se puede eliminar' : 'Eliminar rol'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredRoles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron roles que coincidan con la búsqueda.
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {modalMode === 'create' && 'Nuevo Rol'}
                {modalMode === 'edit' && 'Editar Rol'}
                {modalMode === 'view' && 'Detalles del Rol'}
              </h3>
              <button onClick={handleCloseModal} disabled={loading} className="text-white hover:text-blue-100 disabled:opacity-50">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Rol</label>
                <input
                  type="text"
                  disabled={modalMode === 'view' || loading}
                  placeholder="Ej: coordinador, secretaria, etc."
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Permisos</label>
                  <span className="text-sm text-gray-600">
                    {formData.permisos.length} de {permisosDisponibles.length} seleccionados
                  </span>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {Object.keys(permisosPorCategoria).map(categoria => (
                    <div key={categoria}>
                      <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                        {categoria}
                      </h4>
                      <div className="space-y-2">
                        {permisosPorCategoria[categoria].map(permiso => (
                          <button
                            key={permiso.id}
                            type="button"
                            disabled={modalMode === 'view' || loading}
                            onClick={() => togglePermiso(permiso.name)}
                            className={`w-full p-3 rounded-lg border-2 text-left transition ${
                              formData.permisos.includes(permiso.name)
                                ? 'bg-blue-50 border-blue-500 shadow-inner'
                                : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                            } ${modalMode === 'view' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{permiso.name}</p>
                                <p className="text-xs text-gray-600 mt-1">{permiso.descripcion}</p>
                              </div>
                              {formData.permisos.includes(permiso.name) && (
                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {modalMode !== 'view' && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    {modalMode === 'create' ? 'Crear Rol' : 'Guardar Cambios'}
                  </button>
                  <button
                    onClick={handleCloseModal}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
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

export default GestionRolesView;