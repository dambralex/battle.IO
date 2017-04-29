function Town(game, player, posX, posY){
	this.game = game;

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

	this.game.entities.town.push(this);
}

Town.prototype.draw = function(context, xView, yView) {
	context.save();	

	if(this.selected && !this.isAlliedWith())
		context.fillStyle = 'pink';
	else if(this.dead)
		context.fillStyle = 'black';
	else if(this.selected)
		context.fillStyle = 'green';
	else if(!this.isAlliedWith())
		context.fillStyle = 'red';
	else
		context.fillStyle = 'blue';

	var screenPosition = this.getScreenPosition(xView, yView);
	
	context.fillRect(screenPosition.x, screenPosition.y, this.width, this.height);
	context.restore();	

	// context.fillRect(this.posX - xView, this.posY - yView, this.width, this.height);
};

Town.prototype.update = function(delta){
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

Town.prototype.select = function(){
	this.selected = true;
}

Town.prototype.unselect = function(){
	this.selected = false;
}

Town.prototype.getScreenPosition = function(xView, yView){
	return {x : this.posX + this.posY * -1 - xView * 2, y : this.posX * 0.5 + this.posY*0.5 - yView};
}

Town.prototype.isAlliedWith = function(){
	return true;
}

Town.prototype.getResources = function(){
	return {wood : this.wood, stone : this.stone, iron : this.iron, income : this.income}
}

Town.prototype.buildConstruction = function(name){
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
Town.prototype.upgrade = function(){
	console.log(Towns);
	this.stage ++;
	//if(this.isBuilding == false){ // ?
	this.timerConstruction = new Timer(Towns["niveau"][stage].production, Date.now());
	this.player.gold -= Towns["niveau"][lvl].cout

}