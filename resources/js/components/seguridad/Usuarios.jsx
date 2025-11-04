import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Eye, X, Mail, Shield, Key, AlertCircle, Loader } from 'lucide-react';
import { UsuariosServicio } from '../../services/api';

const GestionUsuariosView = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  const profesores = [];

  const roles = [
    { id: 1, name: 'admin', permisos: 8 },
    { id: 2, name: 'profesor', permisos: 1 },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    rol_id: '',
    profesor_id: '',
    estado: 'activo'
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await UsuariosServicio.getAll();
      
      // Adaptar la estructura de la API
      let usuariosData = [];
      
      if (response.success && Array.isArray(response.data)) {
        usuariosData = response.data.map(usuario => ({
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
          rol: usuario.roles && usuario.roles.length > 0 ? usuario.roles[0] : 'sin rol',
          estado: usuario.estado || 'activo',
          profesor: usuario.profesor || null,
          created_at: usuario.created_at || new Date().toISOString().split('T')[0],
          es_profesor: usuario.es_profesor,
          es_admin: usuario.es_admin
        }));
      } else {
        console.warn('Formato de respuesta inesperado:', response);
        usuariosData = [];
      }
      
      setUsuarios(usuariosData);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error cargando usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, usuario = null) => {
  setModalMode(mode);
  setSelectedUsuario(usuario);
  
  if (usuario) {
    setFormData({
      name: usuario.name || '',
      email: usuario.email || '',
      password: '',
      password_confirmation: '',
      rol_id: roles.find(r => r.name === usuario.rol)?.id || '',
      profesor_id: usuario.profesor?.dataprofesor?.idProfesor || '',
      estado: usuario.estado || 'activo'
    });
  } else {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      rol_id: '',
      profesor_id: '',
      estado: 'activo'
    });
  }
  
  setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUsuario(null);
    setShowPassword(false);
    setError(null);
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.password_confirmation) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (modalMode === 'create' && !formData.password) {
      alert('La contraseña es requerida para crear un usuario');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rolSeleccionado = roles.find(r => r.id === parseInt(formData.rol_id));
      
      console.log("rol selecionado", rolSeleccionado);
      console.log("iddel rol : ", formData.rol_id);
      // Preparar datos para la API según la estructura esperada
      const usuarioData = {
        name: formData.name,
        email: formData.email,
        role: parseInt(formData.rol_id)
      };

      // Solo incluir password si se está creando o modificando
      if (formData.password) {
        usuarioData.password = formData.password;
        usuarioData.password_confirmation = formData.password_confirmation;
      }

      if (modalMode === 'create') {
        await UsuariosServicio.create(usuarioData);
        alert('Usuario creado exitosamente');
      } else if (modalMode === 'edit') {
        await UsuariosServicio.update(selectedUsuario.id, usuarioData);
        alert('Usuario actualizado exitosamente');
      }

      // Recargar la lista de usuarios
      await cargarUsuarios();
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al guardar el usuario';
      setError(errorMessage);
      console.error('Error guardando usuario:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setLoading(true);
      try {
        await UsuariosServicio.delete(id);
        alert('Usuario eliminado exitosamente');
        await cargarUsuarios();
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar el usuario';
        alert(errorMessage);
        console.error('Error eliminando usuario:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetPassword = (usuario) => {
    if (window.confirm(`¿Enviar correo de restablecimiento de contraseña a ${usuario.email}?`)) {
      alert('Correo de restablecimiento enviado exitosamente');
    }
  };

  // Filtrar usuarios
  const filteredUsuarios = usuarios.filter(u => 
    (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (u.rol?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Contar profesores vinculados
  const profesoresVinculados = usuarios.filter(u => u.profesor).length;

  if (loading && usuarios.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Cargando usuarios...</p>
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
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
            </div>
            <p className="text-gray-600">Administra las cuentas de acceso al sistema</p>
          </div>
          <button 
            onClick={() => handleOpenModal('create')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Nuevo Usuario
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o rol..."
            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold text-blue-600">{usuarios.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Activos</p>
              <p className="text-3xl font-bold text-green-600">
                {usuarios.filter(u => u.estado === 'activo').length}
              </p>
            </div>
            <Shield className="w-12 h-12 text-green-100" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Profesores Vinculados</p>
              <p className="text-3xl font-bold text-green-600">{profesoresVinculados}</p>
            </div>
            <Users className="w-12 h-12 text-green-100" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Sin Vincular</p>
              <p className="text-3xl font-bold text-orange-600">
                {usuarios.filter(u => u.es_profesor && !u.profesor).length}
              </p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-100" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Usuario</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Rol</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Profesor Vinculado</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsuarios.map((usuario, index) => (
                <tr key={usuario.id} className={`hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {(usuario.name?.charAt(0) || 'U').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{usuario.name || 'Sin nombre'}</p>
                        <p className="text-xs text-gray-500">
                          ID: {usuario.id} • Creado: {usuario.created_at}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {usuario.email || 'Sin email'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      usuario.rol === 'admin' 
                        ? 'bg-purple-100 text-purple-700'
                        : usuario.rol === 'coordinador'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {usuario.rol || 'Sin rol'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {usuario.profesor ? (
                      <div className="text-sm text-gray-700">
                        <div className="font-medium">
                          {usuario.profesor.dataprofesor.nombre} {usuario.profesor.dataprofesor.apellido}
                        </div>
                        <div className="text-xs text-gray-500">
                          DNI: {usuario.profesor.dataprofesor.dni}
                        </div>
                      </div>
                    ) : (
                      <span className="text-orange-600 text-sm">No vinculado</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      usuario.estado === 'activo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {usuario.estado || 'activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenModal('view', usuario)}
                        disabled={loading}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal('edit', usuario)}
                        disabled={loading}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(usuario.id)}
                        disabled={loading}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsuarios.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {usuarios.length === 0 
                ? 'No hay usuarios registrados' 
                : 'No se encontraron usuarios que coincidan con la búsqueda'}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {modalMode === 'create' && 'Nuevo Usuario'}
                {modalMode === 'edit' && 'Editar Usuario'}
                {modalMode === 'view' && 'Detalles del Usuario'}
              </h3>
              <button 
                onClick={handleCloseModal} 
                disabled={loading}
                className="text-white hover:text-blue-100 disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    disabled={modalMode === 'view' || loading}
                    placeholder="Nombre del usuario"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico @unap.edu.pe</label>
                  <input
                    type="email"
                    disabled={modalMode === 'view' || loading}
                    placeholder="usuario@unap.edu.pe"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {modalMode !== 'view' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-gray-900">
                        {modalMode === 'create' ? 'Contraseña' : 'Nueva Contraseña'}
                        {modalMode === 'edit'}
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        disabled={loading}
                        placeholder={modalMode === 'create' ? "Mínimo 8 caracteres" : "Nueva contraseña"}
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        disabled={loading}
                        placeholder="Repetir contraseña"
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showPassword}
                          onChange={(e) => setShowPassword(e.target.checked)}
                          disabled={loading}
                          className="rounded border-gray-300"
                        />
                        Mostrar contraseñas
                      </label>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                  <select
                    disabled={modalMode === 'view' || loading}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                    value={formData.rol_id}
                    onChange={(e) => setFormData({...formData, rol_id: e.target.value})}
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.permisos} permisos)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    disabled={modalMode === 'view' || loading}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
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
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    {modalMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
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

export default GestionUsuariosView;