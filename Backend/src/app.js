const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean)
        if (!origin || 
            origin.startsWith("http://localhost:") || 
            origin.endsWith(".vercel.app") || 
            allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Backend is running"
    })
})

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app