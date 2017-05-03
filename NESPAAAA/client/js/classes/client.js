class Client{

	constructor(){
		this.socket = null;

		this.ping = 0;

		this.currentId = 0;
		this.requestIdDone = false;

		this.townInformation = [];
		this.unitInformation = [];
	}

	setSocket(socket){
		this.socket = socket;
		this.setOnSockets();
	}

	setOnSockets(){
		var self = this;

		this.socket.on('pong', function(data){
			self.ping = data;
		});

		this.socket.on('gameInformation', function(entities){

			for(var i in entities.town){
				if(entities.town[i]){

					if(!that.entities.town[entities.town[i].id]){
						new Town(entities.town[i]);
					}
					else{
						that.entities.town[entities.town[i].id].setInformation(entities.town[i]);
					}
				}
			}
			for(var i in entities.unit){
				if(entities.unit[i]){

					if(!that.entities.unit[entities.unit[i].id]){
						new Unit(entities.unit[i]);
					}
					else{
						that.entities.unit[entities.unit[i].id].setInformation(entities.unit[i]);
					}
				}
			}
			for(var i in entities.actionStack){
				if(entities.actionStack[i]){
					var action = Function(entities.actionStack[i].argument, entities.actionStack[i].methode);
	
					if(that.entities.town[entities.actionStack[i].id]){
						action(that.entities.town[entities.actionStack[i].id]);
					}
					if(that.entities.unit[entities.actionStack[i].id]){
						action(that.entities.unit[entities.actionStack[i].id]);

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

		this.socket.on('win', function(){
			that.paused = true;
			that.win = true;
		});

		this.socket.on('newId', function(data){
			that.waitingId[0].setId(data);
			that.waitingId.shift();
		});

		this.socket.on('spectator', function(){
			that.spectate = true;
			that.hasStarted = true;
		}) 
	}

	update(){
		if(that.spectate)
			return;

		this.townInformation = [];
		this.unitInformation = [];

		var tmp;

		if(this.socket){ 
			for(var t in that.entities.town){
				if(that.entities.town[t].isAllied()){
					tmp = {id : that.entities.town[t].id,
					hitPoints : that.entities.town[t].hitPoints,
					maxHitPoints : that.entities.town[t].maxHitPoints,
					player : that.entities.town[t].player,
					posX : that.entities.town[t].posX,
					posY : that.entities.town[t].posY,
					width : that.entities.town[t].width,
					height : that.entities.town[t].height,
					name : that.entities.town[t].name,
					stage : that.entities.town[t].stage,
					dead : that.entities.town[t].dead,
					};
					this.townInformation.push(tmp);
				}
			}
			for(var u in that.entities.unit){
				if(that.entities.unit[u].isAllied()){
					tmp = {id : that.entities.unit[u].id,
					hitPoints : that.entities.unit[u].hitPoints,
					maxHitPoints : that.entities.unit[u].maxHitPoints,
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
			this.socket.emit('gameInformation', {town : this.townInformation, unit : this.unitInformation, actionStack : that.actionStack});
		}

		that.actionStack = [];
	}

	tick(){
		if(this.socket){
			this.socket.emit('stats', Date.now());
		}
	}

	requestNewId(){
		this.socket.emit('newId');
	}

	gameFinished(){
		this.socket.emit('lost');
	}
}