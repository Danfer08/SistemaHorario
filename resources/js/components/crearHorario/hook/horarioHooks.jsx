// hooks/useHorario.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { configurarAxios, calcularHoraFin } from '../utils/horarioUtils';

export const useHorario = (horarioId) => {
  const [selectedPeriodo, setSelectedPeriodo] = useState({ año: '2025', etapa: 'I' });
  const [selectedCiclo, setSelectedCiclo] = useState('1');
  const [draggedItem, setDraggedItem] = useState(null);
  const [horarioGrid, setHorarioGrid] = useState({});
  const [conflictos, setConflictos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [salones, setSalones] = useState([]);
  const [horarioActual, setHorarioActual] = useState(null);
  
  // Estados para el nuevo flujo de planificación
  const [planificaciones, setPlanificaciones] = useState({}); // Almacena los grupos y sesiones planificados
  const [showPlanificadorModal, setShowPlanificadorModal] = useState(false);
  const [cursoParaPlanificar, setCursoParaPlanificar] = useState(null);
  const [showAsignarSesionModal, setShowAsignarSesionModal] = useState(false);
  const [sesionParaAsignar, setSesionParaAsignar] = useState(null);

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
    // Solo cargar cursos si el ciclo cambia por acción del usuario (no en la carga inicial)
    if (selectedCiclo && horarioActual) {
      cargarCursosPorCiclo();
      cargarHorarioGrid(horarioActual.idHorario);
    }
  }, [selectedCiclo]); // Se quitaron dependencias para evitar recargas no deseadas

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

  const cargarCursosPorCiclo = async (cicloParam = selectedCiclo) => {
    try {
      const response = await axios.get(`/api/cursos/ciclo/${selectedCiclo}`);
      setCursosDisponibles(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setError('Error al cargar los cursos del ciclo');
    }
  };

  const cargarHorario = async (id) => {
    try {
      setLoading(true); // Iniciar carga
      setError(null);

      // 1. Cargar los datos principales del horario
      const response = await axios.get(`/api/horarios/${id}`);
      const horario = response.data.data;
      setHorarioActual(horario);
      setSelectedPeriodo({ año: horario.año, etapa: horario.etapa });
      await cargarCursosPorCiclo();
      await cargarHorarioGrid(horario.idHorario);


 // Actualizar el ciclo en la UI al final
    } catch (error) {
      console.error('Error al cargar el horario:', error);
      setError('Error al cargar el horario. Puede que no exista.');
    } finally {
      setLoading(false); // Desactivar el loading al finalizar (éxito o error)
    }
  };

  const cargarHorarioGrid = async (horarioId, cicloParam = selectedCiclo) => {
    try {
      const response = await axios.get(`/api/horarios/${horarioId}/grid`, {
        params: {
          ciclo: cicloParam // Usar el ciclo pasado como parámetro o el del estado
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

  const handleDragStart = (item, type, sesion = null) => {
    // El drag and drop ahora solo funciona para sesiones planificadas
    if (type !== 'sesion' || !sesion) return;
    setDraggedItem({ ...item, type, sesion });
  };
  

  const handleDrop = (dia, hora) => {
    if (!draggedItem || draggedItem.type !== 'sesion') return;

    const key = `${dia}-${hora}`;
    
    if (horarioGrid[key]) {
      alert('Ya hay una sesión asignada en este horario');
      return;
    }

    const hora_fin = calcularHoraFin(hora, draggedItem.duracion);
    setSesionParaAsignar({ ...draggedItem, dia, hora_inicio: hora, hora_fin });
    setShowAsignarSesionModal(true);
  };

  const handleEliminarAsignacion = async (key) => {
    const asignacion = horarioGrid[key];
    if (!asignacion || !horarioActual) return;

    try {
      await axios.delete(`/api/horarios/${horarioActual.idHorario}/eliminar-asignacion`, {
        // Se elimina por horario_curso_id, que agrupa todas las sesiones de un grupo
        data: { horario_curso_id: asignacion.id }
      });

      // Recargar el grid para reflejar la eliminación
      await cargarHorarioGrid(horarioActual.idHorario);

      // Optimización: En lugar de una lógica compleja, simplemente recargamos los cursos.
      // Esto asegura que el curso eliminado vuelva a la lista de "pendientes" si ya no tiene grupos en el horario.
      // La lógica para determinar `cursosPendientes` ya se encarga de esto.
      await cargarCursosPorCiclo();

      // Limpiar las planificaciones para el curso si ya no tiene grupos asignados.
      // Esto es una optimización para que el panel de cursos se actualice correctamente.
      setPlanificaciones(prev => {
          const cursoIdEliminado = asignacion.idCurso.toString();
          const nuevasPlanificaciones = { ...prev };
          // Si después de la recarga del grid, ya no hay asignaciones para este curso,
          // limpiamos su planificación para que vuelva a estar disponible para planificar desde cero.
          const cursoAunAsignado = Object.values(horarioGrid).some(item => item.idCurso.toString() === cursoIdEliminado && item.id !== asignacion.id);
          if (!cursoAunAsignado) delete nuevasPlanificaciones[cursoIdEliminado];
          return nuevasPlanificaciones;
      });
      
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

    // Limpiar errores y conflictos anteriores antes de intentar publicar
    setError(null);
    setConflictos([]);

    try {
      const response = await axios.post(`/api/horarios/${horarioActual.idHorario}/publicar`);
      alert(response.data.message || 'Horario publicado exitosamente');
      // Aquí podrías agregar una redirección o actualización de la UI
    } catch (error) {
      console.error('Error al publicar horario:', error);

      if (error.response?.data) {
        const errorData = error.response.data;
        // Establecer el mensaje de error principal que viene del backend
        setError(errorData.message || 'No se pudo publicar el horario.');

        // Comprobar si la respuesta contiene 'conflictos' o 'cursos_faltantes'
        if (errorData.conflictos) {
          setConflictos(errorData.conflictos);
        } else if (errorData.cursos_faltantes) {
          // Transformamos los cursos faltantes para que el componente Alertas los pueda mostrar
          const cursosFaltantesComoConflictos = errorData.cursos_faltantes.map(curso => ({
            mensaje: `Falta asignar el curso: ${curso}`
          }));
          setConflictos(cursosFaltantesComoConflictos);
        }
      } else {
        setError('Error al publicar el horario');
      }
    }
  };

  const handleGuardarPlanificacion = (cursoId, grupos) => {
    setPlanificaciones(prev => ({
      ...prev,
      [cursoId]: grupos
    }));
  };

  const handleAbrirPlanificador = (curso) => {
    setCursoParaPlanificar(curso);
    setShowPlanificadorModal(true);
  };

  const handleAsignarSesion = async (salonId) => {
    if (!sesionParaAsignar || !horarioActual) return;

    const { curso, grupo, sesion, dia, hora_inicio, hora_fin } = sesionParaAsignar;

    try {
      await axios.post(`/api/horarios/${horarioId}/asignar-curso`, {
        horario_id: horarioActual.idHorario,
        curso_id: curso.idCurso,
        profesor_id: grupo.profesorId,
        grupo: grupo.id,
        estudiantes: grupo.estudiantes,
        dia: dia,
        hora_inicio: hora_inicio,
        hora_fin: hora_fin,
        salon_id: salonId
      });
      
      // --- LÓGICA CORREGIDA: Eliminar solo la sesión específica por ID ---
      setPlanificaciones(prevPlanificaciones => {
        const cursoId = curso.idCurso.toString();
        const nuevasPlanificaciones = JSON.parse(JSON.stringify(prevPlanificaciones));
        const gruposDelCurso = nuevasPlanificaciones[cursoId];

        if (gruposDelCurso) {
          const grupoAActualizar = gruposDelCurso.find(g => g.id === grupo.id);
          if (grupoAActualizar) {
            // Buscar la sesión por su ID único en lugar de por duración
            const sesionIndex = grupoAActualizar.sesiones.findIndex(s => s.id === sesion.id);
            
            // Si se encuentra, eliminar solo esa sesión específica
            if (sesionIndex > -1) {
              grupoAActualizar.sesiones.splice(sesionIndex, 1);
            }
          }
        }
        
        return nuevasPlanificaciones;
      });

      await cargarHorarioGrid(horarioId);
      await validarConflictos();

    } catch (error) {
      console.error('Error al asignar sesión:', error);

      if (error.response?.data?.conflictos) {
        setConflictos(error.response.data.conflictos);
      } else {
        setError('Error al asignar la sesión. ' + (error.response?.data?.message || ''));
      }
    } finally {
      setShowAsignarSesionModal(false);
      setSesionParaAsignar(null);
    }
  };

  // --- INICIO: Lógica mejorada para determinar cursos pendientes ---
  // 1. Obtener los IDs de los cursos que ya están en el grid.
  const cursosAsignadosEnGrid = new Set(Object.values(horarioGrid).map(item => item.idCurso));

  const cursosPendientes = cursosDisponibles.filter(curso => {
    // 2. Si el curso ya está en el grid, no está pendiente.
    if (cursosAsignadosEnGrid.has(curso.idCurso)) {
      return false;
    }

    // 3. Si no está en el grid, aplicar la lógica de planificación.
    const plan = planificaciones[curso.idCurso];
    if (!plan) return true; // Si no tiene planificación, está pendiente.
    const totalSesionesRestantes = plan.reduce((acc, grupo) => acc + grupo.sesiones.length, 0);
    return totalSesionesRestantes > 0; // Si tiene sesiones planificadas por asignar, está pendiente.
  });

  const cursosAsignados = Object.values(horarioGrid)
  .map(c => c.idCurso)
  .filter((id, index, array) => array.indexOf(id) === index);

  return {
    // Estados
    selectedPeriodo,
    setSelectedPeriodo,
    selectedCiclo,
    setSelectedCiclo,
    draggedItem,
    horarioGrid,
    conflictos,
    loading,
    error,
    cursosDisponibles,
    profesores,
    salones,
    cursosPendientes,
    planificaciones,
    showPlanificadorModal,
    setShowPlanificadorModal,
    cursoParaPlanificar,
    showAsignarSesionModal,
    setShowAsignarSesionModal,
    sesionParaAsignar,
    
    // Funciones
    cursosAsignados,
    handleDragStart,
    handleDrop,
    handleEliminarAsignacion,
    handleGuardarPlanificacion,
    handleAbrirPlanificador,
    handleAsignarSesion,
    validarConflictos,
    publicarHorario
  };
};