class Client{

	constructor(){
		// this.game = game;
		// this.data = data
		this.socket = null;

		this.ping = 0;

		this.currentId = 0;
		this.requestIdDone = false;

		this.townInformation = [];
		this.unitInformation = [];
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
			for(var i in entities.town);
				if(entities.town[i]){
					// console.log(entities.town[i]);
					// console.log(that.entities.town[i]);
					// console.log(entities.town[i].id);

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
		this.townInformation = [];
		this.unitInformation = [];

		var tmp;

		if(this.socket){ 
			for(var t in that.entities.town){
				if(that.entities.town[t].player == that.player){
					tmp = {id : that.entities.town[t].id,
					hitPoints : that.entities.town[t].hitPoints,
					maxHitPoints : that.entities.town[t].maxHitPoints,
					posX : that.entities.town[t].posX,
					posY : that.entities.town[t].posY,
					stage : that.entities.town[t].stage,
					dead : that.entities.town[t].dead,
					};
					this.townInformation.push(tmp);
				}
			}
			for(var u in that.entities.unit){
				if(that.entities.unit[u].player == that.player){
					tmp = {id : that.entities.unit[u].id,
					hitPoints : that.entities.unit[u].hitPoints,
					player : that.entities.unit[u].player,
					state : that.entities.unit[u].state,
					posX : that.entities.unit[u].posX,
					posY : that.entities.unit[u].posY,
					width : that.entities.unit[u].width,
					height : that.entities.unit[u].height,
					type : that.entities.unit[u].type,
					orientation : that.entities.unit[u].orientation,
					step : that.entities.unit[u].step,
					anim : that.entities.unit[u].anim,
					attackRange : that.entities.unit[u].attackRange,
					visualRange : that.entities.unit[u].visualRange,
					dead : that.entities.unit[u].dead,
					};
					this.unitInformation.push(tmp);
				}
			}

			this.socket.emit('gameInformation', {town : this.townInformation, unit : this.unitInformation});
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