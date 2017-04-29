class Client{

	constructor(data){
		// this.game = game;
		// this.data = data
		this.socket = null;

		this.ping = 0;
	}

	setSocket(socket){
		this.socket = socket;
		this.socket.emit('gameInformation',that.startGame);
		this.setOnSockets();
	}

	setOnSockets(){
		var self = this;
		console.log(self);

		this.socket.on('pong', function(data){
			console.log(data+" ms");
			self.ping = data.ping;
			self.upload = data.upload;
		});
	}

	update(){
		if(this.socket){
			console.log("niquez vos mère");
			this.socket.emit('test',that.entities);
		}
	}

	tick(){
		this.socket.emit('stats', Date.now());
	}
}