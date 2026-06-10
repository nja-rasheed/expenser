"use client";
import React, { useState, useEffect } from "react";
import { createExpense, getExpenses, deleteExpense, clearAll } from "./actions/action";
import CategoryItems from "./components/Category";

type Expense = {
  id: string;
  amt: number;
  category: number;
  dsc: string;
  date: string;
};

const category_list = ["Food", "Transportation", "Education", "Leisure", "Personal care", "Work", "Utilities"];

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [expDate, setExpDate] = useState("");
  const [cIndex, setCIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [totalexpense, setExpense] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category_refresh, setCategoryRefresh] = useState(0);

  function calculateTotal(updatedExpenses: Expense[]) {
    const total = updatedExpenses.reduce((sum, exp) => sum + exp.amt, 0);
    setExpense(total);
  }

  function triggerCategoryRefresh() {
    setCategoryRefresh(prev => prev + 1);
  }

  async function handleSetExpenses() {
    const rawexps = await getExpenses();
    console.log(rawexps)
    const exps: Expense[] = rawexps.map((item) => ({
      id: item._id.toString(),
      amt: item.amount,
      category: item.category,
      dsc: item.name,
      date: item.date
    }))
    setExpenses(exps)
    calculateTotal(exps)
  }

  useEffect(() => {
    handleSetExpenses();
  }, []);

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    const result = await createExpense(amount, description, expDate, cIndex);
    if (result.success) {
      console.log("Expense Added Successfully!");
      handleSetExpenses();
      triggerCategoryRefresh();
      setAmount(0);
      setDescription("");
      setCIndex(0);
      setExpDate("");
    } else {
      console.log("Failed to add Expense!");
    }
  }

  async function handleDelete(del_id: string) {
    const result = await deleteExpense(del_id);
    if (result.success) {
      console.log("Expense Deleted Successfully!");
      handleSetExpenses();
      triggerCategoryRefresh();
    } else {
      console.log("Failed to delete expense!")
    }
  }

  async function handleClearAll() {
    const result = await clearAll();
    if (result.success) {
      console.log("Cleared every expenses!")
      handleSetExpenses();
      triggerCategoryRefresh();
      calculateTotal(expenses)
    }
  }

  return (
    // CHANGED: added py-10
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-10">
      {/* CHANGED: max-w-md → max-w-lg */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Expense Tracker
        </h1>

        <form onSubmit={handleSubmitForm} className="flex flex-col gap-3 mb-6">
          {/* CHANGED: label style unified */}
          <label className="text-sm font-medium text-gray-600">Enter the Amount</label>
          <input
            type="number"
            placeholder="Enter the amount..."
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            required
          />

          {/* CHANGED: label style unified */}
          <label className="text-sm font-medium text-gray-600">Select a Category</label>
          {/* CHANGED: replaced bg-amber-200 with proper input styling */}
          <select
            name="category"
            id="category"
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setCIndex(Number(e.target.value))}
          >
            {category_list.map((c, index) => (
              <option value={index} key={index}>{c}</option>
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

          {/* CHANGED: date input was completely unstyled, now matches other inputs */}
          <input
            type="date"
            value={expDate}
            onChange={(e) => setExpDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
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

        <CategoryItems refresh={category_refresh} />

        {/* CHANGED: added tracking-wider */}
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Expenses
        </h3>

        {/* CHANGED: gray → red to signal destructive action */}
        <button
          className="text-red-600 rounded-lg px-3 py-1 bg-red-100 hover:bg-red-200 transition-colors text-sm font-medium mb-3"
          onClick={() => handleClearAll()}
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
            // CHANGED: added flex-wrap gap-y-1
            <li
              key={index}
              className="flex flex-wrap justify-between items-center gap-y-1 bg-gray-50 rounded-lg px-4 py-3"
            >
              <span className="text-gray-700">{expense_ind.dsc}</span>
              <span className="text-gray-500 text-sm">{expense_ind.date}</span>
              {/* CHANGED: plain text → badge */}
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {category_list[expense_ind.category]}
              </span>
              <span className="font-semibold text-gray-800">₹{expense_ind.amt}</span>
              {/* CHANGED: gray → red to match Clear All */}
              <button
                onClick={() => handleDelete(expense_ind.id)}
                className="text-red-600 rounded-lg px-3 py-1 bg-red-100 hover:bg-red-200 transition-colors text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}