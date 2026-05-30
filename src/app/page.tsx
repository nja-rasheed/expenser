"use client";
import { useState, useEffect } from "react";

type Expense = {
  id: number;
  amt: number;
  catogory: number;
  dsc: string;
};

type Catogory = {
  name: string;
  amt: number;
};

const catogory: Catogory[] = [
  { name: "Food", amt: 0 },
  { name: "Transportation", amt: 0 },
  { name: "Education", amt: 0 },
  { name: "Leisure", amt: 0 },
  { name: "Personal care", amt: 0 },
  { name: "Work", amt: 0 },
  { name: "Utilities", amt: 0 },
];
export default function Home() {
  const [amount, setAmount] = useState(0);
  const [cIndex, setCIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [totalexpense, setExpense] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [catogory_amt, setCatogoryAmt] = useState<Catogory[]>(catogory);

  useEffect(() => {
    const stored_expenses = localStorage.getItem("expenses");
    const stored_catogory_amt = localStorage.getItem("catogory_amt");
    if (stored_expenses) {
      const parsed = JSON.parse(stored_expenses);
      setExpenses(parsed);
      calculateTotal(parsed);
    }
    if (stored_catogory_amt) {
      const parsed = JSON.parse(stored_catogory_amt);
      setCatogoryAmt(parsed);
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
      catogory: cIndex,
      dsc: description,
    };
    const updatedCats = catogory_amt.map((c, i) =>
      i === cIndex ? { ...c, amt: c.amt + amount } : c
    );
    setCatogoryAmt(updatedCats);
    localStorage.setItem("catogory_amt", JSON.stringify(updatedCats));
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    calculateTotal(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
    setAmount(0);
    setDescription("");
  }

  function deleteExpense(del_id: number) {
    const updated = expenses.filter((exp) => exp.id !== del_id);
    const target = expenses.find((exp) => exp.id === del_id)!;
    const updatedCats = catogory_amt.map((c, i) =>
      i === target.catogory ? { ...c, amt: c.amt - target.amt } : c
    );
    setCatogoryAmt(updatedCats);
    localStorage.setItem("catogory_amt", JSON.stringify(updatedCats));
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
    localStorage.setItem("catogory_amt", JSON.stringify(catogory));
    setExpenses([]);
    setCatogoryAmt(catogory);
    setExpense(0);
  }

  function resetCatogortValues(index: number) {
    const updatedCats = catogory_amt.map((c, i) =>
      i === index ? { ...c, amt: 0 } : c
    );
    setCatogoryAmt(updatedCats);
    localStorage.setItem("catogory_amt", JSON.stringify(updatedCats));
    const updated = expenses.filter((exp) => exp.catogory !== index);
    calculateTotal(updated);
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
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
          <label className="text-black">Select a Catogory</label>
          <select
            name="category"
            id="category"
            className="text-black bg-amber-200 rounded-lg"
            onChange={(e) => setCIndex(Number(e.target.value))}
          >
            {catogory_amt.map((c, index) => (
              <option value={index} key={index}>
                {c.name}
              </option>
            ))}
          </select>
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

        <ul>
          {catogory_amt.map((c, index) => (
            <li
              key={index}
              className="text-black flex flex-row justify-between"
            >
              <span>Category: {c.name}</span>
              <span> Amount: {c.amt}</span>
              <button
                onClick={() => {
                  resetCatogortValues(index);
                }}
              >
                Reset
              </button>
            </li>
          ))}
        </ul>

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
              <span className="text-gray-700">
                {catogory_amt[expense_ind.catogory].name}
              </span>
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
