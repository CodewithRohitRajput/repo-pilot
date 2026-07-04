import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './src/config/db.js'

import authRoutes from './src/routes/authRoute.js'
import repoRoutes from './src/routes/githubRoute.js'
import webhookRoutes from './src/routes/webhookRoute.js'

dotenv.config()

const app = express()

connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "*",
    credentials: true
}))

app.use('/auth', authRoutes)
app.use('/repo', repoRoutes)
app.use('/webhook', webhookRoutes)

app.get('/', (req,res)=>{
    res.send("RepoPilot backend is running")
})

app.listen(process.env.PORT, ()=>{
    console.log("RepoPilot server started")
})


