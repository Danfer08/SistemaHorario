import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, BookOpen, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { useAcademicYears } from '../../utils/yearsHorario';

const MiHorarioView = () => {

  const { years } = useAcademicYears();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState({ año: '2025', etapa: 'I' });
  
  // Estados para datos del profesor
  const [profesorData, setProfesorData] = useState(null);
  const [horarioData, setHorarioData] = useState([]);
  const [stats, setStats] = useState({
    cargaActual: 0,
    cargaMaxima: 20,
    totalSecciones: 0,
    totalEstudiantes: 0
  });

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']; // Sábado incluido
  const horas = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00','19:00','20:00','21:00','22:00','23:00'];

  // Configurar axios con token de autenticación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Cargar datos del profesor al montar el componente
  useEffect(() => {
    cargarDatosProfesor();
  }, []);

  // Cargar horario cuando cambie el período
  useEffect(() => {
    if (profesorData) {
      cargarMiHorario();
    }
  }, [selectedPeriodo, profesorData]);

  const cargarDatosProfesor = async () => {
    try {
      const response = await axios.get('/api/user');
      const user = response.data?.data ?? response.data;

      if (!user) {
        setError('No se pudo obtener la información del usuario');
        return;
      }

      // Buscar el profesor asociado al usuario
      const profesorResponse = await axios.get('/api/profesores', {
        params: { search: user.name }
      });

      // Manejar distintas formas de respuesta y proteger contra undefined
      const profArray = profesorResponse?.data?.data ?? profesorResponse?.data ?? [];

      if (Array.isArray(profArray) && profArray.length > 0) {
        setProfesorData(profArray[0]);
      } else {
        console.warn('Respuesta inesperada al buscar profesor:', profesorResponse);
        setError('No se encontró información del profesor');
      }
    } catch (error) {
      console.error('Error al cargar datos del profesor:', error);
      setError('Error al cargar los datos del profesor');
    }
  };

  const cargarMiHorario = async () => {
    if (!profesorData) return;

    setLoading(true);
    try {
      // Buscar horarios confirmados para el período
      const horariosResponse = await axios.get('/api/horarios', {
        params: {
          año: selectedPeriodo.año,
          etapa: selectedPeriodo.etapa,
          estado: 'confirmado'
        }
      });

      const horariosArray = horariosResponse?.data?.data ?? horariosResponse?.data ?? [];
      const horarioEncontrado = Array.isArray(horariosArray) ? horariosArray.find(h => 
        h.año == selectedPeriodo.año && h.etapa === selectedPeriodo.etapa
      ) : undefined;

      if (!horarioEncontrado) {
        setHorarioData([]);
        setError('No se encontró un horario confirmado para el período seleccionado');
        return;
      }

      // Obtener horarios del profesor
      const response = await axios.get(`/api/horarios/${horarioEncontrado.idHorario}/grid`, {
        params: {
          profesor_id: profesorData.idProfesor
        }
      });

      const gridData = response?.data?.data ?? response?.data ?? [];
      setHorarioData(Array.isArray(gridData) ? gridData : []);
      if (Array.isArray(gridData)) {
        calcularStats(gridData);
      }
    } catch (error) {
      console.error('Error al cargar horario:', error);
      setError('Error al cargar el horario');
    } finally {
      setLoading(false);
    }
  };

  const calcularStats = (horarios) => {
    const cargaActual = horarios.reduce((sum, h) => {
      const inicio = parseInt(h.hora.split(':')[0]);
      const fin = parseInt(h.hora_fin.split(':')[0]);
      return sum + (fin - inicio); // Suma las horas de cada sesión
    }, 0);

    const totalSecciones = [...new Set(horarios.map(h => h.horario_curso_id))].length;
    const totalEstudiantes = horarios.reduce((sum, h) => sum + h.estudiantes, 0);

    setStats({
      cargaActual,
      cargaMaxima: 20,
      totalSecciones,
      totalEstudiantes
    });
  };

  const getDuracionEnHoras = (horaInicio, horaFin) => {
    if (!horaInicio || !horaFin) return 1;
    const [h1] = horaInicio.split(':').map(Number);
    const [h2] = horaFin.split(':').map(Number);
    return Math.max(1, h2 - h1);
  };

  const horarioProcesado = React.useMemo(() => {
    const grid = {};
    horarioData.forEach(clase => {
      const duracion = getDuracionEnHoras(clase.hora, clase.hora_fin);
      const horaInicioNum = parseInt(clase.hora.split(':')[0], 10);
      for (let i = 0; i < duracion; i++) {
        const horaActual = `${(horaInicioNum + i).toString().padStart(2, '0')}:00`;
        grid[`${clase.dia}-${horaActual}`] = { ...clase, isStart: i === 0 };
      }
    });
    return grid;
  }, [horarioData]);

  const exportarPDF = () => {
    // Implementar exportación a PDF
    alert('Función de exportación a PDF en desarrollo');
  };

  const solicitarCambio = () => {
    // Implementar solicitud de cambios
    alert('Función de solicitud de cambios en desarrollo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Mi Horario</h1>
            </div>
            <p className="text-gray-600">
              {profesorData ? `${profesorData.nombre} ${profesorData.apellido}` : 'Cargando...'}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={solicitarCambio}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              <AlertCircle className="w-4 h-4" />
              Solicitar Cambios
            </button>
            <button 
              onClick={exportarPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Selector de Período */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Período Académico</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Año</label>
          <select 
            className="w-full px-4 py-2 border text-gray-900 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            value={years.año}
            onChange={(e) => !isReadOnly && setSelectedPeriodo({...selectedPeriodo, año: e.target.value})}
          >
            {years.map(year => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Etapa</label>
            <select 
              className="w-full px-4 py-2 border text-gray-900 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedPeriodo.etapa}
              onChange={(e) => setSelectedPeriodo({...selectedPeriodo, etapa: e.target.value})}
            >
              <option value="I">I</option>
              <option value="II">II</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Carga Horaria</p>
              <p className="text-2xl font-bold text-blue-600">{stats.cargaActual}h</p>
              <p className="text-xs text-gray-500">Máximo: {stats.cargaMaxima}h</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((stats.cargaActual / stats.cargaMaxima) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Secciones</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalSecciones}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Estudiantes</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalEstudiantes}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Estado</p>
              <p className="text-lg font-bold text-green-600">Activo</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Horario Grid */}
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Horario Personal - {selectedPeriodo.año}-{selectedPeriodo.etapa}
          </h3>
          {loading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Cargando...</span>
            </div>
          )}
        </div>

        <div className="min-w-[900px]">
          <div className="grid grid-cols-7 gap-2">
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 rounded-lg font-semibold text-center">
              Hora
            </div>
            {dias.map(dia => (
              <div key={dia} className="bg-blue-600 text-white p-3 rounded-lg font-semibold text-center">
                {dia}
              </div>
            ))}

            {/* Filas de horarios */}
            {horas.map((hora, idx) => (
              <React.Fragment key={hora}>
                <div className="bg-blue-50 p-3 rounded-lg font-medium text-center text-gray-700 flex items-center justify-center">
                  {hora}
                </div>
                {dias.map(dia => {
                  const key = `${dia}-${hora}`;
                  const clase = horarioProcesado[key];
                  return (
                    <div 
                      key={`${dia}-${hora}`} 
                      className={`p-3 rounded-lg border-2 min-h-[80px] ${
                        clase 
                          ? `bg-blue-100 border-blue-300 cursor-pointer hover:bg-blue-200 transition ${!clase.isStart ? 'border-t-0 rounded-t-none' : ''}`
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {clase && clase.isStart && (
                        <div className="text-xs">
                          <div className="font-bold text-blue-900 mb-1">{clase.curso}</div>
                          <div className="text-gray-700">Grupo {clase.grupo}</div>
                          <div className="text-blue-600 font-medium mt-1">{clase.salon}</div>
                          <div className="text-gray-500 text-xs mt-1">
                            {clase.estudiantes} estudiantes
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Lista Detallada de Cursos */}
      {horarioData.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalle de Cursos</h3>
          <div className="space-y-3">
            {horarioData.map((clase, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{clase.curso}</h4>
                  <p className="text-sm text-gray-600">
                    {clase.dia} - {clase.hora} | Grupo {clase.grupo} | {clase.salon}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{clase.estudiantes} estudiantes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiHorarioView;