const express = require('express');
require('dotenv').config();
const createError = require('http-errors');
const path = require('path');
const router = require('./routers/main.js');
const cookieParser = require('cookie-parser');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const  {verify} = require('jsonwebtoken');
const app = express();
const server = createServer(app);


// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// Set template
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// Routers
router(app);



// Set error handler
app.use((req,res,next)=>{
      next(createError.NotFound('This router does not a exist.'));
})

app.use((err,req,res,next)=>{
       res.json({
           status: err.status || 500,
           message: err.message
       })
})

const io = new Server(server,{
  path: "/api/socket.io",  // Đặt path của Socket.IO là /api/socket.io
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

io.on('connection',(socket)=>{
  let accessToken = socket.handshake.headers.cookie.split('accesstoken=')[1];
  let payload = verify(accessToken, process.env.ACCESS_TOKEN);
  const userId = payload.id;
  socket.join(`${userId}`);
  console.log(`user connect room ${userId}`);    
  socket.on('send',(data)=>{
        console.log(data);
        io.to(`${data.fromId}`).emit('request',data);
  })

  socket.on('add-friend',(data)=>{
        console.log(data);
        io.to(`${data.toId}`).emit('accept',(data));
  })

  socket.on('reject-friend',(data)=>{
    console.log(data);
    io.to(`${data.toId}`).emit('reject',(data));
  })

  socket.on('disconnect',()=>{
      console.log('user disconnect');
  }) 

});

const port = process.env.PORT || 3000;
server.listen(port, () => {
     console.log(`Server is running on port: ${port}`);
})

