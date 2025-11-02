// components/PanelCursos.js
import React from 'react';
import { Plus, CheckCircle } from 'lucide-react';

const PanelCursos = ({ cursosPendientes, handleDragStart, cursosAsignados, cursosDisponibles }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cursos Pendientes</h3>
        
        {cursosPendientes.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Todos los cursos asignados</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {cursosPendientes.map(curso => (
              <div
                key={curso.idCurso}
                draggable
                onDragStart={() => handleDragStart(curso)}
                className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg cursor-move hover:bg-blue-100 hover:border-blue-400 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{curso.nombre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        {curso.horas_totales}h
                      </span>
                      <span className="text-xs text-gray-600">Ciclo {curso.ciclo}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        curso.tipo_curso === 'obligatorio' 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-purple-200 text-purple-800'
                      }`}>
                        {curso.tipo_curso}
                      </span>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-blue-600 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-2">Progreso:</p>
            <div className="flex justify-between mb-1">
              <span>Asignados</span>
              <span className="font-bold text-blue-600">{cursosAsignados.length}/{cursosDisponibles.length}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(cursosAsignados.length / cursosDisponibles.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelCursos;