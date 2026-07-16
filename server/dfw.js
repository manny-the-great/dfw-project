
require('dotenv').config();
require('./models').dbConnection();

const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { Server } = require("socket.io");


const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes')

const app = express();
const PORT = process.env.PORT
const buildPath = path.join(__dirname, "../admin/build") //build path for admin

const http = require('http').Server(app);
// const io = require('socket.io')(http);
const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make io global so controllers can use it
global.io = io;

// When client connects
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(buildPath));   // use for build 
app.use(fileUpload());


app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.get("*", async (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
})

// require('./shocket/socket')(io)

http.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})

module.exports = app;


