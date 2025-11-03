// views/ViewVerHorario.js
import React from 'react';
import { Clock, Download, Eye } from 'lucide-react';

// Usar el hook especializado para solo lectura
import { useHorarioSoloLectura } from '../crearHorario/hook/viewhorarioHooks'; // O importa desde la nueva ubicación
import HorarioGrid from '../crearHorario/others/gridHorario';
import ConfiguracionPeriodo from '../crearHorario/others/configPeriodo';
import Alertas from '../crearHorario/others/alerts';

const ViewVerHorario = ({ horarioId }) => {
  const {
    selectedPeriodo,
    setSelectedPeriodo,
    selectedCiclo,
    setSelectedCiclo,
    horarioGrid,
    conflictos,
    loading,
    error,
    horarioActual
  } = useHorarioSoloLectura(horarioId);

  // Debug
  React.useEffect(() => {
    console.log('🔍 ViewVerHorario Debug:');
    console.log('horarioId:', horarioId);
    console.log('loading:', loading);
    console.log('error:', error);
    console.log('horarioGrid keys:', Object.keys(horarioGrid));
    console.log('horarioActual:', horarioActual);
  }, [horarioId, loading, error, horarioGrid, horarioActual]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando horario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  const totalSesiones = Object.keys(horarioGrid).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Horario Publicado</h1>
                {horarioActual && (
                  <p className="text-sm text-gray-500 mt-1">
                    Creado el: {new Date(horarioActual.fecha).toLocaleDateString('es-ES')} | 
                    Estado: <span className="font-semibold capitalize">{horarioActual.estado}</span>
                  </p>
                )}
              </div>
            </div>
            <p className="text-gray-600">
              {totalSesiones === 0 
                ? "Este horario está vacío." 
                : `Visualizando ${totalSesiones} sesiones programadas.`
              }
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md">
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Configuración - Modo solo lectura */}
      <ConfiguracionPeriodo 
        selectedPeriodo={selectedPeriodo}
        setSelectedPeriodo={setSelectedPeriodo}
        selectedCiclo={selectedCiclo}
        setSelectedCiclo={setSelectedCiclo}
        isReadOnly={true}
      />

      {/* Alertas */}
      <Alertas error={error} conflictos={conflictos} />

      {/* Grid de Horario */}
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Horario - {selectedCiclo}° Ciclo | {selectedPeriodo.año}-{selectedPeriodo.etapa}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            horarioActual?.estado === 'publicado' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {horarioActual?.estado === 'publicado' ? 'Publicado' : 'Borrador'}
          </span>
        </div>

        {totalSesiones === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No hay sesiones asignadas</h4>
            <p className="text-gray-600">Este horario no contiene ninguna sesión programada.</p>
          </div>
        ) : (
          <HorarioGrid 
            horarioGrid={horarioGrid}
            selectedCiclo={selectedCiclo}
            selectedPeriodo={selectedPeriodo}
            isReadOnly={true}
          />
        )}
      </div>
    </div>
  );
};

export default ViewVerHorario;