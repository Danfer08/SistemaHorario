// views/CrearHorarioView.js
import React from 'react';
import { Clock, Download } from 'lucide-react';

// Hooks y componentes
import { useHorario } from '../crearHorario/hook/horarioHooks';
import ModalAsignacion from '../crearHorario/modalAssignHorario';
import HorarioGrid from '../crearHorario/others/gridHorario';
import PanelCursos from '../crearHorario/others/panelCursos';
import ConfiguracionPeriodo from '../crearHorario/others/configPeriodo';
import Alertas from '../crearHorario/others/alerts';

const ViewVerhorario = ({ horarioId }) => {
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
    cursosAsignados,
    cursosDisponibles,
  } = useHorario(horarioId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">Ver Horario Publicado</h1>
            </div>
            <p className="text-gray-600">Este horario está confirmado y no puede ser modificado.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Download className="w-4 h-4" />
              Descargar PDF
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
        isEditing={true}
      />

      {/* Alertas */}
      <Alertas error={error} conflictos={conflictos} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel Lateral - Cursos Disponibles */}
        <PanelCursos 
          cursosPendientes={[]} // No mostrar cursos pendientes en modo vista
          cursosAsignados={cursosAsignados}
          cursosDisponibles={cursosDisponibles}
        />

        {/* Grid de Horario */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Horario - {selectedCiclo}° Ciclo | {selectedPeriodo.año}-{selectedPeriodo.etapa}
            </h3>

            <HorarioGrid 
              horarioGrid={horarioGrid}
              selectedCiclo={selectedCiclo}
              selectedPeriodo={selectedPeriodo}
              isReadOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVerhorario;