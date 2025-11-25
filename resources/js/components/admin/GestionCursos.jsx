import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit, Trash2, Eye, X, Clock, Award, Filter, Loader } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../contexts/ToastContext';

const GestionCursosView = () => {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCiclo, setFilterCiclo] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [loading, setLoading] = useState(false);

  const [cursos, setCursos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    obligatorios: 0,
    electivos: 0,
    total_horas: 0
  });

  const [formData, setFormData] = useState({
    nombre: '',
    ciclo: '1',
    tipo_curso: 'obligatorio',
    horas_teoria: 0,
    horas_practica: 0,
    horas_totales: 0,
    descripcion: ''
  });

  // Configurar axios con token de autenticación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Cargar cursos al montar el componente
  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/cursos');
      // Manejar distintas formas de respuesta y proteger contra undefined
      const cursosArray = response?.data?.data ?? response?.data ?? [];
      const statsData = response?.data?.stats ?? response?.stats ?? {
        total: 0,
        obligatorios: 0,
        electivos: 0,
        total_horas: 0
      };
      setCursos(Array.isArray(cursosArray) ? cursosArray : []);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      showToast('Error al cargar los cursos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, curso = null) => {
    setModalMode(mode);
    setSelectedCurso(curso);
    if (curso && mode === 'edit') {
      setFormData({
        nombre: curso.nombre,
        ciclo: curso.ciclo,
        tipo_curso: curso.tipo_curso,
        horas_teoria: curso.horas_teoria,
        horas_practica: curso.horas_practica,
        horas_totales: curso.horas_totales,
        descripcion: curso.descripcion || ''
      });
    } else {
      setFormData({
        nombre: '',
        ciclo: '1',
        tipo_curso: 'obligatorio',
        horas_teoria: 0,
        horas_practica: 0,
        horas_totales: 0,
        descripcion: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCurso(null);
  };

  const handleSubmit = async () => {
    const horasTotales = parseInt(formData.horas_teoria) + parseInt(formData.horas_practica);
    const cursoData = { ...formData, horas_totales: horasTotales };

    setLoading(true);
    try {
      if (modalMode === 'create') {
        await axios.post('/api/cursos', cursoData);
        showToast('Curso creado exitosamente', 'success');
      } else {
        await axios.put(`/api/cursos/${selectedCurso.idCurso}`, cursoData);
        showToast('Curso actualizado exitosamente', 'success');
      }

      await cargarCursos();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar curso:', error);
      showToast('Error al guardar el curso', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (curso) => {
    if (!confirm(`¿Estás seguro de eliminar el curso "${curso.nombre}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/api/cursos/${curso.idCurso}`);
      showToast('Curso eliminado exitosamente', 'success');
      await cargarCursos();
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      showToast('Error al eliminar el curso', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cursosArrayForFilter = Array.isArray(cursos) ? cursos : [];
  const filteredCursos = cursosArrayForFilter.filter(c => {
    const nombre = (c.nombre || '').toString();
    const descripcion = (c.descripcion || '').toString();
    const matchSearch = nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCiclo = filterCiclo === '' || c.ciclo === filterCiclo;
    const matchTipo = filterTipo === '' || c.tipo_curso === filterTipo;
    return matchSearch && matchCiclo && matchTipo;
  });

  const groupedCursos = {};
  filteredCursos.forEach(c => {
    if (!groupedCursos[c.ciclo]) {
      groupedCursos[c.ciclo] = [];
    }
    groupedCursos[c.ciclo].push(c);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Cursos</h1>
            </div>
            <p className="text-gray-600">Administra el catálogo de cursos de la carrera</p>
          </div>
          <button
            onClick={() => handleOpenModal('create')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            Nuevo Curso
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar curso..."
              className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            value={filterCiclo}
            onChange={(e) => setFilterCiclo(e.target.value)}
          >
            <option value="">Todos los ciclos</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => (
              <option key={c} value={c}>{c}° Ciclo</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="obligatorio">Obligatorios</option>
            <option value="electivo">Electivos</option>
          </select>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Cursos</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Obligatorios</p>
              <p className="text-3xl font-bold text-blue-600">{stats.obligatorios}</p>
            </div>
            <Award className="w-12 h-12 text-blue-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Electivos</p>
              <p className="text-3xl font-bold text-green-600">{stats.electivos}</p>
            </div>
            <Award className="w-12 h-12 text-green-100" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Horas</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total_horas}</p>
            </div>
            <Clock className="w-12 h-12 text-blue-100" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
      {Object.keys(groupedCursos).sort((a, b) => parseInt(a) - parseInt(b)).map(ciclo => (
          <div key={ciclo} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-3">
              <h3 className="text-lg font-semibold">{ciclo}° Ciclo - {groupedCursos[ciclo].length} cursos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Horas</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Créditos</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {groupedCursos[ciclo].map((curso, index) => (
                    <tr key={curso.idCurso} className={`hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{curso.nombre}</p>
                          <p className="text-xs text-gray-500">{curso.descripcion}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${curso.tipo_curso === 'obligatorio'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                          }`}>
                          {curso.tipo_curso === 'obligatorio' ? 'Obligatorio' : 'Electivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-center">
                          <p className="font-semibold text-gray-800">{curso.horas_totales}h</p>
                          <p className="text-xs text-gray-500">T: {curso.horas_teoria} | P: {curso.horas_practica}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-blue-600">{curso.creditos}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal('edit', curso)}
                            className="p-2 text-black hover:bg-gray-100 rounded-lg transition text-gray-800"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(curso)}
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
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {modalMode === 'create' && 'Nuevo Curso'}
                {modalMode === 'edit' && 'Editar Curso'}
                {modalMode === 'view' && 'Detalles del Curso'}
              </h3>
              <button onClick={handleCloseModal} className="text-white hover:text-blue-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Nombre del Curso</label>
                  <input
                    type="text"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Ciclo</label>
                  <select
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.ciclo}
                    onChange={(e) => setFormData({ ...formData, ciclo: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => (
                      <option key={c} value={c}>{c}° Ciclo</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Tipo de Curso</label>
                  <select
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.tipo_curso}
                    onChange={(e) => setFormData({ ...formData, tipo_curso: e.target.value })}
                  >
                    <option value="obligatorio">Obligatorio</option>
                    <option value="electivo">Electivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Horas de Teoría</label>
                  <input
                    type="number"
                    min="0"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.horas_teoria}
                    onChange={(e) => setFormData({ ...formData, horas_teoria: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Horas de Práctica</label>
                  <input
                    type="number"
                    min="0"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.horas_practica}
                    onChange={(e) => setFormData({ ...formData, horas_practica: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Créditos</label>
                  <input
                    type="number"
                    min="1"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.creditos}
                    onChange={(e) => setFormData({ ...formData, creditos: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Duración de Sesión (min)</label>
                  <select
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.duracion_sesion}
                    onChange={(e) => setFormData({ ...formData, duracion_sesion: parseInt(e.target.value) })}
                  >
                    <option value={45}>45 min</option>
                    <option value={90}>90 min</option>
                    <option value={135}>135 min</option>
                    <option value={180}>180 min</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Tipo de Salón</label>
                  <select
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.tipo_salon}
                    onChange={(e) => setFormData({ ...formData, tipo_salon: e.target.value })}
                  >
                    <option value="normal">Aula Normal</option>
                    <option value="laboratorio">Laboratorio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Número de Secciones</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
                    value={formData.num_secciones}
                    onChange={(e) => setFormData({ ...formData, num_secciones: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Descripción</label>
                  <textarea
                    rows="3"
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Breve descripción del curso..."
                  />
                </div>

                <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Resumen:</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total horas semanales:</span>
                      <span className="ml-2 font-bold text-blue-600">
                        {(parseInt(formData.horas_teoria) || 0) + (parseInt(formData.horas_practica) || 0)}h
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Créditos:</span>
                      <span className="ml-2 font-bold text-blue-600">{formData.creditos}</span>
                    </div>
                  </div>
                </div>
              </div>

              {modalMode !== 'view' && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    {modalMode === 'create' ? 'Crear Curso' : 'Guardar Cambios'}
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

export default GestionCursosView;