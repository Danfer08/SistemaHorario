// components/HorarioGrid.js
import React from 'react';
import { X } from 'lucide-react';
import { dias, horas, calcularHoraFin } from '../utils/horarioUtils';

const getDuracionEnHoras = (horaInicio, horaFin) => {
  if (!horaInicio || !horaFin) return 1;
  const [h1] = horaInicio.split(':').map(Number);
  const [h2] = horaFin.split(':').map(Number);
  return Math.max(1, h2 - h1);
};

const HorarioGrid = ({ 
  horarioGrid, 
  handleDrop, 
  handleEliminarAsignacion,
  selectedCiclo,
  selectedPeriodo,
  isReadOnly = false // Prop para modo de solo lectura
}) => {
  const asignacionesProcesadas = React.useMemo(() => {
    const grid = {};
    Object.values(horarioGrid).forEach(asignacion => {
      const duracion = getDuracionEnHoras(asignacion.hora, asignacion.hora_fin);
      const horaInicioNum = parseInt(asignacion.hora.split(':')[0], 10);

      for (let i = 0; i < duracion; i++) {
        const horaActual = `${(horaInicioNum + i).toString().padStart(2, '0')}:00`;
        const key = `${asignacion.dia}-${horaActual}`;
        grid[key] = {
          ...asignacion,
          isStart: i === 0, // Marcar si es la celda de inicio
        };
      }
    });
    return grid;
  }, [horarioGrid]);

  return (
    <div className="min-w-[900px]">
      <div className="grid grid-cols-7 gap-2">
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 rounded-lg font-semibold text-center text-sm">
          Hora
        </div>
        {dias.map(dia => (
          <div key={dia} className="bg-blue-600 text-white p-3 rounded-lg font-semibold text-center text-sm">
            {dia}
          </div>
        ))}

        {/* Grid Cells */}
        {horas.map(hora => (
          <React.Fragment key={hora}>
            <div className="bg-blue-50 p-3 rounded-lg font-medium text-center text-gray-700 text-sm flex items-center justify-center">
              {hora}
            </div>
            {dias.map(dia => {
              const key = `${dia}-${hora}`;
              const asignacion = asignacionesProcesadas[key];
              
              return (
                <div
                  key={key}
                  onDragOver={(e) => !isReadOnly && e.preventDefault()}
                  onDrop={() => !isReadOnly && handleDrop(dia, hora)}
                  className={`min-h-[90px] p-2 rounded-lg border-2 transition ${
                    asignacion 
                      ? `bg-gradient-to-br from-blue-100 to-blue-50 border-blue-400 shadow-sm ${!asignacion.isStart ? 'border-t-0 rounded-t-none' : ''}`
                      : `bg-white border-dashed border-gray-300 ${!isReadOnly ? 'hover:border-blue-400 hover:bg-blue-50' : ''}`
                  }`}
                >
                  {asignacion && asignacion.isStart ? (
                    <div className="relative">
                      {!isReadOnly && (
                        <button
                          onClick={() => handleEliminarAsignacion(key)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      <div className="text-xs">
                        <p className="font-bold text-blue-900 mb-1">{asignacion.nombre}</p>
                        <p className="text-gray-700">Grupo {asignacion.grupo}</p>
                        {asignacion.profesor && (
                          <p className="text-gray-600 truncate">{asignacion.profesor.nombre}</p>
                        )}
                        {asignacion.salon && (
                          <p className="text-blue-600 font-medium">Salon: {asignacion.salon.id}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    !asignacion && !isReadOnly && (
                      <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                        Arrastra aquí
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HorarioGrid;