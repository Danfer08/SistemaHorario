import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download, Eye, Search, Loader } from 'lucide-react';
import apiClient from '../../api/api';

const HorariosView = () => {
  const [filters, setFilters] = useState({
    año: '2025',
    etapa: 'I',
    ciclo: '1',
    grupo: '1'
  });

  const [horarioData, setHorarioData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  
  const horas = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Configurar axios con token de autenticación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Cargar horarios disponibles al montar el componente
  useEffect(() => {
    cargarHorariosDisponibles();
  }, []);

  // Cargar datos del horario cuando cambien los filtros
  useEffect(() => {
    if (horariosDisponibles.length > 0) {
      buscarHorario();
    }
  }, [filters, horariosDisponibles]);

  const cargarHorariosDisponibles = async () => {
    try {
      const response = await apiClient.get('api/horarios');
      console.log('Horarios disponibles cargados:', response.data.data);
      console.log('Respuesta completa:', response);

      setHorariosDisponibles(response.data.data);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      setError('Error al cargar los horarios disponibles');
    }
  };

  const buscarHorario = async () => {
    setLoading(true);
    setError(null);

    try {
      // Buscar horario que coincida con los filtros
      const horarioEncontrado = horariosDisponibles.find(h => 
        h.año == filters.año && h.etapa === filters.etapa && h.estado === 'confirmado'
      );

      if (!horarioEncontrado) {
        setHorarioData([]);
        setError('No se encontró un horario confirmado para el período seleccionado');
        return;
      }

      // Obtener datos del grid del horario
      const response = await apiClient.get(`/api/horarios/${horarioEncontrado.idHorario}/grid`, {
        params: {
          ciclo: filters.ciclo,
          grupo: filters.grupo
        }
      });

      console.log('Datos del horario cargados:', response.data.data);

      setHorarioData(response.data.data);
    } catch (error) {
      console.error('Error al buscar horario:', error);
      setError('Error al cargar los datos del horario');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    buscarHorario();
  };

  const exportarPDF = () => {
    // Implementar exportación a PDF
    alert('Función de exportación a PDF en desarrollo');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Horarios Académicos</h1>
        </div>
        <p className="text-gray-600">Consulta los horarios por ciclo y grupo</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
            <select 
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.año}
              onChange={(e) => setFilters({...filters, año: e.target.value})}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Etapa</label>
            <select 
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.etapa}
              onChange={(e) => setFilters({...filters, etapa: e.target.value})}
            >
              <option value="I">I</option>
              <option value="II">II</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ciclo</label>
            <select 
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.ciclo}
              onChange={(e) => setFilters({...filters, ciclo: e.target.value})}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(c => (
                <option key={c} value={c}>{c}° Ciclo</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grupo</label>
            <select 
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.grupo}
              onChange={(e) => setFilters({...filters, grupo: e.target.value})}
            >
              <option value="1">Grupo 1</option>
              <option value="2">Grupo 2</option>
              <option value="3">Grupo 3</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button 
            onClick={handleBuscar}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button 
            onClick={exportarPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
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

      {/* Horario Grid */}
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Horario - {filters.ciclo}° Ciclo | Grupo {filters.grupo} | {filters.año}-{filters.etapa}
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
                          <div className="text-gray-700">{clase.profesor}</div>
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

      {/* Leyenda */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
            <span>Clase programada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border-2 border-gray-200 rounded"></div>
            <span>Hora libre</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorariosView;