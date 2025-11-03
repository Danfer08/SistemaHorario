// components/ConfiguracionPeriodo.js
import React, { useEffect } from 'react';
import { useAcademicYears } from '../../../utils/yearsHorario'; 

const ConfiguracionPeriodo = ({ selectedPeriodo, setSelectedPeriodo, selectedCiclo, setSelectedCiclo, isEditing = false }) => {
  
  // **SOLUCIÓN: Sincronizar el ciclo cuando cambia la etapa**
  
  const { years } = useAcademicYears();
  
  useEffect(() => {
    // Solo sincronizar si el ciclo actual no es válido para la etapa seleccionada
    const cicloNum = parseInt(selectedCiclo);
    const esCicloImpar = cicloNum % 2 !== 0;
    const esCicloPar = cicloNum % 2 === 0;
    
    if (selectedPeriodo.etapa === 'I' && esCicloPar) {
      // Etapa I requiere ciclos impares, ajustar al ciclo impar más cercano
      const nuevoCiclo = Math.max(1, cicloNum - 1);
      setSelectedCiclo(nuevoCiclo.toString());
    } else if (selectedPeriodo.etapa === 'II' && esCicloImpar) {
      // Etapa II requiere ciclos pares, ajustar al ciclo par más cercano
      const nuevoCiclo = cicloNum === 1 ? 2 : cicloNum + 1;
      setSelectedCiclo(nuevoCiclo.toString());
    }
  }, [selectedPeriodo.etapa, selectedCiclo]);

  

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
                  {years.map(year => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
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