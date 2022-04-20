const http = require('http')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { urlencoded } = require('express')
const routes = require('./Routes/index')
const dotenv = require('dotenv')
const { Server } = require("socket.io");
const ipModel = require('./models/ipModel')
const userModel = require('./models/userModel')

dotenv.config()


const app = express()
app.use(urlencoded())
app.use(express.json())
app.use(cors({ origin: 'https://dp.turntbloke.tech', credentials: true }));
app.use(routes)

mongoose.connect(process.env.url,(err,res)=>{
    if(err)
    {console.log(err)
    return}
    console.log("connected to Db");
})







const server = http.createServer(app);

const io = new Server(server,{
    cors:{
      origin:'https://dp.turntbloke.tech'
    }
  });


io.on('connection',(socket)=>{
    
    socket.on('updatelikes',async(id)=>{
        console.log('entered')
        let res = await userModel.findOne({id:id})
        io.emit('getlikes',res.id,res.likes)
    })
})



server.listen(process.env.PORT || '5001' , ()=>{
    console.log("Server started");
  })


