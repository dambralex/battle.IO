class Client{

	constructeur(game){
		this.game = game;
		this.socket = null;

		this.ping = 0;
	}

	setSocket(socket){
		this.socket = socket;
		this.socket.emit('gameInformation',this.game);
		this.setOnSockets();
	}

	setOnSockets(){
		this.socket.on('pong', function(data){
			console.log(data+" ms");
			that.client.ping = data.ping;
			that.client.upload = data.upload;
		});
	}

	update(){
		// this.socket.emit('test',this.game);
	}

	tick(){
		this.socket.emit('stats', Date.now());
	}
}