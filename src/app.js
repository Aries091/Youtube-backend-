import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser' 

const app =express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true

}))
//  we are using this for the data as data can come in any json or url format and static we have used for our local data like we pass data locally 

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

// cookie parser : we  use cookie parse to : so we can access cookies and set cookies in the users browser through the server
app.use(cookieParser())


// routes
import userRouter from './routes/user.routes.js'

// routes declaration 

app.use("/api/v1/users",userRouter)

// http://localhost:8000/api/v1/users
export {app}