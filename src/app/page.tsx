"use client";
import { useState, useEffect } from "react";

type Expense = {
  id: number;
  amt: number;
  dsc: string;
};

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [totalexpense, setExpense] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const stored_expenses = localStorage.getItem("expenses");
    if (stored_expenses) {
      const parsed = JSON.parse(stored_expenses);
      setExpenses(parsed);
      calculateTotal(parsed);
    }
  }, []);

  function calculateTotal(updatedExpenses: Expense[]) {
    const total = updatedExpenses.reduce((sum, exp) => sum + exp.amt, 0);
    setExpense(total);
  }

  function addExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newExpense: Expense = {
      id: Date.now(),
      amt: amount,
      dsc: description,
    };
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    calculateTotal(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
    setAmount(0);
    setDescription("");
  }

  function deleteExpense(del_id: number) {
    const updated = expenses.filter((exp) => exp.id !== del_id);
    setExpenses(updated);
    calculateTotal(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  }

  function clearAll() {
    if (expenses.length === 0) {
      console.log("No expenses found");
      return;
    }
    localStorage.setItem("expenses", JSON.stringify([]));
    setExpenses([]);
    setExpense(0);
  }

  return (
    <div className=" bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Expense Tracker
        </h1>
        <form onSubmit={addExpense} className="flex flex-col gap-3 mb-6">
          <label className="text-black">Enter the Amount: </label>
          <input
            type="number"
            placeholder="enter the amount..."
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            required
          />
          <input
            type="text"
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            Add Expense
          </button>
        </form>

        <div className="bg-blue-50 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-3xl font-bold text-blue-600">₹{totalexpense}</p>
        </div>

        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
          Expenses
        </h3>
        <button
          className="text-black rounded-lg px-2 py-1 bg-gray-400 hover:bg-gray-600 transition-colors"
          onClick={() => clearAll()}
        >
          Clear All
        </button>
        {expenses.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-4">
            No expenses yet.
          </p>
        )}
        <ul className="flex flex-col gap-2">
          {expenses.map((expense_ind, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3"
            >
              <span className="text-gray-700">{expense_ind.dsc}</span>
              <span className="font-semibold text-gray-800">
                ₹{expense_ind.amt}
              </span>
              <button
                onClick={() => deleteExpense(expense_ind.id)}
                className="text-black rounded-lg px-2 py-1 bg-gray-400 hover:bg-gray-600 transition-colors"
              >
                Delete Expense
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
