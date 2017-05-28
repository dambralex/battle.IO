class Player{
	constructor(name, type, allied, startingX, startingY){
		    this.name = name;
    	this.type = type;
    	that.getNewId(this);
    	this.townCount = 0;
    	this.population = 0;
	
    	new Town(null, this, startingX, startingY);
	
    	this.stone = 0;
    	this.wood = 0;
    	this.iron = 0;
    	this.gold = 500;
    	this.income = 0;
	
    	this.ally = [];
	
    	this.calculIncome();
	}

	isAlliedWith(player){
		for(var a in this.ally)
			if(player == this.ally[a])
				return true;
	
		return false;
	};
	
	tick(){
		this.calculIncome();
	
		this.gold += this.income;
	
		if(this.gold < 0)
			this.gold = 0;
	
	}
	
	calculIncome(){
		this.stone = 0;
	    this.wood = 0;
	    this.iron = 0;
	    this.income = 0;
	
		var resources;
		for(var t in that.entities.town){
			if(that.entities.town[t].player == this){
				resources = that.entities.town[t].getResources();
				this.wood += resources.wood;
				this.iron += resources.iron;
				this.stone += resources.stone;
				this.income += resources.income;
			}
		}
	
		if(this.stone < 0)
			this.income += this.stone;
		if(this.wood < 0)
			this.income += this.wood * 2;
		if(this.iron < 0)
			this.income += this.iron * 4;
	}
	
	setId(id){
		this.id = id;
	}
	
	addTown(){
		this.townCount++;
	}
	
	deleteTown(){
		this.townCount--;
	}
}