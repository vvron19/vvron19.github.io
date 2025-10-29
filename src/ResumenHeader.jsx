// En src/ResumenHeader.jsx

import React from 'react';

/**
 * Una tarjeta individual para el resumen del header.
 */
const ResumenCard = ({ title, amount, colorClass }) => {
  
  return (
    <div className={`bg-white p-4 rounded-xl shadow-md border-l-4 ${colorClass}`}>
      <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
      <p className="mt-1 text-2xl font-bold text-gray-900">
        $ {amount} 
      </p>
    </div>
  );
};

/**
 * Componente que muestra las 3 tarjetas de resumen.
 */
const ResumenHeader = ({ currentMonth, monthlyTotal, necessaryTotal, unnecessaryTotal }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Resumen de {currentMonth}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ResumenCard 
          title="Gasto Total del Mes" 
          amount={monthlyTotal} 
          colorClass="border-indigo-500"
        />
        <ResumenCard 
          title="Total Gastos Necesarios" 
          amount={necessaryTotal} 
          colorClass="border-green-500"
        />
        <ResumenCard 
          title="Total Gastos Innecesarios" 
          amount={unnecessaryTotal} 
          colorClass="border-red-500"
        />
      </div>
    </section>
  );
};

export default ResumenHeader;