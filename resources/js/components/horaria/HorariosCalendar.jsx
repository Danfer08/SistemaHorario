import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download, Eye, Search, Loader } from 'lucide-react';
import apiClient from '../../api/api';
import { useAcademicYears } from '../../utils/yearsHorario';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HorariosView = () => {

  const { years, defaultYear } = useAcademicYears();
  const [filters, setFilters] = useState({
    año: defaultYear,
    etapa: 'I',
    ciclo: '1',
    grupo: '1'
  });


  const [horarioData, setHorarioData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  const horas = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
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
      const params = {
        grupo: filters.grupo
      };
      
      // Solo agregar ciclo si no es "todos"
      if (filters.ciclo !== 'todos') {
        params.ciclo = filters.ciclo;
      }

      const response = await apiClient.get(`/api/horarios/${horarioEncontrado.idHorario}/grid`, {
        params: params
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
    if (horarioData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
    });

    // Título y Cabecera
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('Horario Académico', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Ciclo: ${filters.ciclo}° | Grupo: ${filters.grupo} | Periodo: ${filters.año}-${filters.etapa}`, 14, 32);

    // Preparar datos para la tabla
    const tableBody = [];
    const skipMap = new Set(); // Para rastrear celdas que deben saltarse por rowspan

    horas.forEach((hora, rowIndex) => {
      const row = [hora];

      dias.forEach((dia, colIndex) => {
        // Ajustamos colIndex porque la primera columna es la hora
        const actualColIndex = colIndex + 1;
        const cellKey = `${rowIndex}-${actualColIndex}`;

        if (skipMap.has(cellKey)) {
          return; // Saltar esta celda porque está cubierta por un rowspan anterior
        }

        const key = `${dia}-${hora}`;
        const clase = horarioProcesado[key];

        if (clase && clase.isStart) {
          const duracion = getDuracionEnHoras(clase.hora, clase.hora_fin);

          // Agregar celda con información
          row.push({
            content: `${clase.curso}\n${clase.profesor}\n${clase.salon}`,
            rowSpan: duracion,
            styles: {
              halign: 'center',
              valign: 'middle',
              fillColor: [239, 246, 255], // blue-50
              textColor: [30, 58, 138] // blue-900
            }
          });

          // Marcar celdas futuras a saltar
          for (let i = 1; i < duracion; i++) {
            skipMap.add(`${rowIndex + i}-${actualColIndex}`);
          }
        } else if (clase && !clase.isStart) {
          // Esta celda debería haber sido saltada por el skipMap si la lógica es correcta.
          // Si llegamos aquí, es un error o una superposición no manejada, pero por seguridad no agregamos nada
          // o agregamos celda vacía si no estaba en skipMap (lo cual sería raro).
        } else {
          // Celda vacía
          row.push('');
        }
      });

      tableBody.push(row);
    });

    autoTable(doc, {
      head: [['Hora', ...dias]],
      body: tableBody,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [37, 99, 235], // blue-600
        textColor: 255,
        fontSize: 10,
        halign: 'center'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center', valign: 'middle', fontStyle: 'bold' } // Columna de hora
      },
      didDrawPage: (data) => {
        // Footer
        const str = 'Página ' + doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      }
    });

    doc.save(`horario-${filters.año}-${filters.etapa}-ciclo${filters.ciclo}-grupo${filters.grupo}.pdf`);
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
              className="w-full px-4 py-2 border text-gray-900 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              value={filters.año}
              onChange={(e) => setFilters({ ...filters, año: e.target.value })}
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
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              value={filters.etapa}
              onChange={(e) => setFilters({ ...filters, etapa: e.target.value })}
            >
              <option value="I">I</option>
              <option value="II">II</option>
            </select>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ciclo</label>
            <select
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              value={filters.ciclo}
              onChange={(e) => setFilters({ ...filters, ciclo: e.target.value })}
            >
              <option value="todos">Todos los ciclos</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => (
                <option key={c} value={c}>{c}° Ciclo</option>
              ))}
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
            Horario - {filters.ciclo === 'todos' ? 'Todos los Ciclos' : `${filters.ciclo}° Ciclo`} | {filters.año}-{filters.etapa}
          </h3>
          {loading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Cargando...</span>
            </div>
          )}
        </div>

        <div className="min-w-[1000px]">
          <div 
            className="grid gap-1"
            style={{
              gridTemplateColumns: '80px repeat(6, 1fr)', 
              gridTemplateRows: `40px repeat(${horas.length}, 80px)`
            }}
          >
            {/* Header Row */}
            <div className="col-start-1 row-start-1 bg-blue-600 text-white p-2 rounded-lg font-semibold text-center text-sm flex items-center justify-center">
              Hora
            </div>
            {dias.map((dia, i) => (
              <div 
                key={dia} 
                className="bg-blue-600 text-white p-2 rounded-lg font-semibold text-center text-sm flex items-center justify-center"
                style={{ gridColumnStart: i + 2, gridRowStart: 1 }}
              >
                {dia}
              </div>
            ))}

            {/* Time Labels (Col 1) */}
            {horas.map((hora, i) => (
              <div 
                key={hora} 
                className="bg-blue-50 p-2 rounded-lg font-medium text-center text-gray-700 text-sm flex items-center justify-center"
                style={{ gridColumnStart: 1, gridRowStart: i + 2 }}
              >
                {hora}
              </div>
            ))}

            {/* Background Grid Cells */}
            {dias.map((dia, dIndex) => (
               horas.map((hora, hIndex) => (
                 <div 
                   key={`bg-${dia}-${hora}`} 
                   className="rounded-lg border border-gray-100 bg-gray-50/50"
                   style={{ gridColumnStart: dIndex + 2, gridRowStart: hIndex + 2 }}
                 />
               ))
            ))}

            {/* Sessions (Foreground) */}
            {horarioData.map((clase, index) => {
               const dIndex = dias.indexOf(clase.dia);
               // Extraer solo la hora de inicio (HH:00) para buscar el índice
               const horaInicioStr = clase.hora.substring(0, 5); 
               const hIndex = horas.indexOf(horaInicioStr);
               
               if (dIndex === -1 || hIndex === -1) return null;

               const colStart = dIndex + 2;
               const rowStart = hIndex + 2;
               const rowSpan = getDuracionEnHoras(clase.hora, clase.hora_fin);
               
               return (
                 <div 
                   key={`${clase.id}-${index}`}
                   style={{ 
                     gridColumnStart: colStart, 
                     gridRowStart: rowStart, 
                     gridRowEnd: `span ${rowSpan}`,
                     zIndex: 10
                   }}
                   className="p-1"
                 >
                   <div className="h-full w-full bg-blue-100 border-l-4 border-blue-500 rounded shadow-sm p-2 hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-center relative group">
                      <div className="text-xs">
                        <p className="font-bold text-blue-900 mb-1 leading-tight">{clase.curso}</p>
                        <p className="text-gray-700 mb-1 font-medium">{clase.profesor}</p>
                        <div className="flex justify-between items-end mt-1">
                           <span className="bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                             {clase.salon}
                           </span>
                           <span className="text-gray-500 text-[10px]">
                             Gr. {clase.grupo}
                           </span>
                        </div>
                      </div>
                      
                      {/* Tooltip simple para detalles completos */}
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded p-2 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none w-48 z-50 shadow-lg">
                        <p className="font-bold">{clase.curso}</p>
                        <p>Prof: {clase.profesor}</p>
                        <p>Salón: {clase.salon}</p>
                        <p>Grupo: {clase.grupo}</p>
                        <p>{clase.hora} - {clase.hora_fin}</p>
                      </div>
                   </div>
                 </div>
               )
            })}
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