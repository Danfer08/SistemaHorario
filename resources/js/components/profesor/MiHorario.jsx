import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Download, AlertCircle, Send, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ProfesorService } from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MiHorarioView = () => {
  const { user } = useAuth();
  const [selectedSemestre, setSelectedSemestre] = useState('2025-I');
  const [showSolicitud, setShowSolicitud] = useState(false);
  const [solicitud, setSolicitud] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const horas = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

  // Cargar horarios del profesor
  useEffect(() => {
    if (user?.profesor?.idProfesor) {
      cargarHorarios();
    }
  }, [user]);

  console.log('ID del profesor', user?.profesor?.idProfesor)

  const cargarHorarios = async () => {
    try {
      setLoading(true);
      const response = await ProfesorService.getHorarios(user.profesor.idProfesor);
      setHorarios(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los horarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtra el horario basado en el semestre seleccionado
  const horarioFiltrado = React.useMemo(() => {
    if (!horarios.length) return [];
    const [año, etapa] = selectedSemestre.split('-');
    return horarios.filter(h => h.año.toString() === año && h.etapa === etapa);
  }, [horarios, selectedSemestre]);

  let TotalEstudiantes = 0;

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    if (!horarioFiltrado.length) return { totalHoras: 0, totalCursos: 0, totalEstudiantes: 0 };

    let totalHoras = 0;
    let totalCursos = 0;
    let totalEstudiantes = 0;
    const cursosUnicos = new Set();

    horarioFiltrado.forEach(horario => {
      horario.horario_cursos.forEach(curso => {
        // Calcular horas por curso (suma de duraciones de detalles)
        const horasCurso = curso.detalles.reduce((sum, detalle) => {
          const inicio = new Date(`2000-01-01T${detalle.Hora_inicio}`);
          const fin = new Date(`2000-01-01T${detalle.Hora_fin}`);
          return sum + (fin - inicio) / (1000 * 60 * 60); // Convertir a horas
        }, 0);

        totalHoras += horasCurso;
        totalEstudiantes += curso.Nr_estudiantes || 0;
        TotalEstudiantes = totalEstudiantes;
        cursosUnicos.add(curso.FK_idCurso);
      });
    });

    totalCursos = cursosUnicos.size;

    return { totalHoras: Math.round(totalHoras), totalCursos, totalEstudiantes };
  };

  // Convertir datos de la API al formato que necesita el grid
  const generarMisClases = () => {
    if (!horarioFiltrado.length) return [];

    const clases = [];

    horarioFiltrado.forEach(horario => {
      horario.horario_cursos.forEach(curso => {
        curso.detalles.forEach(detalle => {
          clases.push({
            id: curso.idHorarioCurso,
            curso: curso.curso.nombre,
            ciclo: curso.curso.ciclo,
            grupo: curso.Grupo,
            estudiantes: curso.Nr_estudiantes || 0,
            dia: detalle.dia,
            hora: detalle.Hora_inicio,
            hora_fin: detalle.Hora_fin,
            salon: `S-${detalle.FK_idSalon}`,
            horas_totales: curso.curso.horas_totales
          });
        });
      });
    });

    return clases;
  };

  const stats = calcularEstadisticas();
  const misClases = generarMisClases();

  const getDuracionEnHoras = (horaInicio, horaFin) => {
    if (!horaInicio || !horaFin) return 1;
    const [h1] = horaInicio.split(':').map(Number);
    const [h2] = horaFin.split(':').map(Number);
    return Math.max(1, h2 - h1);
  };

  const horarioProcesado = React.useMemo(() => {
    const grid = {};
    misClases.forEach(clase => {
      const duracion = getDuracionEnHoras(clase.hora, clase.hora_fin);
      const horaInicioNum = parseInt(clase.hora.split(':')[0], 10);
      for (let i = 0; i < duracion; i++) {
        const horaActual = `${(horaInicioNum + i).toString().padStart(2, '0')}:00`;
        grid[`${clase.dia}-${horaActual}`] = { ...clase, isStart: i === 0 };
      }
    });
    return grid;
  }, [misClases]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text('Mi Horario Semanal', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Profesor: ${user?.nombre || 'Profesor'}`, 14, 32);
    doc.text(`Semestre: ${selectedSemestre}`, 14, 38);

    // Prepare table data
    const tableColumn = ["Hora", ...dias];
    const tableRows = [];

    horas.forEach(hora => {
      const rowData = [hora];
      dias.forEach(dia => {
        const key = `${dia}-${hora}`;
        const clase = horarioProcesado[key];
        if (clase && clase.isStart) {
          rowData.push(`${clase.curso}\n${clase.salon}\n${clase.grupo}`);
        } else if (clase) {
          rowData.push(''); // Cell is occupied but handled by rowspan in HTML, here we just leave empty or handle differently if needed for PDF
        } else {
          rowData.push('');
        }
      });
      tableRows.push(rowData);
    });

    // We need a different approach for the PDF table to handle "rowspan" visual effect or just list classes.
    // Since autoTable doesn't support rowspan easily in this grid format without complex config, 
    // let's try a list format or a simplified grid. 
    // Actually, let's try to make the grid work.

    // Simplified approach: List of classes first, then grid if possible.
    // Let's stick to a clear list of classes which is often more useful for printing.

    // Alternative: Generate a list of classes
    const listColumns = ["Curso", "Ciclo", "Grupo", "Día", "Hora Inicio", "Hora Fin", "Salón", "Estudiantes"];
    const listRows = misClases.map(clase => [
      clase.curso,
      clase.ciclo,
      clase.grupo,
      clase.dia,
      clase.hora,
      clase.hora_fin,
      clase.salon,
      clase.estudiantes
    ]);

    // Sort by Day and Time
    const dayOrder = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6 };
    listRows.sort((a, b) => {
      if (dayOrder[a[3]] !== dayOrder[b[3]]) {
        return dayOrder[a[3]] - dayOrder[b[3]];
      }
      return a[4].localeCompare(b[4]);
    });

    autoTable(doc, {
      head: [listColumns],
      body: listRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 },
    });

    // Add summary stats
    const finalY = doc.lastAutoTable.finalY || 45;
    doc.setFontSize(10);
    doc.text(`Total Horas: ${stats.totalHoras}`, 14, finalY + 10);
    doc.text(`Total Cursos: ${stats.totalCursos}`, 14, finalY + 16);
    doc.text(`Total Estudiantes: ${stats.totalEstudiantes}`, 14, finalY + 22);

    doc.save(`horario_${selectedSemestre}.pdf`);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Cargando horario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarHorarios}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Mi Horario</h1>
        </div>
        <p className="text-gray-600">Bienvenido, {user?.nombre || 'Profesor'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Carga Horaria</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalHoras}h</p>
              <p className="text-xs text-gray-500 mt-1">asignadas</p>
            </div>
            <Clock className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Cursos</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalCursos}</p>
              <p className="text-xs text-gray-500 mt-1">asignados</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Estudiantes</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalEstudiantes}</p>
              <p className="text-xs text-gray-500 mt-1">bajo su cargo</p>
            </div>
            <Users className="w-12 h-12 text-blue-100" />
          </div>
        </div>
      </div>

      {/* Selector de Semestre y Acciones */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semestre Académico</label>
            <select
              className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              value={selectedSemestre}
              onChange={(e) => setSelectedSemestre(e.target.value)}
            >
              {horarios.map(horario => (
                <option key={horario.idHorario} value={`${horario.año}-${horario.etapa}`}>
                  {horario.año} - {horario.etapa}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            {/* 
            <button 
              onClick={() => setShowSolicitud(!showSolicitud)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Send className="w-4 h-4" />
              Solicitar Cambio
            </button>
            */}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>


      {/* Mi Horario Grid */}
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Mi Horario Semanal - {selectedSemestre}
        </h3>

        {misClases.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tienes clases asignadas para este período</p>
          </div>
        ) : (
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
              {horas.map(hora => (
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
                        className={`p-3 rounded-lg border-2 min-h-[100px] transition ${clase
                          ? `bg-gradient-to-br from-blue-100 to-blue-50 border-blue-400 shadow-sm hover:shadow-md cursor-pointer ${!clase.isStart ? 'border-t-0 rounded-t-none' : ''}`
                          : 'bg-gray-50 border-gray-200'
                          }`}
                      >
                        {clase && clase.isStart && (
                          <div className="text-xs">
                            <div className="font-bold text-blue-900 mb-2">{clase.curso}</div>
                            <div className="flex items-center gap-1 text-gray-700 mb-1">
                              <span>Ciclo {clase.ciclo} - G{clase.grupo}</span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-600 mb-1">
                              <MapPin className="w-3 h-3" />
                              <span className="font-medium">{clase.salon}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Users className="w-3 h-3" />
                              <span>{clase.estudiantes} est.</span>
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
        )}
      </div>

      {/* Lista de Cursos */}
      {misClases.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalle de Mis Cursos</h3>
          <div className="space-y-3">
            {Array.from(new Set(misClases.map(c => c.curso))).map(curso => {
              const secciones = misClases.filter(c => c.curso === curso);
              const totalEstudiantes = TotalEstudiantes;
              return (
                <div key={curso} className="border-2 border-blue-100 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">{curso}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {secciones.length} {secciones.length === 1 ? 'sección' : 'secciones'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total estudiantes</p>
                      <p className="text-2xl font-bold text-blue-600">{totalEstudiantes}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {secciones.map((sec, idx) => (
                      <div key={idx} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        Grupo {sec.grupo} - {sec.estudiantes} est.
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiHorarioView;