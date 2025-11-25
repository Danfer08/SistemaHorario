// components/HorarioGrid.js
import React from 'react';
import { X } from 'lucide-react';
import { dias, horas } from '../utils/horarioUtils';

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
  handleEditarAsignacion,
  isReadOnly = false 
}) => {
  
  // Mapeo de días y horas a índices de grid
  // Grid Rows: 1 (Header) + 16 (Hours 7-22) = 17 rows
  // Grid Cols: 1 (Time Label) + 6 (Days Mon-Sat) = 7 cols
  // Wait, dias array usually has 6 days (Mon-Sat).
  
  return (
    <div className="min-w-[900px] overflow-x-auto">
      <div 
        className="grid gap-1"
        style={{
          gridTemplateColumns: '80px repeat(6, 1fr)', // 1 col for time, 6 for days
          gridTemplateRows: `40px repeat(${horas.length}, 80px)` // Header + Hours
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

        {/* Drop Targets (Background) */}
        {dias.map((dia, dIndex) => (
           horas.map((hora, hIndex) => (
             <div 
               key={`bg-${dia}-${hora}`} 
               className={`rounded-lg border-2 border-dashed border-gray-200 ${!isReadOnly ? 'hover:border-blue-400 hover:bg-blue-50' : ''}`}
               style={{ gridColumnStart: dIndex + 2, gridRowStart: hIndex + 2 }}
               onDrop={() => !isReadOnly && handleDrop(dia, hora)}
               onDragOver={(e) => !isReadOnly && e.preventDefault()}
             >
                {!isReadOnly && (
                  <div className="h-full flex items-center justify-center text-gray-300 text-xs select-none">
                    +
                  </div>
                )}
             </div>
           ))
        ))}

        {/* Sessions (Foreground) */}
        {Object.values(horarioGrid).map(asignacion => {
           const dIndex = dias.indexOf(asignacion.dia);
           const hIndex = horas.indexOf(asignacion.hora);
           
           if (dIndex === -1 || hIndex === -1) return null;

           const colStart = dIndex + 2;
           const rowStart = hIndex + 2;
           const rowSpan = getDuracionEnHoras(asignacion.hora, asignacion.hora_fin);
           
           return (
             <div 
               key={asignacion.id}
               style={{ 
                 gridColumnStart: colStart, 
                 gridRowStart: rowStart, 
                 gridRowEnd: `span ${rowSpan}`,
                 zIndex: 10
               }}
               className="p-1"
             >
               <div className="h-full w-full bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-400 rounded-lg shadow-sm p-2 relative overflow-hidden flex flex-col justify-center">
                  {!isReadOnly && (
                    <div className="absolute top-1 right-1 flex gap-1 z-20">
                      <button
                        onClick={() => handleEditarAsignacion(asignacion)}
                        className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                        title="Editar Profesor"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </button>
                      <button
                        onClick={() => handleEliminarAsignacion(asignacion.dia + '-' + asignacion.hora)}
                        className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        title="Eliminar"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div className="text-xs text-center">
                    <p className="font-bold text-blue-900 mb-1 leading-tight">{asignacion.nombre}</p>
                    <p className="text-gray-700 mb-1">Grupo {asignacion.grupo}</p>
                    {asignacion.profesor && (
                      <p className="text-gray-600 font-medium truncate">{asignacion.profesor.nombre}</p>
                    )}
                    {asignacion.salon && (
                      <p className="text-blue-600 font-medium mt-1">Salon: {asignacion.salon.codigo || asignacion.salon.id}</p>
                    )}
                  </div>
               </div>
             </div>
           )
        })}
      </div>
    </div>
  );
};

export default HorarioGrid;