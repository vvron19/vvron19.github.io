import React from 'react';

/**
 * Componente para mostrar el resumen mensual de gastos y el gráfico de pastel.
 */
const ResumenMensual = ({
  monthlyTotal,
  necessaryTotal,
  unnecessaryTotal,
  necessaryPercentage,
  unnecessaryPercentage,
  currentMonth
}) => {

  /**
   * Componente interno para el gráfico de pastel (Pie Chart).
   * Utiliza SVG para dibujar el gráfico basado en los porcentajes.
   */
  const PieChart = ({ necPercent, unnecPercent }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    // Calcular los trazos para cada segmento
    const necStrokeDasharray = (circumference * necPercent) / 100;
    const unnecStrokeDasharray = (circumference * unnecPercent) / 100;

    // Calcular los desplazamientos (offsets)
    // El segmento necesario (verde) empieza al 25% (equivale a las 12 en punto)
    const necStrokeOffset = circumference * 0.25;
    // El segmento innecesario (rojo) empieza donde termina el verde
    const unnecStrokeOffset = necStrokeOffset - necStrokeDasharray;

    return (
      <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
        {/* Círculo base (gris claro) */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e7eb" // gray-200
          strokeWidth="20"
        />

        {/* Segmento Necesario (Verde) */}
        {necPercent > 0 && (
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#10B981" // green-500
            strokeWidth="20"
            strokeDasharray={`${necStrokeDasharray} ${circumference}`}
            strokeDashoffset={-necStrokeOffset}
            className="transition-all duration-500 ease-in-out"
          />
        )}

        {/* Segmento Innecesario (Rojo) */}
        {unnecPercent > 0 && (
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#EF4444" // red-500
            strokeWidth="20"
            strokeDasharray={`${unnecStrokeDasharray} ${circumference}`}
            strokeDashoffset={-unnecStrokeOffset}
            className="transition-all duration-500 ease-in-out"
          />
        )}
      </svg>
    );
  };

  return (
    <section className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">
        Resumen de {currentMonth}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Lado Izquierdo: Gráfico y Total */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
          <PieChart necPercent={necessaryPercentage} unnecPercent={unnecessaryPercentage} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500">Gasto Total</span>
            <span className="text-3xl sm:text-4xl font-extrabold text-gray-800">
              ${monthlyTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Lado Derecho: Desglose */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-700">Gastos Necesarios</p>
              <p className="text-sm text-gray-500">{necessaryPercentage.toFixed(1)}%</p>
            </div>
            <span className="text-lg font-bold text-green-600">
              ${necessaryTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-700">Gastos Innecesarios</p>
              <p className="text-sm text-gray-500">{unnecessaryPercentage.toFixed(1)}%</p>
            </div>
            <span className="text-lg font-bold text-red-600">
              ${unnecessaryTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumenMensual;