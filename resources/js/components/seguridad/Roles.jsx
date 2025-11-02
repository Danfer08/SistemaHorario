import React, { useState } from 'react';
import { Shield, Plus, Search, Edit, Trash2, Eye, X, CheckCircle, Lock } from 'lucide-react';

const GestionRolesView = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRol, setSelectedRol] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [roles, setRoles] = useState([
    { 
      id: 1, 
      name: 'admin', 
      guard_name: 'web',
      usuarios: 1,
      permisos: ['crear_horario', 'gest_profesores', 'gest_cursos', 'gest_salones', 'gest_usuarios', 'gest_roles', 'admin.access', 'security.access'],
      created_at: '2025-10-11'
    },
    { 
      id: 2, 
      name: 'profesor', 
      guard_name: 'web',
      usuarios: 15,
      permisos: [],
      created_at: '2025-10-11'
    },
    { 
      id: 3, 
      name: 'coordinador', 
      guard_name: 'web',
      usuarios: 3,
      permisos: ['crear_horario', 'gest_profesores', 'gest_cursos', 'gest_salones', 'admin.access'],
      created_at: '2025-10-11'
    }
  ]);

  const permisosDisponibles = [
    { id: 1, name: 'crear_horario', descripcion: 'Crear y editar horarios', categoria: 'Horarios' },
    { id: 2, name: 'gest_profesores', descripcion: 'Gestionar profesores', categoria: 'Administración' },
    { id: 3, name: 'gest_cursos', descripcion: 'Gestionar cursos', categoria: 'Administración' },
    { id: 4, name: 'gest_salones', descripcion: 'Gestionar salones', categoria: 'Administración' },
    { id: 5, name: 'gest_usuarios', descripcion: 'Gestionar usuarios', categoria: 'Seguridad' },
    { id: 6, name: 'gest_roles', descripcion: 'Gestionar roles y permisos', categoria: 'Seguridad' },
    { id: 7, name: 'admin.access', descripcion: 'Acceso a sección Administración', categoria: 'General' },
    { id: 8, name: 'security.access', descripcion: 'Acceso a sección Seguridad', categoria: 'General' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    guard_name: 'web',
    permisos: []
  });

  const handleOpenModal = (mode, rol = null) => {
    setModalMode(mode);
    setSelectedRol(rol);
    if (rol && mode === 'edit') {
      setFormData({
        name: rol.name,
        guard_name: rol.guard_name,
        permisos: rol.permisos
      });
    } else {
      setFormData({
        name: '',
        guard_name: 'web',
        permisos: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRol(null);
  };

  const handleSubmit = () => {
    if (modalMode === 'create') {
      const newRol = {
        id: roles.length + 1,
        name: formData.name,
        guard_name: formData.guard_name,
        usuarios: 0,
        permisos: formData.permisos,
        created_at: new Date().toISOString().split('T')[0]
      };
      setRoles([...roles, newRol]);
      alert('Rol creado exitosamente');
    } else if (modalMode === 'edit') {
      setRoles(roles.map(r => 
        r.id === selectedRol.id ? { ...r, name: formData.name, permisos: formData.permisos } : r
      ));
      alert('Rol actualizado exitosamente');
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const rol = roles.find(r => r.id === id);
    if (rol.usuarios > 0) {
      alert(`No se puede eliminar el rol "${rol.name}" porque tiene ${rol.usuarios} usuario(s) asignado(s)`);
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar el rol "${rol.name}"?`)) {
      setRoles(roles.filter(r => r.id !== id));
      alert('Rol eliminado exitosamente');
    }
  };

  const togglePermiso = (permisoName) => {
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
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            Nuevo Rol
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar rol..."
            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
                <button 
                  onClick={() => handleOpenModal('edit', rol)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(rol.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {modalMode === 'create' && 'Nuevo Rol'}
                {modalMode === 'edit' && 'Editar Rol'}
                {modalMode === 'view' && 'Detalles del Rol'}
              </h3>
              <button onClick={handleCloseModal} className="text-white hover:text-blue-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Rol</label>
                <input
                  type="text"
                  disabled={modalMode === 'view'}
                  placeholder="Ej: coordinador, secretaria, etc."
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                            disabled={modalMode === 'view'}
                            onClick={() => togglePermiso(permiso.name)}
                            className={`w-full p-3 rounded-lg border-2 text-left transition ${
                              formData.permisos.includes(permiso.name)
                                ? 'bg-blue-50 border-blue-500'
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
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    {modalMode === 'create' ? 'Crear Rol' : 'Guardar Cambios'}
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

export default GestionRolesView;