// components/Alertas.js
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Alertas = ({ error, conflictos }) => {
  return (
    <>
      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Alertas de Conflictos */}
      {conflictos.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">⚠️ Conflictos Detectados ({conflictos.length})</h3>
              <ul className="space-y-1">
                {conflictos.map((conf, idx) => (
                  <li key={idx} className="text-sm text-red-700">• {conf.mensaje}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Alertas;