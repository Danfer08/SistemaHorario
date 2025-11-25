// views/CrearHorarioView.js
import React from 'react';
import { Clock, CheckCircle, Loader, AlertTriangle, Sparkles } from 'lucide-react';

// Hooks y componentes
import { useHorario } from '../crearHorario/hook/horarioHooks';
import HorarioGrid from '../crearHorario/others/gridHorario';
import PanelCursos from '../crearHorario/others/panelCursos';
import ConfiguracionPeriodo from '../crearHorario/others/configPeriodo';
import Alertas from '../crearHorario/others/alerts';
import ModalPlanificadorGrupos from './ModalPlanificadorGrupos';
import ModalAsignarSesion from './ModalAsignarSesion';
import ModalEditarAsignacion from './ModalEditarAsignacion';

const CrearHorarioView = ({ horarioId }) => {
  const {
    // Estados
    selectedPeriodo,
    setSelectedPeriodo,
    selectedCiclo,
    setSelectedCiclo,
    horarioGrid,
    conflictos,
    loading,
    error,
    cursosPendientes,
    profesores,
    salones,
    planificaciones,
    showPlanificadorModal,
    setShowPlanificadorModal,
    cursoParaPlanificar,
    showAsignarSesionModal,
    setShowAsignarSesionModal,
    sesionParaAsignar,
    cursosAsignados,
    cursosDisponibles,
    // Funciones
    handleDragStart,
    handleDrop,
    handleEliminarAsignacion,
    handleGuardarPlanificacion,
    handleAbrirPlanificador,
    handleAsignarSesion,
    validarConflictos,
    publicarHorario,
    showIrregulares,
    toggleIrregulares,
    generarHorarioAutomatico,
    showEditarModal,
    setShowEditarModal,
    asignacionParaEditar,
    handleEditarAsignacion,
    guardarEdicionAsignacion
  } = useHorario(horarioId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 relative">
      {/* --- INICIO: INDICADOR DE CARGA --- */}
      {loading && horarioId && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-start justify-center pt-40 z-50">
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="mt-4 text-lg text-gray-700">Cargando horario...</p>
          </div>
        </div>
      )}
      {/* --- FIN: INDICADOR DE CARGA --- */}

      {/* Ocultar contenido principal mientras carga para evitar parpadeos */}
      <div style={{ visibility: loading && horarioId ? 'hidden' : 'visible' }}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-800">Crear Horario</h1>
              </div>
              <p className="text-gray-600">Sistema de asignación de horarios con validaciones automáticas</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={validarConflictos}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                <AlertTriangle className="w-4 h-4" />
                Validar Conflictos
              </button>
              <button
                onClick={generarHorarioAutomatico}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Creación de Horario Automática
              </button>
              <button
                onClick={publicarHorario}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Publicar Horario
              </button>
            </div>
          </div>
        </div>

        {/* Configuración */}
        <ConfiguracionPeriodo
          selectedPeriodo={selectedPeriodo}
          setSelectedPeriodo={setSelectedPeriodo}
          selectedCiclo={selectedCiclo}
          setSelectedCiclo={setSelectedCiclo}
          isEditing={true} // Deshabilitar selectores
        />

        {/* Alertas */}
        <Alertas error={error} conflictos={conflictos} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel Lateral - Cursos Disponibles */}
          <PanelCursos
            cursosAsignados={cursosAsignados}
            cursosPendientes={cursosPendientes}
            cursosDisponibles={cursosDisponibles}
            profesores={profesores}
            planificaciones={planificaciones}
            handleAbrirPlanificador={handleAbrirPlanificador}
            handleDragStart={handleDragStart}
            showIrregulares={showIrregulares}
            toggleIrregulares={toggleIrregulares}
          />

          {/* Grid de Horario */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Horario - {selectedCiclo}° Ciclo | {selectedPeriodo.año}-{selectedPeriodo.etapa}
              </h3>

              <HorarioGrid
                horarioGrid={horarioGrid}
                handleDrop={handleDrop}
                handleEliminarAsignacion={handleEliminarAsignacion}
                handleEditarAsignacion={handleEditarAsignacion}
                selectedCiclo={selectedCiclo}
                selectedPeriodo={selectedPeriodo}
              />
            </div>
          </div>
        </div>

        {/* Modal para Planificar Grupos y Sesiones */}
        <ModalPlanificadorGrupos
          show={showPlanificadorModal}
          onClose={() => setShowPlanificadorModal(false)}
          curso={cursoParaPlanificar}
          profesores={profesores}
          onSavePlanificacion={handleGuardarPlanificacion}
        />

        {/* Modal para Asignar Salón a una Sesión */}
        <ModalAsignarSesion
          show={showAsignarSesionModal}
          onClose={() => setShowAsignarSesionModal(false)}
          sesion={sesionParaAsignar}
          salones={salones}
          onAsignar={handleAsignarSesion}
        />

        {/* Modal para Editar Asignación (Profesor) */}
        <ModalEditarAsignacion
          show={showEditarModal}
          onClose={() => setShowEditarModal(false)}
          asignacion={asignacionParaEditar}
          profesores={profesores}
          onSave={guardarEdicionAsignacion}
        />
      </div>
    </div>
  );
};

export default CrearHorarioView;