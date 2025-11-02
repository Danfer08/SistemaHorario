import React, { useState } from "react";
import HorariosCalendar from "./horaria/HorariosCalendar";
import MiHorario from "./horaria/MiHorario";
import PlanAcademico from "./horaria/PlanAcademico";

function Horarios() {
  const [activeTab, setActiveTab] = useState('horario');

  const renderContent = () => {
    switch (activeTab) {
      case 'horario':
        return <HorariosCalendar />;
      case 'miHorario':
        return <MiHorario />;
      case 'plan':
        return <PlanAcademico />;
      default:
        return <HorariosCalendar />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('horario')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'horario'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Horarios
          </button>
          <button
            onClick={() => setActiveTab('miHorario')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'miHorario'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Mi Horario
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'plan'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Plan Académico
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow">
        {renderContent()}
      </div>
    </div>
  );
}

export default Horarios;
