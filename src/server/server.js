import express from 'express';
import path from 'path';
import socketio from "socket.io";
var http = require('http');

const app = express();
const server = http.createServer(app);

const port = '3000';
app.set('port', port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(express.static(path.join('./', 'dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, '../../dist')));



app.get('/api', (req, res) => {
  res.send({
    api: 'test'
  });
})

var test1Router = require('./routes/test1');
app.use('/preview', test1Router);


var indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.get('/react', function(req, res) {
  //console.log("!!",path.resolve(__dirname, '../../dist/home.html'))
  res.sendFile(path.resolve(__dirname, '../../dist/main.html'))
})


/*app.listen(3000, () => {
  console.log('server running');
})*/

server.listen(port, () => {
  console.log('server running');
});




var common = {
  totalId: 0,
  clientAuth: {
    dj: {},
    worker: {},
    feedback: {}
  },
  clientStatus: [],
  log: null,
  timer: null,
  analysis: null,
  loop: null,
  loopTime: 2 * 60 * 1000
};

for (var i = 0; i < 5; i++) {
  common.clientStatus.push({
    id: i,
    status_flag: 0,
    name: "",
    metric: [0, 0, 0],
    speak: 0,
    speakTime: [],
    totalSpeakTime: 0,
    mindwaveTime: [0],
    attention: [0],
    meditation: [0]
  });
}

const io = socketio(server);
io.on("connection", (socket: socketio.Socket) => {

  socket.on('test', function(data) {
    var e = new Date();
    //console.log(e.getHours() +":"+ e.getMinutes() +":"+ e.getSeconds(), data);
  });

  socket.on("data", (data) => {
    var e = new Date();
    io.emit("data", data);
    console.log(e.getHours() +":"+ e.getMinutes() +":"+ e.getSeconds(), data);
  });
});
app.set('io', io);
