var that;

class Game{
	constructor(){
	// Usefull for listeners methodes
	that = this;

	// Setting up the id counter
	this.idCount = 0;

	// Setting up the HUD
	this.hud = new Hud();

	// Setting up the Map
	this.map = new Map(map1);

	// Setting up the Camera
	this.camera = new Camera(0, 0, 1920, 1080, this.map.getWidth()*32, this.map.getHeight()*32);

	// Setting up the input system
	this.mouseObj = new MouseObj;
	// this.keyboardObj = new KeayboardObj();

	// Setting up our entities
	this.entities = {
		town : [],
		unit : []
	};
	this.selectedEntities = {
		town : null,
		unit : []
	}

	// Setting up the player

	// Setting up the client communication
	this.client = new Client();
	this.waitingId = [];
	this.actionStack = [];

	// Pausing 
	this.paused = false;
	this.hasStarted = false;
	this.lost = false;
	this.win = false;
	this.spectate = false;
	}

	init(){
		this.hud.init();
	
		var mapCanvas = document.getElementById('mapCanvas');
		var hudCanvas = document.getElementById('hudCanvas');

		this.camera.wView = window.innerWidth;
    	this.camera.hView = window.innerHeight;

		window.onresize = function(event) {
    		mapCanvas.width = window.innerWidth;
    		mapCanvas.height = window.innerHeight;
    		hudCanvas.width = window.innerWidth;

    		that.camera.wView = window.innerWidth;
    		that.camera.hView = window.innerHeight;
		};

		this.disableContextMenu();
	
		this.addEventListenerToCanvas(window, this.processGameInput);
		this.addEventListenerToCanvas(hudCanvas, this.processHudInput);
	}

	disableContextMenu(){
		window.addEventListener('contextmenu', function(e) {
	    	if (e.button === 2) {
	    		e.preventDefault();
	    		return false;
	    	}
		}, false);
	}
	
	addEventListenerToCanvas(canvas, callback){
		canvas.addEventListener('mousedown', callback, true);
		canvas.addEventListener('mouseup', callback, true);
		canvas.addEventListener('mousemove', callback, true);
	}
	
	update(delta){
		this.camera.update(delta, this.mouseObj.outLeft, 
								  this.mouseObj.outTop, 
								  this.mouseObj.outRight,
								  this.mouseObj.outBottom);
		
		if(!this.paused){
			this.forEachEntity(function(entity){
				entity.update(delta);
			});
		}		
	}
	
	draw(mapContext, hudContext) {
		this.drawOnMapContext(mapContext);
		if(this.player || this.spectate){
			this.drawOnHudContext(hudContext);
		}
	}
	
	drawOnMapContext(mapContext){
		this.map.draw(mapContext, this.camera.posX, this.camera.posY);
	
		this.forEachEntity(function(entity){
			if(entity){
				entity.draw(mapContext, that.camera.posX, that.camera.posY);
			}
		});
		
		this.mouseObj.draw(mapContext, this.camera.posX, this.camera.posY);

		if(!this.hasStarted){
			mapContext.save();
			mapContext.fillStyle = 'white';
	    	mapContext.font = "72pt Arial";
	    	mapContext.fillText("EN ATTENTE D'UN JOUEUR", 20, 100);
	   		mapContext.restore();
		}

		if(this.lost){
			mapContext.save();
			mapContext.fillStyle = 'white';
	    	mapContext.font = "72pt Arial";
	    	mapContext.fillText("PERDU", 20, 100);
	   		mapContext.restore();
		}
		else if(this.win){
			mapContext.save();
			mapContext.fillStyle = 'white';
	    	mapContext.font = "72pt Arial";
	    	mapContext.fillText("GAGNÉ !!", 20, 100);
	   		mapContext.restore();
		}

	}
	
	drawOnHudContext(hudContext){
		this.hud.draw(hudContext);
	
		hudContext.save();
		hudContext.fillStyle = 'white';
	    hudContext.font = "10pt Arial";
	    hudContext.fillText("Ping : " + this.client.ping , 30, 50);
	   	hudContext.restore();
	}
	
	processHudInput(event){
		switch(event.type){
			case "mousedown" : 
				if(event.which == 1){
					if(!that.paused){
						that.hud.handleLeftClick(event.offsetX, event.offsetY);
					}
				}
				break;	
			case "mouseup" : 
				if(event.which == 1){
					if(!that.paused){
						that.hud.handleClickUp();
					}
				}
				break;
			case "mousemove" :
				if(!that.paused){
					that.hud.handleMouseMove(event.offsetX, event.offsetY);		
				}
				break;
		}
	}
	
	processGameInput(event){
		switch(event.type){
			case "mousedown" : 
				that.mouseObj.startX = event.pageX;
				that.mouseObj.startY = event.pageY;
				that.mouseObj.mouseX = event.pageX;
				that.mouseObj.mouseY = event.pageY;
				if(event.which == 1){
					that.mouseObj.setIsDrawing(true, that.camera.posX, that.camera.posY);
				}
				break;	
			case "mouseup" : 
				if(event.which == 1){
					if(that.mouseObj.mouseY < that.camera.hView - 200){
						that.handleLeftClick(that.mouseObj.getSelectionBox(that.camera.posX, that.camera.posY));
					}
				}
				else if(event.which == 3){
					that.handleRightClick(that.mouseObj.mouseX, 
					that.mouseObj.mouseY);
				}
	
				that.mouseObj.setIsDrawing(false);
				that.mouseObj.startX = event.pageX;
				that.mouseObj.startY = event.pageY;
				
				break;
			case "mousemove" :
				that.mouseObj.mouseX = event.pageX;
				that.mouseObj.mouseY = event.pageY;
				that.handleMouseMove(that.mouseObj.mouseX, 
						that.mouseObj.mouseY);
				break;
		}
	}
	
