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

  var user_lobby = null;

  socket.on('disconnect', function(){
    console.log('user disconnected');

    if(user_lobby && lobbies[user_lobby]){
      if(--lobbies[user_lobby].pop == 0){
        lobbies[user_lobby] = undefined;
        console.log(user_lobby + ' deleted.');
      }
    }
  });

  socket.on('tune', function(data){
    var room = data.room;
    io.to(room).emit('playback', data);
  })

  socket.on('join', function(lobby){
    user_lobby = lobby;
    if(lobbies[user_lobby]){
      socket.join(user_lobby);
      lobbies[user_lobby].pop++;
    }else{
      console.log('Trying to join a room that does not exist: ' + user_lobby);
    }
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
    pop: 0
  };

  res.send(lobbyId);
});

  // get info about lobby #id
app.get('/api/lobby/:lobby_id', function(req, res) {
  var id = req.params.lobby_id;
  console.log('Getting data about lobby #' + id);
  if(lobbies[id]){
    res.send(lobbies[id]);
  }else{
    res.status(404);
    res.send({ error: 'Lobby does not exist.' });
  }
});

// ------ Front End
app.get('/', function(req, res) {
  res.sendFile('./public/index.html');
});

// start server
http.listen(PORT, function(){
  console.log('mean-music started listening on port ' + PORT);
});


