// components/ConfiguracionPeriodo.js
import React, { useEffect } from 'react';

const ConfiguracionPeriodo = ({ selectedPeriodo, setSelectedPeriodo, selectedCiclo, setSelectedCiclo, isEditing = false }) => {
  
  // **SOLUCIÓN: Sincronizar el ciclo cuando cambia la etapa**
  useEffect(() => {
    if (selectedPeriodo.etapa === 'I' && parseInt(selectedCiclo) % 2 === 0) {
      setSelectedCiclo('1'); // Si es Etapa I, el ciclo debe ser impar
    } else if (selectedPeriodo.etapa === 'II' && parseInt(selectedCiclo) % 2 !== 0) {
      setSelectedCiclo('2'); // Si es Etapa II, el ciclo debe ser par
    }
  }, [selectedPeriodo.etapa]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Configuración del Periodo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
          <select 
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black disabled:bg-gray-100"
            value={selectedPeriodo.año}
            onChange={(e) => setSelectedPeriodo({...selectedPeriodo, año: e.target.value})}
            disabled={isEditing}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Etapa</label>
          <select 
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black disabled:bg-gray-100"
            value={selectedPeriodo.etapa}
            onChange={(e) => setSelectedPeriodo({...selectedPeriodo, etapa: e.target.value})}
            disabled={isEditing}
          >
            <option value="I">I</option>
            <option value="II">II</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ciclo a Visualizar</label>
          <select 
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            value={selectedCiclo}
            onChange={(e) => setSelectedCiclo(e.target.value)}
          >
            {selectedPeriodo.etapa === 'I' ? 
              [1,3,5,7,9].map(c => (
                <option key={c} value={c}>{c}° Ciclo</option>
              )) : 
              [2,4,6,8,10].map(c => (
                <option key={c} value={c}>{c}° Ciclo</option>
              ))
            }
          </select>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPeriodo;