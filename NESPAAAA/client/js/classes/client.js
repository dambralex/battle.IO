class Client{

	constructor(){
		// this.game = game;
		// this.data = data
		this.socket = null;

		this.ping = 0;

		this.currentId = 0;
		this.requestIdDone = false;
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
			// console.log(data+" ms");
			self.ping = data;
			// self.upload = data.upload;
		});

		this.socket.on('gameInformation', function(entities){
				// console.log(entities.unit);

			for(var i in entities.town);
				if(entities.town[i]){
					// console.log(entities.town[i]);
					// console.log(that.entities.town[i]);
					if(!that.entities.town[entities.town[i].id]){
						new Town(entities.town[i]);
					}
					else{
						that.entities.town[entities.town[i].id].setInformation(entities.town[i]);
					}
				}
			for(var i in entities.unit){
				// console.log(entities.unit[i]);
				if(entities.unit[i]){
					// console.log(entities.unit[i]);
					// console.log(that.entities.unit[i]);
					if(!that.entities.unit[entities.unit[i].id]){
						new Square(entities.unit[i]);
					}
					else{
						that.entities.unit[entities.unit[i].id].setInformation(entities.unit[i]);
					}
				}
			}

		});

		this.socket.on('start', function(data){
			console.log("starting in "+ data.starting[0]+", "+data.starting[1]);
			that.setPlayer(data.name, Types.Races.HUMAN, true, data.starting[0], data.starting[1]);

			that.startGame();
		});

		this.socket.on('opponentStart', function(data){
			that.setPlayer(data.name, Types.Races.ORC, false, data.starting[0], data.starting[1]);
		});

		this.socket.on('newId', function(data){
			console.log("newid");
			that.waitingId[0].setId(data);
			that.waitingId.shift();
		});
	}

	update(){
		if(this.socket){
			this.socket.emit('gameInformation',that.entities);
		}
	}

	tick(){
		if(this.socket){
			this.socket.emit('stats', Date.now());
		}
	}

	requestNewId(){
		this.socket.emit('newId');
	}
}