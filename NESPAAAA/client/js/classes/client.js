class Client{

	constructor(data){
		// this.game = game;
		// this.data = data
		this.socket = null;

		this.ping = 0;
	}

	setSocket(socket){
		this.socket = socket;
		//this.socket.emit('gameInformation',this.game);
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

		this.socket.on('gameInformation', function(entities){
			for(var i in entities.town);
				// console.log(entities.town[i]);
			for(var i in entities.unit);
				// console.log(entities.unit[i]);
		});

		this.socket.on('start', function(data){
			console.log("starting in "+ data.starting[0]+", "+data.starting[1]);
			that.setPlayer(data.name, Types.Races.HUMAN, true, data.starting[0], data.starting[1]);

			that.startGame();
		});

		this.socket.on('opponentStart', function(data){
			that.setPlayer(data.name, Types.Races.ORC, false, data.starting[0], data.starting[1]);
		});
	}

	update(){
		if(this.socket){
			this.socket.emit('gameInformation',that.entities);
		}
	}

	tick(){
		this.socket.emit('stats', Date.now());
	}
}