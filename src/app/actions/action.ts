'use server'
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

const category_list = ["Food", "Transportation", "Education", "Leisure", "Personal care", "Work", "Utilities"];

export async function createExpense(amt: number, des: string, date_inp: string, category_num: number) {
    const client = await clientPromise
    const db = client.db("sample_data")
    const result = await db.collection("expenses").insertOne({
        name: des,
        category_index: category_num,
        category: category_list[category_num],
        date: date_inp,
        amount: amt
    })
    const category_amt = await db.collection("category_amt").find({ index: category_num }).toArray();
    let new_cat_amt = category_amt[0].amt + amt;
    let new_cat = { index: category_amt[0].index, name: category_amt[0].name, amt: new_cat_amt }
    const update_category_amt = await db.collection("category_amt").updateOne({ index: category_num }, { $set: new_cat }, { upsert: false });
    return { success: true }
}

export async function getExpenses() {
    const client = await clientPromise
    const db = client.db("sample_data")
    const result = await db.collection("expenses").find({}).toArray();
    return result.map((item) => ({
        _id: item._id.toString(),
        name: item.name as string,
        category: item.category_index,
        date: item.date as string,
        amount: item.amount as number,
    }))
}

export async function deleteExpense(id: string) {
    const client = await clientPromise
    const db = client.db("sample_data")
    const target = await db.collection("expenses").find({ _id: new ObjectId(id) }).toArray();
    const result = await db.collection("expenses").deleteOne({ _id: new ObjectId(id) })
    console.log(target)
    const category_amt = await db.collection("category_amt").find({ index: target[0].category_index }).toArray();
    let new_cat_amt = category_amt[0].amt - target[0].amount;
    let new_cat = { index: category_amt[0].index, name: category_amt[0].name, amt: new_cat_amt }
    const update_category_amt = await db.collection("category_amt").updateOne({ index: target[0].category_index }, { $set: new_cat }, { upsert: false });
    console.log(result);
    return { success: true }
}

export async function getCategory() {
    const client = await clientPromise
    const db = client.db("sample_data")
    const result = await db.collection("category_amt").find({}).toArray();
    return result.map((item) => ({
        _id: item._id.toString(),
        name: item.name,
        amt: item.amt
    }))
}

export async function clearAll() {
    const client = await clientPromise
    const db = client.db("sample_data")
    const result = await db.collection("expenses").deleteMany({})
    const categories = await db.collection("category_amt").find({}).toArray();
    const cats = categories.map((item) => ({
        index: item.index,
        name: item.name,
        amt: 0
    }))
    await db.collection("category_amt").updateMany({}, { $set: { amt: 0 } })

    return { success: true }
}