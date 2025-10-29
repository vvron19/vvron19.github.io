// En src/App.jsx

import { useState } from 'react';
import ResumenHeader from './ResumenHeader.jsx';
import ExpenseManager from './ExpenseManager.jsx';

// 🚨 CORRECCIÓN DE RUTA FINAL: Apunta a la carpeta 'assets'
import ImagenAsistente from './assets/Gemini_Generated_Image_q1ptapq1ptapq1pt.png'; 


// FUNCIÓN DE UTILIDAD: Formatea el número con separadores de miles
const formatCurrency = (number) => {
  const safeNumber = typeof number === 'number' && !isNaN(number) ? number : 0;
  
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'USD', 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeNumber).replace('US$', '').trim();
};


// Componente simple para la barra de bienvenida superior
const Bienvenida = ({ userId }) => (
  <div className="p-4 bg-green-600 text-white shadow-lg rounded-t-lg">
    <p className="text-sm opacity-90">Hola! Tu ID de usuario es: {userId}</p>
    <h1 className="text-xl font-bold mt-1">Gestor de Finanzas Estudiantil</h1>
  </div>
);

// NUEVO COMPONENTE: Modal Reutilizable
const Modal = ({ title, content, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl font-light leading-none"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
        <p className="text-gray-600">{content}</p>
        <button 
          onClick={onClose} 
          className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};


// COMPONENTE MODIFICADO: Botón Flotante del Asistente
const FloatingAssistantButton = ({ onOpenModal }) => {
  return (
    <div 
      className="fixed bottom-6 right-6 z-50" 
    >
      <button 
        className="w-16 h-16 rounded-full shadow-2xl hover:scale-105 transition duration-300 flex items-center justify-center p-0 overflow-hidden" 
        onClick={onOpenModal}
        aria-label="Abrir asistente virtual"
      >
        <img 
            src={ImagenAsistente} 
            alt="Ícono Asistente AI" 
            className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
};


function App() {
  // ESTADO CENTRAL: Lista de gastos
  const [expenses, setExpenses] = useState([
    { id: 1, description: "cafe", amount: 10.00, isNecessary: true },
    { id: 2, description: "Cine", amount: 25.00, isNecessary: false },
    { id: 3, description: "Alquiler", amount: 500.00, isNecessary: true },
  ]);

  // ESTADO PARA CONTROLAR EL MODAL DEL ASISTENTE
  const [showAssistantModal, setShowAssistantModal] = useState(false);

  const addExpense = (newExpense) => {
    const expenseWithId = {
      ...newExpense,
      id: Date.now(), 
      amount: parseFloat(newExpense.amount), 
    };
    setExpenses(prevExpenses => [...prevExpenses, expenseWithId]);
  };
  
  const deleteExpense = (idToDelete) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== idToDelete));
  };
  
  // CÁLCULO DE TOTALES
  const monthlyTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const necessaryTotal = expenses.filter(exp => exp.isNecessary)
                                .reduce((sum, exp) => sum + exp.amount, 0);
  const unnecessaryTotal = monthlyTotal - necessaryTotal;
  
  const userId = 'f819f7ad-cd84-4ef0-8ab2-c99c99b80030';
  const monthSummary = 'Octubre de 2025';

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-lg">
        
        <Bienvenida userId={userId} />
        
        <div className="p-6 border-b border-gray-200">
            <ResumenHeader 
                currentMonth={monthSummary}
                monthlyTotal={formatCurrency(monthlyTotal)}
                necessaryTotal={formatCurrency(necessaryTotal)}
                unnecessaryTotal={formatCurrency(unnecessaryTotal)}
            />
        </div>
        
        <ExpenseManager 
            expenses={expenses} 
            addExpense={addExpense} 
            deleteExpense={deleteExpense}
            formatCurrency={formatCurrency}
        />
        
      </div>
      
      {/* LLAMADA AL ASISTENTE FLOTANTE */}
      <FloatingAssistantButton onOpenModal={() => setShowAssistantModal(true)} />
      
      {/* COMPONENTE MODAL */}
      <Modal 
        title="Asistente Financiero 🤖"
        content="¡Hola! Soy tu asistente virtual. Aún estoy en fase beta, pero pronto podré ayudarte a analizar tus patrones de gasto, ofrecerte consejos de ahorro y proyectar tu presupuesto."
        isOpen={showAssistantModal}
        onClose={() => setShowAssistantModal(false)}
      />
      
    </div>
  );
}

export default App;