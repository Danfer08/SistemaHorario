// hooks/useHorario.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { configurarAxios, calcularHoraFin } from '../utils/horarioUtils';

export const useHorario = (horarioId) => {
  const [selectedPeriodo, setSelectedPeriodo] = useState({ año: '2025', etapa: 'I' });
  const [selectedCiclo, setSelectedCiclo] = useState('1');
  const [draggedCurso, setDraggedCurso] = useState(null);
  const [horarioGrid, setHorarioGrid] = useState({});
  const [conflictos, setConflictos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cursoModal, setCursoModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [salones, setSalones] = useState([]);
  const [horarioActual, setHorarioActual] = useState(null);

  // Configurar axios
  useEffect(() => {
    configurarAxios();
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
    if (horarioId) {
      cargarHorario(horarioId);
    }
  }, [horarioId]);

  // Cargar cursos cuando cambie el ciclo
  useEffect(() => {
    if (selectedCiclo && horarioId) {
      cargarCursosPorCiclo();
      cargarHorarioGrid(horarioId); // Recargar el grid para el nuevo ciclo
    }
  }, [selectedCiclo]);

  const cargarDatosIniciales = async () => {
    try {
      const [profesoresRes, salonesRes] = await Promise.all([
        axios.get('/api/profesores'),
        axios.get('/api/salones-disponibles')
      ]);

      setProfesores(profesoresRes.data.data);
      setSalones(salonesRes.data.data);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      setError('Error al cargar los datos iniciales');
    }
  };

  const cargarCursosPorCiclo = async () => {
    try {
      const response = await axios.get(`/api/cursos/ciclo/${selectedCiclo}`);
      setCursosDisponibles(response.data.data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setError('Error al cargar los cursos del ciclo');
    }
  };

  const cargarHorario = async (id) => {
    try {
      // Esta función ahora solo carga un horario existente por su ID
      const response = await axios.get(`/api/horarios/${id}`);
      const horario = response.data.data;
      setHorarioActual(horario);
      setSelectedPeriodo({ año: horario.año, etapa: horario.etapa });
      const cicloInicial = horario.etapa === 'II' ? '2' : '1';
      setSelectedCiclo(cicloInicial);

      cargarHorarioGrid(id, cicloInicial); // Pasar el ciclo directamente
    } catch (error) {
      console.error('Error al cargar el horario:', error);
      setError('Error al cargar el horario. Puede que no exista.');
    }
  };

  const cargarHorarioGrid = async (horarioId, ciclo = selectedCiclo) => {
    try {
      const response = await axios.get(`/api/horarios/${horarioId}/grid`, {
        params: {
          ciclo: ciclo // Usar el ciclo pasado como parámetro o el del estado
        }
      });

      const gridData = {};
      response.data.data.forEach(item => {
        const key = `${item.dia}-${item.hora.split('-')[0]}`;
        // El ID de la asignación (horario_curso_id) se usará para agrupar
        gridData[key] = {
          id: item.horario_curso_id, 
          idCurso: item.curso_id,
          nombre: item.curso,
          profesor: { id: item.profesor_id, nombre: item.profesor },
          salon: { id: item.salon_id},
          grupo: item.grupo,
          estudiantes: item.estudiantes,
          dia: item.dia,
          hora: item.hora,
          hora_fin: item.hora_fin // Añadir hora_fin a los datos del grid
        };
      });

      setHorarioGrid(gridData);
    } catch (error) {
      console.error('Error al cargar grid:', error);
    }
  };

  const handleDragStart = (curso) => {
    setDraggedCurso(curso);
  };

  const handleDrop = (dia, hora) => {
    if (!draggedCurso) return;

    const key = `${dia}-${hora}`;
    
    if (horarioGrid[key]) {
      alert('Ya hay un curso asignado en este horario');
      return;
    }

    setCursoModal({ ...draggedCurso, dia, hora, key });
    setShowModal(true);
  };

  const handleEliminarAsignacion = async (key) => {
    const asignacion = horarioGrid[key];
    if (!asignacion || !horarioActual) return;

    try {
      await axios.delete(`/api/horarios/${horarioActual.idHorario}/eliminar-asignacion`, {
        data: { horario_curso_id: asignacion.id }
      });

      const newGrid = { ...horarioGrid };
      delete newGrid[key];
      setHorarioGrid(newGrid);
      
      await validarConflictos();
    } catch (error) {
      console.error('Error al eliminar asignación:', error);
      setError('Error al eliminar la asignación');
    }
  };

  const validarConflictos = async () => {
    if (!horarioActual) return;

    try {
      const response = await axios.get(`/api/horarios/${horarioActual.idHorario}/validar-conflictos`);
      setConflictos(response.data.data);
    } catch (error) {
      console.error('Error al validar conflictos:', error);
    }
  };

  const publicarHorario = async () => {
    if (!horarioActual) return;

    try {
      await axios.post(`/api/horarios/${horarioActual.idHorario}/publicar`);
      setError(null);
      alert('Horario publicado exitosamente');
    } catch (error) {
      console.error('Error al publicar horario:', error);
      if (error.response?.data?.conflictos) {
        setConflictos(error.response.data.conflictos);
        setError('No se puede publicar el horario porque tiene conflictos');
      } else {
        setError('Error al publicar el horario');
      }
    }
  };

  const handleAsignarCurso = async (profesor, salon, grupo, estudiantes, sesionesPorSemana) => {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const diaInicioIndex = diasSemana.indexOf(cursoModal.dia);

    if (diaInicioIndex === -1) {
      setError("Día de inicio no válido.");
      return;
    }

    const detalles = [];
    for (let i = 0; i < sesionesPorSemana; i++) {
      const diaIndex = (diaInicioIndex + i) % diasSemana.length;
      const dia = diasSemana[diaIndex];
      
      // Validar que la nueva celda no esté ocupada
      const key = `${dia}-${cursoModal.hora}`;
      if (horarioGrid[key]) {
        setError(`La celda para ${dia} a las ${cursoModal.hora} ya está ocupada.`);
        return; // Detener si una de las celdas futuras está ocupada
      }

      detalles.push({
        dia: dia,
        hora_inicio: cursoModal.hora,
        hora_fin: calcularHoraFin(cursoModal.hora, cursoModal.horas_totales / sesionesPorSemana),
        salon_id: salon.idSalon
      });
    }

    try {
      const response = await axios.post(`/api/horarios/${horarioId}/asignar-curso`, {
        curso_id: cursoModal.idCurso,
        profesor_id: profesor.idProfesor,
        grupo: grupo,
        estudiantes: estudiantes,
        detalles: detalles
      });
      
      // Recargar el grid para mostrar todas las nuevas sesiones
      await cargarHorarioGrid(horarioId);

      setShowModal(false);
      setCursoModal(null);
      await validarConflictos();
    } catch (error) {
      console.error('Error al asignar curso:', error);
      if (error.response?.data?.conflictos) {
        setConflictos(error.response.data.conflictos);
        setError('No se puede asignar el curso porque genera conflictos.');
      } else {
        setError('Error al asignar el curso. ' + (error.response?.data?.message || ''));
      }
    }
  };

  const cursosAsignados = Object.values(horarioGrid).map(c => c.idCurso); // Esto podría necesitar ajuste para contar por horario_curso_id
  const cursosPendientes = cursosDisponibles.filter(c => !cursosAsignados.includes(c.idCurso));

  return {
    // Estados
    selectedPeriodo,
    setSelectedPeriodo,
    selectedCiclo,
    setSelectedCiclo,
    draggedCurso,
    horarioGrid,
    conflictos,
    showModal,
    setShowModal,
    cursoModal,
    setCursoModal,
    loading,
    error,
    cursosDisponibles,
    profesores,
    salones,
    cursosPendientes,
    cursosAsignados,
    
    // Funciones
    handleDragStart,
    handleDrop,
    handleEliminarAsignacion,
    handleAsignarCurso,
    guardarHorario: () => validarConflictos(), // Renombrado para claridad
    publicarHorario
  };
};