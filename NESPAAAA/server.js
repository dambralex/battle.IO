var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

//server/js/maps/premiere.js



var server = http.createServer(function(req, res)
{
    // idCount = 0;
    // units = [];
    // players = [];
    // connected = 0;

    var uri = url.parse(req.url).pathname;
    var index = uri.lastIndexOf('/');
    var str = uri.substr(index);

    if(uri === "/")
      uri = "index.html";

    var filename = path.join("/client",uri);
    if(str === "/tartiflette.js")
      filename = path.join("/server", uri);

    // console.log(filename);
    //console.log(mime.lookup(filename));

    if(mime.lookup(filename) === "image/png")
    {
        fs.readFile(__dirname + filename, 'binary', function(error, content) {
            if(error) {
                res.writeHead(500);
                return res.end("Error loading page");
            }
            res.setHeader('content-type', mime.lookup(filename));
            res.write(content, "binary");
            res.end();
        });
    }
    else
    {
        fs.readFile(__dirname + filename, 'utf-8', function(error, content) {
            if(error) {
                res.writeHead(500);
                return res.end("Error loading page");
            }
            res.setHeader('content-type', mime.lookup(filename));
            res.writeHead(200);
            res.end(content);
        });
    }
});

var io = require('socket.io').listen(server);

var maps =
    [{
        playerPosition : [100, 200],
        opponentPosition : [100, 1000],
        mapID : "map1"
    }
];

var idCount = 0;
var units = [];
var players = [];
var connected = 0;
var choosenMap;

io.sockets.on('connection', function (socket,pseudo) {

    // Gere les connexions des joueurs, et enregistre le pseudo dans la socket associée
    socket.on('pseudo', function(pseudo)
    {
        var is_player = 1;
        if(connected < 2) connected++;
        else{
          socket.emit('bonjour', "nb joueurs atteint, vous etes spectateurs");
          is_player = 0;
        }

        var player = { nickname : pseudo};
        player.socket = socket;
        players.push(player);
        socket.pseudo = pseudo;

        socket.emit('bonjour', "bonjour " + pseudo );
        console.log("connexion de : " + pseudo + "   " + connected);

        if(connected > 1){
            io.emit('bonjour',"NB joueurs OK");
            initGame();
            startGame();
        }
        else {
          socket.emit('bonjour',"Attente d'un autre joueur...");
        }
    });

    socket.on('gameInformation', function(entities){
        socket.entities = entities;
        socket.broadcast.emit("gameInformation",entities);

        // console.log(maps[0].playerPosition);
        // upload += sizeof(hihi);
    });

    socket.on('stats', function(ping){
        socket.emit('pong',Date.now() - ping );
        upload = 0;
    });

    socket.on('newId', function(){
        //console.log(idCount);
        socket.emit('newId', idCount++ );
    });

    socket.on('lost', function(){
        //console.log(idCount);
        socket.broadcast.emit('win');
    });


    socket.on('kick', function(pseudo){
      socket.disconnect();
      console.log(idCount);
    });

    // Gere la déconnexion d'un joueur. Informe et déconnecte le joueur restant
    socket.on("disconnect", function(){
        var is_player = 0;
        for(var i in players)
          if(players[i].nickname === socket.pseudo){
            is_player = 1;
            break;
          }
        if(is_player){
          players.splice(0, players.length); // Nettoyage du tableau
          io.emit('disconnect', socket.pseudo + " s'est déconnecté");
          //console.log("deconnexion de " + socket.pseudo);
          console.log("Arret du jeu");
          connected=0;;
        }
        socket.disconnect(); // destruction socket
    });
});

function initGame(){
    choosenMap = chooseMap();
}

function chooseMap(){
    return 0;
}

function startGame(){
    // players[0].socket.emit('opponentStart', {name :players[1].socket.pseudo, starting : maps[choosenMap].opponentPosition});
    // players[1].socket.emit('opponentStart', {name :players[0].socket.pseudo, starting : maps[choosenMap].playerPosition});

    players[0].socket.emit('start', {name :players[0].socket.pseudo, starting : maps[choosenMap].playerPosition});
    players[1].socket.emit('start', {name :players[1].socket.pseudo, starting : maps[choosenMap].opponentPosition});

    console.log("Le jeu commence");
}

server.listen(8080);
