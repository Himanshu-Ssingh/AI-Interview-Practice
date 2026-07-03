const mongoose = require("mongoose")

async function connectToDB() {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        return
    }
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-interview"

    try {
        await mongoose.connect(mongoUri)
        console.log("Connected to Database")
    }
    catch (err) {
        console.error("Database connection failed:", err.message)
    }
}

module.exports = connectToDB