'use client'
import { useState, useEffect } from "react";
import { getCategory } from "../actions/action";

type Category = {
    id: string;
    name: string;
    amt: number;
};

// CHANGED: color array for the dot indicators
const category_colors = [
    "bg-orange-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-green-400",
    "bg-indigo-400",
    "bg-cyan-400",
];

export default function CategoryItems({ refresh }: { refresh: number }) {
    const [catogory_amt, setCatogoryAmt] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    async function handleSetCategory() {
        setLoading(true)
        const rawCat = await getCategory();
        const cats: Category[] = rawCat.map((item) => ({
            id: item._id,
            name: item.name,
            amt: item.amt
        }))
        setCatogoryAmt(cats)
        setLoading(false)
    }

    useEffect(() => {
        handleSetCategory();
    }, [refresh]);
    if (loading) {
        return (
            <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }
    else {
        return (
            <div>
                {/* CHANGED: added tracking-wider */}
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Categories
                </h3>
                <ul className="flex flex-col gap-2 mb-6">
                    {catogory_amt.map((c, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3"
                        >
                            {/* CHANGED: wrapped name in a div with a colored dot */}
                            <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${category_colors[index % category_colors.length]}`} />
                                <span className="text-gray-700">{c.name}</span>
                            </div>
                            {/* CHANGED: text-gray-800 → text-blue-600 to match Total Spent */}
                            <span className="font-semibold text-blue-600">₹{c.amt}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
