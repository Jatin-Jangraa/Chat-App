import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectdb } from './config/dbconfig.js'
import { userroute } from './routes/User.js'
import msgrouter from './routes/Message.route.js'
import {Server} from 'socket.io'
import http from 'http'
import { fileURLToPath } from 'url'
import path from 'path'


dotenv.config()
connectdb()

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 4000 ; 

const __filename = fileURLToPath(import.meta.url);
const  __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../client/dist')));






// 
export const io = new Server(server,{
    cors : {origin : "*"
    }
})


// 
export const userSocketMap : Record<string , any>   = {};


// 
io.on("connection",(socket:any)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected : " ,userId)

    if(userId){
        userSocketMap[userId.toString()] = socket.id
    }

    io.emit("getOnlineUsers" , Object.keys(userSocketMap))

    socket.on("disconnect", () =>{
        console.log("User Disconnected : " , userId);
        delete userSocketMap[userId]
        io.emit("getOnlineUser", Object.keys(userSocketMap))
    })

})



app.use(cors({
  origin:  "http://localhost:5173",
  credentials:true
}));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", userroute)
app.use("/api/message",msgrouter)

app.use(/.*/ , (req,res)=>{
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
})

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

server.listen(port , ()=>{
    console.log(`Server is Running on Port : ${port}`) 
})