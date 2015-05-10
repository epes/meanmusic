// initialization
var express   = require('express');
var app       = express();
var morgan    = require('morgan');
var bodyParser  = require('body-parser');
var methodOverride = require('method-override');
var utils     = require('./utils.js');
var http      = require('http').Server(app);
var io        = require('socket.io')(http);

var PORT = (process.env.PORT || 8080);
var LOBBY_ID_LENGTH = 3;

// configuration
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({'type':'application/vnd.api+json'}));
app.use(methodOverride());

// models
var lobbies = [];

// socket.io
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(data){
    var room = data.slice(0, LOBBY_ID_LENGTH);
    var msg = data.slice(LOBBY_ID_LENGTH + 1);
    console.log('room: ' + room + ' | msg: ' + msg + ' | ' + data);
    io.to(room).emit('chat message', msg);
  });

  socket.on('join', function(lobby){
    socket.join(lobby);
  });


});

// routes
// ------ API

  // create lobby
app.post('/api/lobby', function(req, res) {
  var lobbyId = utils.randomAlphaNumeric(LOBBY_ID_LENGTH);
  console.log("Creating new lobby: " + lobbyId);

  lobbies[lobbyId] = {
    active: true,
    drum: false,
    guitar: false
  };

  res.send(lobbyId);
});

  // get info about lobby #id
app.get('/api/lobby/:lobby_id', function(req, res) {
  var id = req.params.lobby_id;
  console.log('Getting data about lobby #' + id);
  res.send(lobbies[req.params.lobby_id]);
});

  // update lobby #id
app.put('/api/lobby/:lobby_id', function(req, res) {
  var id = req.params.lobby_id;
  res.send('Posting new data to lobby #' + id);
});

// ------ Front End
app.get('/', function(req, res) {
  res.sendFile('./public/index.html');
});

// start server
http.listen(PORT, function(){
  console.log('mean-music started listening on port ' + PORT);
});


