const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet') 
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')

const app = express()

// Use helmet for comprehensive security headers
app.use(helmet({
    hidePoweredBy: true,
    contentTypeOptions: { nosniff: true },
    frameguard: { action: 'deny' },
    xssFilter: true
}))

app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api",router)

const PORT = 8080 || process.env.PORT


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})
