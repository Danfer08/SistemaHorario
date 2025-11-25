
// hooks/useHorario.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { configurarAxios, calcularHoraFin } from '../utils/horarioUtils';
import { useToast } from "../../../contexts/ToastContext";

export const useHorario = (horarioId) => {
  const { showToast } = useToast();
  const [selectedPeriodo, setSelectedPeriodo] = useState({ año: '2025', etapa: 'I' });
  const [selectedCiclo, setSelectedCiclo] = useState('1');
  const [draggedItem, setDraggedItem] = useState(null);
  const [horarioGrid, setHorarioGrid] = useState({});
  const [conflictos, setConflictos] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null); // Replaced by Toast
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
  const [showIrregulares, setShowIrregulares] = useState(false);
  const [cursosIrregulares, setCursosIrregulares] = useState([]);

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
      if (showIrregulares) {
        cargarCursosIrregulares();
      } else {
        setCursosIrregulares([]);
      }
      cargarHorarioGrid(horarioActual.idHorario);
    }
  }, [selectedCiclo, showIrregulares]); // Se quitaron dependencias para evitar recargas no deseadas

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
      showToast('Error al cargar los datos iniciales', 'error');
    }
  };

  const cargarCursosPorCiclo = async (cicloParam = selectedCiclo) => {
    try {
      const response = await axios.get(`/api/cursos/ciclo/${cicloParam}`);
      setCursosDisponibles(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      showToast('Error al cargar los cursos del ciclo', 'error');
    }
  };

  const cargarCursosIrregulares = async () => {
    try {
      const response = await axios.get(`/api/cursos/irregulares/${selectedCiclo}`);
      setCursosIrregulares(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar cursos irregulares:', error);
    }
  };

  const toggleIrregulares = () => {
    setShowIrregulares(!showIrregulares);
  };

  const cargarHorario = async (id) => {
    try {
      setLoading(true); // Iniciar carga
      // setError(null);

      // 1. Cargar los datos principales del horario
      const response = await axios.get(`/api/horarios/${id}`);
      const horario = response.data.data;
      setHorarioActual(horario);
      setSelectedPeriodo({ año: horario.año, etapa: horario.etapa });

      // Determinar el ciclo inicial correcto basado en la etapa
      let cicloInicial = selectedCiclo;
      if (horario.etapa === 'II' && parseInt(selectedCiclo) % 2 !== 0) {
        cicloInicial = '2';
        setSelectedCiclo('2');
      } else if (horario.etapa === 'I' && parseInt(selectedCiclo) % 2 === 0) {
        cicloInicial = '1';
        setSelectedCiclo('1');
      }

      await cargarCursosPorCiclo(cicloInicial);
      await cargarHorarioGrid(horario.idHorario, cicloInicial);


      // Actualizar el ciclo en la UI al final
    } catch (error) {
      console.error('Error al cargar el horario:', error);
      showToast('Error al cargar el horario. Puede que no exista.', 'error');
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
          salon: { id: item.salon_id },
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
      showToast('Ya hay una sesión asignada en este horario', 'warning');
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
      showToast('Asignación eliminada correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar asignación:', error);
      showToast('Error al eliminar la asignación', 'error');
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
    // setError(null);
    setConflictos([]);

    try {
      const response = await axios.post(`/api/horarios/${horarioActual.idHorario}/publicar`);
      showToast(response.data.message || 'Horario publicado exitosamente', 'success');
      // Aquí podrías agregar una redirección o actualización de la UI
    } catch (error) {
      console.error('Error al publicar horario:', error);

      if (error.response?.data) {
        const errorData = error.response.data;
        // Establecer el mensaje de error principal que viene del backend
        showToast(errorData.message || 'No se pudo publicar el horario.', 'error');

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
        showToast('Error al publicar el horario', 'error');
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
        salon_id: salonId,
        tipo: showIrregulares ? 'irregular' : 'regular'
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
      showToast('Sesión asignada correctamente', 'success');

    } catch (error) {
      console.error('Error al asignar sesión:', error);

      if (error.response?.data?.conflictos) {
        setConflictos(error.response.data.conflictos);
        showToast('Conflicto detectado al asignar sesión', 'warning');
      } else {
        showToast('Error al asignar la sesión. ' + (error.response?.data?.message || ''), 'error');
      }
    } finally {
      setShowAsignarSesionModal(false);
      setSesionParaAsignar(null);
    }
  };

  // --- Nueva Lógica de Edición ---
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [asignacionParaEditar, setAsignacionParaEditar] = useState(null);

  const handleEditarAsignacion = (asignacion) => {
    setAsignacionParaEditar(asignacion);
    setShowEditarModal(true);
  };

  const guardarEdicionAsignacion = async (horarioCursoId, nuevoProfesorId) => {
    try {
      await axios.post(`/api/horarios/${horarioActual.idHorario}/actualizar-asignacion`, {
        horario_curso_id: horarioCursoId,
        profesor_id: nuevoProfesorId
      });
      
      showToast('Profesor actualizado correctamente', 'success');
      setShowEditarModal(false);
      setAsignacionParaEditar(null);
      await cargarHorarioGrid(horarioActual.idHorario);
      await validarConflictos();
    } catch (error) {
      console.error('Error al actualizar asignación:', error);
      showToast(error.response?.data?.message || 'Error al actualizar el profesor', 'error');
    }
  };

  // --- INICIO: Lógica mejorada para determinar cursos pendientes ---
  // 1. Obtener los IDs de los cursos que ya están en el grid.
  const cursosAsignadosEnGrid = new Set(Object.values(horarioGrid).map(item => item.idCurso));

  const todosLosCursos = [...cursosDisponibles, ...cursosIrregulares];

  const cursosPendientes = todosLosCursos.filter(curso => {
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
    // error, // Removed
    
    cursosDisponibles: [...cursosDisponibles, ...cursosIrregulares],
    profesores,
    salones,
    cursosPendientes,
    planificaciones,
    showPlanificadorModal,
    setShowPlanificadorModal,
    cursoParaPlanificar,
    showAsignarSesionModal,
    setShowAsignarSesionModal,
    showAsignarSesionModal,
    setShowAsignarSesionModal,
    sesionParaAsignar,
    showEditarModal,
    setShowEditarModal,
    asignacionParaEditar,
    handleEditarAsignacion,
    guardarEdicionAsignacion,

    // Funciones
    cursosAsignados,
    handleDragStart,
    handleDrop,
    handleEliminarAsignacion,
    handleGuardarPlanificacion,
    handleAbrirPlanificador,
    handleAsignarSesion,
    validarConflictos,
    validarConflictos,
    publicarHorario,
    showIrregulares,
    toggleIrregulares,
    generarHorarioAutomatico: async () => {
      if (!horarioActual) return;
      setLoading(true);
      try {
        const response = await axios.post(`/api/horarios/${horarioActual.idHorario}/generar-automatico`);
        
        let mensaje = response.data.message;
        if (response.data.errores && response.data.errores.length > 0) {
           mensaje += '\n\nAdvertencias:\n' + response.data.errores.join('\n');
           showToast(mensaje, 'warning', 10000); // Long duration for warnings
        } else {
           showToast(mensaje, 'success');
        }
        
        await cargarHorarioGrid(horarioActual.idHorario);
        await validarConflictos();
        await cargarCursosPorCiclo(); 
      } catch (error) {
        console.error('Error al generar horario automático:', error);
        const errorMsg = error.response?.data?.message || error.message;
        const errorDetalle = error.response?.data?.error || '';
        showToast(`Error al generar horario automático: ${errorMsg}`, 'error');
        // setError('Error al generar horario automático: ' + errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };
};