	handleLeftClick(selectionBox){
		var entityBox = {x : 0, y : 0, w : 0, h : 0};
	
		this.selectedEntities.town = null;
		this.selectedEntities.unit = [];
	
		this.forEachTown(function(town){
			entityBox = town.getScreenPosition(that.camera.posX, that.camera.posY);
			entityBox.w = town.width;
			entityBox.h = town.height;
	
			if(collisionBox(selectionBox, entityBox)){
				that.selectedEntities.town = town;	
				town.select();	
			}
			else{
				town.unselect();
			}
		});

		this.forEachUnit(function(unit){
			entityBox = unit.getScreenPosition(that.camera.posX, that.camera.posY);
			entityBox.w = unit.width;
			entityBox.h = unit.height;

			if(collisionBox(selectionBox, entityBox)){
					unit.select();
					that.selectedEntities.unit.push(unit);
			}
			else{
				unit.unselect();
			}
		});
	}
	
	handleRightClick(x, y){
		for(var s in this.selectedEntities.unit){
			if(this.selectedEntities.unit[s].isMovable() && this.selectedEntities.unit[s].isAllied()){
				var clickMouse = this.convertClickPosition(x, y);
				this.selectedEntities.unit[s].disengage();
				this.selectedEntities.unit[s].setDestination(clickMouse.x, clickMouse.y);
				for(var u in this.entities.unit){
					if(this.entities.unit[u] != this.selectedEntities.unit[s]){
						if(!this.entities.unit[u].isAlliedWith(this.selectedEntities.unit[s])){
							if(collisionBox({x : clickMouse.x, y : clickMouse.y, w : 0, h : 0}, this.entities.unit[u].getSize())){
								this.selectedEntities.unit[s].setFollow(this.entities.unit[u]);
							}
						}
					}
				}
				for(var t in this.entities.town){
					if(!this.selectedEntities.unit[s].isAlliedWith(this.entities.town[t])){
						if(collisionBox({x : clickMouse.x, y : clickMouse.y, w : 0, h : 0}, this.entities.town[t].getSize())){
							this.selectedEntities.unit[s].setFollow(this.entities.town[t]);
						}
					}
				}
			}
		}
	}

	convertClickPosition(xClick, yClick){
		return {x : xClick*0.5 + yClick + this.camera.posX + this.camera.posY, y : xClick*-0.5 + yClick + this.camera.posY - this.camera.posX}
	}
	
	handleMouseMove(x, y){
		if(x < 50)
			this.mouseObj.setOutLeft(true);
		else
			this.mouseObj.setOutLeft(false);
	
		if(x > this.camera.wView - 50)
			this.mouseObj.setOutRight(true);
		else
			this.mouseObj.setOutRight(false);
	
		if(y < 50)
			this.mouseObj.setOutTop(true);
		else
			this.mouseObj.setOutTop(false);
	
		if(y > this.camera.hView - 20)
			this.mouseObj.setOutBottom(true);
		else
			this.mouseObj.setOutBottom(false);
	}
	
	handleCollision(){
		this.checkCombatZone();	
	}
	
	checkCombatZone(){
		for(var u1 in this.entities.unit){
			for(var u2 in this.entities.unit){
				if(u1 != u2 && (!this.entities.unit[u2].dead && !this.entities.unit[u1].dead)){
					if(!this.entities.unit[u1].isAlliedWith(this.entities.unit[u2])){
						if(collisionBox(this.entities.unit[u1].getCombatZone(), this.entities.unit[u2].getCombatZone())){
							if(this.entities.unit[u1].isAllied()){
								if(!this.entities.unit[u1].attacking)
									this.entities.unit[u1].engage(this.entities.unit[u2]);
							}
							else{
								if(!this.entities.unit[u2].attacking)
									this.entities.unit[u2].engage(this.entities.unit[u1]);
							}
						}
					}
				}
			}
		}
	}

	forEachEntity(callback){	
		for(var t in this.entities.town)
			callback(this.entities.town[t]);
		for(var u in this.entities.unit)
			callback(this.entities.unit[u]);
	}
	
	forEachTown(callback){	
		for(var t in this.entities.town)
			callback(this.entities.town[t]);
	}
	
	forEachUnit(callback){	
		for(var u in this.entities.unit)
			callback(this.entities.unit[u]);
	}

	tick(){
		if(!that.paused	&& that.player){
			that.player.tick();
				if(that.player.townCount <= 0){
					that.paused = true;
					that.client.gameFinished();
					that.lost = true;
				}
				that.forEachUnit(function(unit){
					unit.tick();
				});
				that.handleCollision();
				that.client.tick();
		}
	}

	setSocket(socket){
		this.client.setSocket(socket);
	}

	getNewId(entity){
		this.client.requestNewId();
		this.waitingId.push(entity);
	}

	startGame(){
		this.entities = {
			town : [],
			unit : []
		};

		this.paused = false;
		this.hasStarted = true;
	}

	setPlayer(name, type, allied, startingX, startingY){
		var player = new Player(name, type, allied, startingX, startingY);

		if(allied){
			this.player = player;
		}
	}

	sendError(message){
		this.hud.getError(message);
		console.log(message);
	}
}
