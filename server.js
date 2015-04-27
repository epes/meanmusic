// initialization
var express   = require('express');
var app       = express();
var morgan    = require('morgan');
var bodyParser  = require('body-parser');
var methodOverride = require('method-override');
var utils     = require('./utils.js');

// configuration
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({'type':'application/vnd.api+json'}));
app.use(methodOverride());

// models
var lobbies = [];

// routes
// ------ API

  // create lobby
app.post('/api/lobby', function(req, res) {
  var lobbyId = utils.randomAlphaNumeric(3);
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
app.listen(8080);
console.log('mean-music started listening on port 8080');
