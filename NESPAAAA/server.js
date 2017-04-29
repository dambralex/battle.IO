var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

//server/js/maps/premiere.js

var server = http.createServer(function(req, res)
{
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

var units = [];
var players = [];
var connected = 0;

var callback;

io.sockets.on('connection', function (socket,pseudo) {

    // Gere les connexions des joueurs, et enregistre le pseudo dans la socket associée
    socket.on('pseudo', function(pseudo)
    {
        connected++;
        var player = { nickname : pseudo};
        players.push(player);
        socket.pseudo = pseudo;

        socket.emit('bonjour', "bonjour " + pseudo );
        console.log("connexion de : " + pseudo);

        if(connected > 2){
            initGame();
            startGame();
        }
    });

    socket.on('gameInformation', function(entities){
        socket.entities = entities;
        socket.broadcast.emit("gameInformation",entities);
        // upload += sizeof(hihi);
    });

    socket.on('move', function(pos){
        console.log(socket.pseudo + " bouge en " + pos.x + " "  + pos.y);
    });

    socket.on('stats', function(ping){
        socket.emit('pong',Date.now() - ping );
        upload = 0;
    });


    socket.on("newSquad", function(id){
       units.push(id);
       console.log(units);
       console.log(socket.pseudo + " cree nouvelle unité " + id);
    });

    // Gere la déconnexion d'un joueur. Informe les autres joueurs de son départ
    socket.on("disconnect", function(){
        io.emit('disconnect', socket.pseudo + " s'est déconnecté");
        console.log("deconnexion de " + socket.pseudo);
        connected--;
    });

});

function initGame(){
    map = chooseMap();

}

function chooseMap(){
    return maps[0];
}


server.listen(8080);
