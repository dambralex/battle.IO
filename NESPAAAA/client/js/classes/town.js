class Town{
	constructor(town, player, posX, posY){
		if(town){
			this.id = town.id;
			this.kind = town.kind;
		
			// Position
			this.posX = town.posX;
			this.posY = town.posY;
			this.width = town.width;
			this.height = town.height;
		
			// Range
			this.visualRange = town.visualRange;
			this.attackRange = town.attackRange;
		
			// Movement
			this.nextDestination = town.nextDestination;
		
			// Health
			this.hitPoints = town.hitPoints;
			this.maxHitPoints = town.maxHitPoints;
		
			// Modes
			this.attacking = town.attacking;
			this.player = town.player;
			this.movable = town.movable;
			this.selected = false;
			this.dead = town.dead;
		
			// Composition
			this.name = town.name;
			this.stage = town.stage; // état de la ville en cours
		
			
			this.construction = town.construction;
		
			this.stone = town.stone;
		    this.wood = town.wood;
		    this.iron = town.iron;
		    this.income = town.income;
		
		    this.timerConstruction = town.timerConstruction;
		    this.isBuilding = town.isBuilding;
		    this.currentBuilding = town.currentBuilding;
		
			that.entities.town[this.id] = this;
		}
		else{
			that.getNewId(this);
			this.kind = kinds.town;
		
			// Position
			this.posX = posX;
			this.posY = posY;
			this.width = 200;
			this.height = 200;
		
			// Range
			this.visualRange = 5;
			this.attackRange = 2;
		
			// Movement
			this.nextDestination = null;
		
			// Health
			this.hitPoints = 400;
			this.maxHitPoints = 400;
		
			// Modes
			this.attacking = false;
			this.player = player;
			this.movable = false;
			this.selected = false;
			this.dead = false;
		
			// Composition
			this.name = this.player.name+"'s town";
			this.stage = 0; // état de la ville en cours
		
			
			this.construction = [];//tableau contenant les batiments construits
		
			this.stone = 0;
		    this.wood = 0;
		    this.iron = 0;
		    this.income = 60;
		
		    this.timerConstruction = new Timer();
		    this.isBuilding = false;
		    this.currentBuilding = null;
		
		    this.player.addTown();	
		}
	}

	draw(context, xView, yView) {
	//grosse modif de malade (alex)
		// désolé par avance
	
		var chemin_init = "./sprites/jeu/";
		//l'image utilisée en idle se trouve dans client/sprites/jeu/unites/human/archer/walk.png
		//il s'agira de la premiere de chaque walk.png, y compris les batiments.
		//ainsi, il sera facile lors de la création d'unité, ou de batiment d'alterner entre deux ou troi images...
	
	
		context.save();	
	
		var sprite = new Image();
	
		var overlay = '_';
		var screenPosition = this.getScreenPosition(xView, yView);
	
		if(this.selected && !(this.player == that.player)){
			context.strokeStyle = 'red';
			overlay = '_pink';
			context.strokeRect(screenPosition.x,screenPosition.y,142,132);
		}
		else if(this.dead)
			overlay = '_black';
		else if(this.selected){
			context.strokeStyle = 'green';
			overlay = '_green';
			context.strokeRect(screenPosition.x,screenPosition.y,142,132);
		}
		else if(!(this.player == that.player))
			overlay = '_red';
		else
			overlay = '_';
	
		var chemin_add = "batiments/human/bat_";
		sprite.src = chemin_init+chemin_add+Towns["niveau"][this.stage].bat_img+overlay+".png";
		
		context.drawImage(sprite,0,0,142,132,screenPosition.x,screenPosition.y,142,132);
		this.width = 142;
		this.height = 132;
		
		context.restore();	
	};
	
	update(delta){
		if(this.isBuilding && this.timerConstruction.isOver(Date.now())){
			this.stone += Towns["batiments"][this.currentBuilding]["apports"].pierre;
			this.wood += Towns["batiments"][this.currentBuilding]["apports"].bois;
			this.iron += Towns["batiments"][this.currentBuilding]["apports"].fer;
			this.income += Towns["batiments"][this.currentBuilding]["apports"].or;
	
			this.construction.push(this.currentBuilding);
	
			this.currentBuilding = null;
			this.isBuilding = false;
	
	
			this.player.calculIncome();
		}
	}
	
	select(){
		this.selected = true;
	}
	
	unselect(){
		this.selected = false;
	}
	
	getScreenPosition(xView, yView){
		return {x : this.posX + this.posY * -1 - xView * 2, y : this.posX * 0.5 + this.posY*0.5 - yView};
	}
	
	isAlliedWith(entity){
		if(this.player.id == entity.player.id){
			return true;
		}
	
		return false;
	}
	
	isAllied(){
		return (this.player == that.player);
	}
	
	getResources(){
		return {wood : this.wood, stone : this.stone, iron : this.iron, income : this.income}
	}
	
	hurt(dmg){
		this.hitPoints -= dmg;
		if(this.hitPoints <= 0){
			this.die();
		}
	}
	
	die(){
		this.dead = true;
	
		this.player.deleteTown();
	
		if(this.deathCallback) {
			this.deathCallback();
	    }
	}
	
	getCenter(){
		return {x : this.posX, y : this.posY };
	}
	
	getSize(){
		var position = this.getCenter();
	
		var box = {x : position.x, y : position.y, w : this.width, h : this.height};	
		return box;
	}
	
	getSizeOnScreen(){
		var xView = that.camera.posX;
		var yView = that.camera.posY;
	
		var position = this.getScreenPosition(xView, yView);
	
		var box = {x : position.x, y : position.y, w : this.width, h : this.height};	
		return box;
	}
	
	buildConstruction(name){
		console.log(Towns);
		if(this.isBuilding == false){
			if(this.player.gold >= Towns["batiments"][name].cout){
				this.timerConstruction = new Timer(Towns["batiments"][name].production, Date.now());
				this.player.gold -= Towns["batiments"][name].cout
				this.currentBuilding = name;
				this.isBuilding = true;
			}
			else {
				console.log ("pas assez de ressources");
			}
		}
	}
	//added by Alex (tempo voir si ca marche)
	upgrade(){
		console.log(Towns);
		if (this.stage <= Towns["niveau"].length){
			this.stage ++;
		}
		this.timerConstruction = new Timer(Towns["niveau"][this.stage].production, Date.now());
		this.player.gold -= Towns["niveau"][this.stage].cout;
	
		this.hitPoints = this.hitPoints + (Towns["niveau"][this.stage].points_vie - this.maxHitPoints);
		this.maxHitPoints = Towns["niveau"][this.stage].points_vie;
		
	
		console.log (this.stage);
	
	
	}
	
	setId(id){
		this.id = id;
		that.entities.town[id] = this;
	}
	
	setInformation(entity){
	
		this.stage = entity.stage;
		this.maxHitPoints = entity.maxHitPoints;
		this.hitPoints = entity.hitPoints;
		this.dead = entity.dead;
	}
}