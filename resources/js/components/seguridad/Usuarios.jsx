import React, { useState } from 'react';
import { Users, Plus, Search, Edit, Trash2, Eye, X, Mail, Shield, Key, AlertCircle } from 'lucide-react';

const GestionUsuariosView = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [usuarios, setUsuarios] = useState([
    { id: 5, name: 'Danfer', email: '21131B0737@unap.edu.pe', rol: 'admin', estado: 'activo', profesor: null, created_at: '2025-10-08' },
    { id: 6, name: 'Picolo Parker', email: 'picolo@unap.edu.pe', rol: 'profesor', estado: 'activo', profesor: { id: 1, nombre: 'Luis Honorato Pita Astengo' }, created_at: '2025-10-11' },
  ]);

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

  const handleOpenModal = (mode, usuario = null) => {
    setModalMode(mode);
    setSelectedUsuario(usuario);
    if (usuario && mode === 'edit') {
      setFormData({
        name: usuario.name,
        email: usuario.email,
        password: '',
        password_confirmation: '',
        rol_id: roles.find(r => r.name === usuario.rol)?.id || '',
        profesor_id: usuario.profesor?.id || '',
        estado: usuario.estado
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
  };

  const handleSubmit = () => {
    if (formData.password !== formData.password_confirmation) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (modalMode === 'create') {
      const rolSeleccionado = roles.find(r => r.id === parseInt(formData.rol_id));
      const profesorSeleccionado = profesores.find(p => p.id === parseInt(formData.profesor_id));
      
      const newUsuario = {
        id: usuarios.length + 1,
        name: formData.name,
        email: formData.email,
        rol: rolSeleccionado?.name || 'profesor',
        estado: formData.estado,
        profesor: profesorSeleccionado || null,
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsuarios([...usuarios, newUsuario]);
      alert('Usuario creado exitosamente');
    } else if (modalMode === 'edit') {
      const rolSeleccionado = roles.find(r => r.id === parseInt(formData.rol_id));
      const profesorSeleccionado = profesores.find(p => p.id === parseInt(formData.profesor_id));
      
      setUsuarios(usuarios.map(u => 
        u.id === selectedUsuario.id ? { 
          ...u, 
          name: formData.name,
          email: formData.email,
          rol: rolSeleccionado?.name || u.rol,
          estado: formData.estado,
          profesor: profesorSeleccionado || null
        } : u
      ));
      alert('Usuario actualizado exitosamente');
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
      alert('Usuario eliminado exitosamente');
    }
  };

  const handleResetPassword = (usuario) => {
    if (window.confirm(`¿Enviar correo de restablecimiento de contraseña a ${usuario.email}?`)) {
      alert('Correo de restablecimiento enviado exitosamente');
    }
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const profesoresVinculados = 0;

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
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            Nuevo Usuario
          </button>
        </div>
      </div>

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
              <p className="text-gray-600 text-sm mb-1">Sin Vincular</p>
              <p className="text-3xl font-bold text-orange-600">{usuarios.length - profesoresVinculados}</p>
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
                          {usuario.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{usuario.name}</p>
                        <p className="text-xs text-gray-500">Creado: {usuario.created_at}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {usuario.email}
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
                      {usuario.rol}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      usuario.estado === 'activo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenModal('view', usuario)}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal('edit', usuario)}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleResetPassword(usuario)}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition"
                        title="Restablecer contraseña"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(usuario.id)}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition"
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
              <button onClick={handleCloseModal} className="text-white hover:text-blue-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    disabled={modalMode === 'view'}
                    placeholder="Nombre del usuario"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    disabled={modalMode === 'view'}
                    placeholder="usuario@unap.edu.pe"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {modalMode !== 'view' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {modalMode === 'create' ? 'Contraseña' : 'Nueva Contraseña'}
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Repetir contraseña"
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    {modalMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
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

export default GestionUsuariosView;