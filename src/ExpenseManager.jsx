// En src/ExpenseManager.jsx

import React, { useState } from 'react';

// Recibimos props de App.jsx, incluyendo la función formatCurrency
const ExpenseManager = ({ expenses, addExpense, deleteExpense, formatCurrency }) => { 
  
  // ESTADOS PRINCIPALES
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', isNecessary: false });
  const [goals, setGoals] = useState([
    { id: 1, name: "Viaje de Graduación", target: 2000.00, saved: 500.00 },
    { id: 2, name: "Laptop Nueva", target: 800.00, saved: 100.00 }
  ]);

  // ESTADOS DE UI/FORMULARIO DE METAS
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });
  const [activeDepositId, setActiveDepositId] = useState(null); 
  const [depositAmount, setDepositAmount] = useState(''); 

  // LÓGICA DE NEGOCIO DE METAS
  const deleteGoal = (idToDelete) => {
    setGoals(prevGoals => {
      if (activeDepositId === idToDelete) {
        setActiveDepositId(null);
        setDepositAmount('');
      }
      return prevGoals.filter(goal => goal.id !== idToDelete);
    });
  };
  
  // FUNCIÓN PARA AÑADIR DINERO A LA META
  const addGoalDeposit = (e, goalId) => {
    e.preventDefault();
    // 🚨 Al cambiar a input type="text", el valor puede incluir separadores.
    // parseFloat() y Number() ignoran el punto de miles, pero es más seguro limpiar
    // el valor antes de parsear, especialmente si el usuario usa coma como decimal.
    const cleanValue = depositAmount.replace(/\./g, '').replace(/,/g, '.'); // Convierte 1.000,00 a 1000.00
    const amount = parseFloat(cleanValue);

    if (amount > 0 && goalId) {
      setGoals(prevGoals => prevGoals.map(goal => {
        if (goal.id === goalId) {
          const newSaved = Math.min(goal.saved + amount, goal.target);
          return { ...goal, saved: newSaved };
        }
        return goal;
      }));
      
      setDepositAmount('');
      setActiveDepositId(null);
    }
  };


  // MANEJADORES DE EVENTOS DE GASTO
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    // Si es un campo de monto, guardamos el valor crudo (incluyendo puntos/comas) en el estado
    // pero el parseFloat en handleSubmit se encargará de guardarlo como número.
    // Para simplificar, solo guardamos el texto que escribió el usuario.
    setNewExpense(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 🚨 Limpiamos y parseamos el monto antes de guardar el gasto
    const cleanAmount = newExpense.amount.replace(/\./g, '').replace(/,/g, '.');
    const finalAmount = parseFloat(cleanAmount);
    
    if (finalAmount > 0) {
        addExpense({ ...newExpense, amount: finalAmount }); 
        setNewExpense({ description: '', amount: '', isNecessary: false });
    }
  };
  
  // MANEJADORES DE EVENTOS DE CREACIÓN DE META

  const handleGoalInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddGoalSubmit = (e) => {
    e.preventDefault();
    
    // 🚨 Limpiamos y parseamos el target antes de crear la meta
    const cleanTarget = newGoal.target.replace(/\./g, '').replace(/,/g, '.');
    const finalTarget = parseFloat(cleanTarget);
    
    if (newGoal.name && finalTarget > 0) {
      const goalWithId = {
        ...newGoal,
        id: Date.now(),
        target: finalTarget,
        saved: 0.00
      };
      setGoals(prevGoals => [...prevGoals, goalWithId]);
      
      setNewGoal({ name: '', target: '' });
      setIsGoalFormOpen(false);
    }
  };

  // Función local para formatear solo el valor de un input (sin símbolo de $)
  const formatInputValue = (value) => {
    // Si el valor es una cadena vacía o no es numérico, devolvemos la cadena original
    if (!value || isNaN(value.toString().replace(/\./g, '').replace(/,/g, '.'))) {
        return value;
    }
    // Convertimos la cadena limpia a número para formatear (ej: "1000.00" -> 1000)
    const numericValue = parseFloat(value.toString().replace(/\./g, '').replace(/,/g, '.'));

    // Usamos NumberFormat para la vista. Máximo 2 decimales para que no se extienda.
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(numericValue);
  };


  return (
    <div className="p-6">
      
      {/* ======================================= */}
      {/* SECCIÓN 1: REGISTRAR NUEVO GASTO */}
      {/* ======================================= */}
      <form onSubmit={handleSubmit} className="mt-6 border-t border-gray-200 pt-4">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">Registrar Nuevo Gasto</h2>
        
        <div className="space-y-4">
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción del Gasto</label>
            <input
              type="text"
              id="description"
              placeholder="Ej: Materiales de estudio"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              value={newExpense.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto ($)</label>
            <input
              // 🚨 CAMBIO CLAVE: Usamos type="text" para permitir el formato
              type="text"
              id="amount"
              placeholder="0.00"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              // 🚨 APLICAR FORMATO VISUAL AL VALOR
              value={formatInputValue(newExpense.amount)}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isNecessary"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              checked={newExpense.isNecessary}
              onChange={handleInputChange}
            />
            <label htmlFor="isNecessary" className="text-sm text-gray-700">
                ¿Es un gasto necesario? (Ej: Alquiler, Comida, Transporte)
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600 transition duration-150 shadow-md"
          >
            Guardar Gasto
          </button>
        </div>
      </form>

      
      {/* ======================================= */}
      {/* SECCIÓN 2: HISTORIAL DE GASTOS */}
      {/* ======================================= */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">Historial de Gastos</h2>

        {expenses.length > 0 ? (
            expenses.slice().reverse().map((expense) => { 
                const type = expense.isNecessary ? 'Necesario' : 'Innecesario';
                const colorClass = expense.isNecessary ? 'text-green-600' : 'text-red-600';

                return (
                    <div key={expense.id} className="flex justify-between items-center py-3 px-2 border-b last:border-b-0 hover:bg-gray-50 transition duration-100">
                        
                        <div className="flex flex-col flex-grow">
                            <span className="font-semibold text-gray-800">{expense.description}</span>
                            <span className={`text-xs ${colorClass}`}>
                                {type}
                            </span> 
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* APLICAR FORMATO A LOS GASTOS DEL HISTORIAL */}
                            <span className="font-bold text-lg text-red-600 w-24 text-right">
                                -{formatCurrency(expense.amount)}
                            </span>

                            <button
                                onClick={() => deleteExpense(expense.id)} 
                                className="text-gray-400 hover:text-red-500 transition duration-150 p-1 rounded-full hover:bg-red-100"
                                aria-label="Eliminar gasto"
                            >
                                🗑️ 
                            </button>
                        </div>
                    </div>
                );
            })
        ) : (
            <p className="text-center text-gray-500 text-sm italic p-4 bg-gray-50 rounded-lg">
                Aún no tienes gastos. ¡Registra uno!
            </p>
        )}
        
      </div>
      
      
      {/* ======================================= */}
      {/* SECCIÓN 3: METAS DE AHORRO */}
      {/* ======================================= */}
      <div className="mt-8 pb-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">Metas de Ahorro</h2>
        
        {goals.length > 0 ? (
            goals.map((goal) => {
                const percentage = Math.min((goal.saved / goal.target) * 100, 100);
                const isCompleted = percentage >= 100;
                
                return (
                    <div key={goal.id} className="bg-white p-4 rounded-xl shadow-md border border-indigo-200 mb-4">
                        
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{goal.name} {isCompleted ? '🎉' : '🎓'}</h3>
                            <button
                                onClick={() => deleteGoal(goal.id)} 
                                className="text-gray-400 hover:text-red-500 transition duration-150 p-1 rounded-full hover:bg-red-100"
                                aria-label="Eliminar meta"
                            >
                                🗑️ 
                            </button>
                        </div>

                        {/* APLICAR FORMATO A LOS DETALLES DE LA META */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Meta: {formatCurrency(goal.target)}</span>
                            <span className="font-bold text-indigo-700">Ahorrado: {formatCurrency(goal.saved)}</span>
                        </div>
                        
                        <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-indigo-500'} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-right text-indigo-500 mt-1">{percentage.toFixed(0)}% completado</p>
                        
                        
                        {/* FORMULARIO DE ABONO (DEPÓSITO) */}
                        {activeDepositId === goal.id && !isCompleted ? (
                            <form onSubmit={(e) => addGoalDeposit(e, goal.id)} className="mt-4 flex space-x-2 p-2 bg-indigo-50 rounded-lg">
                                <input
                                    // 🚨 CAMBIO CLAVE: Usamos type="text"
                                    type="text"
                                    placeholder="Monto a abonar ($)"
                                    // 🚨 APLICAR FORMATO VISUAL
                                    value={formatInputValue(depositAmount)}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    className="p-2 border border-indigo-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="py-2 px-3 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600 transition whitespace-nowrap"
                                >
                                    Abonar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDepositId(null);
                                      setDepositAmount('');
                                    }}
                                    className="py-2 px-3 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition"
                                >
                                    X
                                </button>
                            </form>
                        ) : (
                          // Botón para mostrar el formulario de depósito
                          !isCompleted && (
                            <div className="mt-3">
                                <button
                                    onClick={() => {
                                        setActiveDepositId(goal.id);
                                        setDepositAmount('');
                                    }}
                                    className="w-full py-2 px-4 rounded-lg text-indigo-700 font-semibold bg-indigo-100 hover:bg-indigo-200 transition duration-150"
                                >
                                    Abonar a esta meta
                                </button>
                            </div>
                          )
                        )}
                        {/* Mensaje de completado */}
                        {isCompleted && (
                          <p className="mt-3 text-center text-sm font-semibold text-green-600 bg-green-100 p-2 rounded-lg">
                            ¡Meta Completada! 🎉
                          </p>
                        )}
                    </div>
                );
            })
        ) : (
            <p className="text-center text-gray-500 text-sm italic mt-4 p-4 bg-gray-50 rounded-lg">
                No tienes metas de ahorro. ¡Empieza una hoy!
            </p>
        )}
        
        {/* FORMULARIO DE NUEVA META (CREACIÓN) */}
        {isGoalFormOpen && (
            <form onSubmit={handleAddGoalSubmit} className="p-4 bg-white shadow-lg border border-indigo-300 rounded-lg mb-4 space-y-3">
                <h3 className="text-lg font-semibold text-indigo-700">Configurar Nueva Meta</h3>
                
                {/* Campo Nombre de la Meta */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de la Meta</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Ej: Viaje a la playa"
                        value={newGoal.name}
                        onChange={handleGoalInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Monto Objetivo ($)</label>
                    <input
                        // 🚨 CAMBIO CLAVE: Usamos type="text"
                        type="text"
                        name="target"
                        placeholder="500.00"
                        // 🚨 APLICAR FORMATO VISUAL
                        value={formatInputValue(newGoal.target)}
                        onChange={handleGoalInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Botones de Acción de creación */}
                <div className="flex justify-end space-x-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsGoalFormOpen(false)}
                        className="py-2 px-4 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 rounded-lg text-white font-semibold bg-indigo-500 hover:bg-indigo-600 transition"
                    >
                        Crear Meta
                    </button>
                </div>
            </form>
        )}


        {/* BOTÓN DE AÑADIR NUEVA META (Toggle) */}
        <button
          onClick={() => {
            setIsGoalFormOpen(true);
            setActiveDepositId(null);
          }}
          disabled={isGoalFormOpen}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-150 border 
            ${isGoalFormOpen 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 border-indigo-300'}`}
        >
          {isGoalFormOpen ? 'Configurando nueva meta...' : 'Añadir nueva meta'}
        </button>
        
      </div>

    </div>
  );
};

export default ExpenseManager;