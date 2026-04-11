import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    amount: Number,
    category:{
        type: String,
        default: "uncategorized"
    },
    note: String,
    date: {
        type: Date,
        default: Date.now,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {timestamps: true});
export const Transaction = mongoose.model("Transaction", transactionSchema);