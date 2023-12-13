import mongoose from "mongoose";

export function dbConnection() {
    const params = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        mongoose.connect("mongodb+srv://Sanjay:Sr3125104@cluster0.qc7mipk.mongodb.net/funnel", params);
        console.log("Database connected Successfully");
    } catch (error) {
        console.log("Error connecting DB", error);
    }
}
