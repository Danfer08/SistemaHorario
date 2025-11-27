// hooks/useHorarioSoloLectura.js - VERSIÓN CORREGIDA
import { useState, useEffect } from 'react';
import axios from 'axios';
import { configurarAxios } from '../utils/horarioUtils';

export const useHorarioSoloLectura = (horarioId) => {
  const [selectedPeriodo, setSelectedPeriodo] = useState({ año: '2025', etapa: 'I' });
  const [selectedCiclo, setSelectedCiclo] = useState('1');
  const [horarioGrid, setHorarioGrid] = useState({});
  const [conflictos, setConflictos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [horarioActual, setHorarioActual] = useState(null);

  // Configurar axios
  useEffect(() => {
    configurarAxios();
  }, []);

  // Cargar datos del horario cuando cambie el horarioId
  useEffect(() => {
    if (horarioId) {
      cargarDatosHorario(horarioId);
    }
  }, [horarioId]);

  // Recargar grid cuando cambie el ciclo
  useEffect(() => {
    if (horarioId && selectedCiclo && horarioActual) {
      console.log('🔄 Cambió el ciclo, recargando grid...', selectedCiclo);
      cargarHorarioGrid(horarioId, selectedCiclo);
    }
  }, [selectedCiclo, horarioId, horarioActual]);

  const cargarDatosHorario = async (id) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Cargando datos del horario:', id);

      // 1. Cargar datos básicos del horario
      const horarioResponse = await axios.get(`/api/horarios/${id}`);
      const horario = horarioResponse.data.data;
      console.log('📋 Horario cargado:', horario);

      setHorarioActual(horario);
      setSelectedPeriodo({ año: horario.año, etapa: horario.etapa });

      // 2. Cargar el grid con el ciclo actual
      await cargarHorarioGrid(id, selectedCiclo);

    } catch (error) {
      console.error('❌ Error cargando horario:', error);
      setError('No se pudo cargar el horario. Puede que no exista o no tengas permisos.');
    } finally {
      setLoading(false);
    }
  };

  const cargarHorarioGrid = async (horarioId, ciclo) => {
    try {
      console.log(`📊 Cargando grid para horario ${horarioId}, ciclo ${ciclo}`);
      
      const response = await axios.get(`/api/horarios/${horarioId}/grid`, {
        params: {
          ciclo: ciclo
        }
      });

      console.log('📦 Respuesta del grid:', response.data);

      const gridData = {};
      
      if (response.data.data && Array.isArray(response.data.data)) {
        response.data.data.forEach(item => {
          const key = `${item.dia}-${item.hora_inicio || (item.hora ? item.hora.split('-')[0] : '00:00')}`;
          gridData[key] = {
            id: item.id, // ID ÚNICO de la sesión (detalle)
            horarioCursoId: item.horario_curso_id, // Guardamos también el ID del grupo por si acaso
            idCurso: item.curso_id,
            nombre: item.curso,
            profesor: { 
              id: item.profesor_id, 
              nombre: item.profesor || 'Sin profesor' 
            },
            salon: { 
              id: item.salon_id,
              codigo: item.salon || 'Sin salón' 
            },
            grupo: item.grupo || '1',
            estudiantes: item.estudiantes || 0,
            dia: item.dia,
            hora: item.hora_inicio || (item.hora ? item.hora.split('-')[0] : '00:00'),
            hora_fin: item.hora_fin || (item.hora ? item.hora.split('-')[1] : '00:00')
          };
        });
      } else {
        console.warn('⚠️ No hay datos en el grid o la estructura es incorrecta');
      }

      console.log('🗂️ Grid data procesado:', Object.keys(gridData).length, 'elementos');
      setHorarioGrid(gridData);
      
    } catch (gridError) {
      console.log('❌ Endpoint grid no disponible:', gridError);
      
      // Fallback: intentar cargar sin filtro de ciclo
      try {
        const response = await axios.get(`/api/horarios/${horarioId}/grid`);
        console.log('📦 Respuesta del grid (sin ciclo):', response.data);
        
        const gridData = {};
        if (response.data.data && Array.isArray(response.data.data)) {
          response.data.data.forEach(item => {
            // Filtrar por ciclo manualmente si es necesario
            if (!ciclo || item.ciclo == ciclo) {
              const key = `${item.dia}-${item.hora_inicio || (item.hora ? item.hora.split('-')[0] : '00:00')}`;
              gridData[key] = {
                id: item.id, // ID ÚNICO de la sesión
                horarioCursoId: item.horario_curso_id,
                idCurso: item.curso_id,
                nombre: item.curso,
                profesor: { 
                  id: item.profesor_id, 
                  nombre: item.profesor || 'Sin profesor' 
                },
                salon: { 
                  id: item.salon_id,
                  codigo: item.salon || 'Sin salón' 
                },
                grupo: item.grupo || '1',
                estudiantes: item.estudiantes || 0,
                dia: item.dia,
                hora: item.hora_inicio || (item.hora ? item.hora.split('-')[0] : '00:00'),
                hora_fin: item.hora_fin || (item.hora ? item.hora.split('-')[1] : '00:00')
              };
            }
          });
        }
        setHorarioGrid(gridData);
        
      } catch (error) {
        console.error('❌ Error en fallback:', error);
        setHorarioGrid({});
      }
    }
  };

  return {
    selectedPeriodo,
    setSelectedPeriodo,
    selectedCiclo,
    setSelectedCiclo,
    horarioGrid,
    conflictos,
    loading,
    error,
    horarioActual
  };
};