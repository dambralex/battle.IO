function Square(square, player, type, posX, posY){
	if(square){
		// that = game;
	this.type = square.type;
	this.id = square.id;

	// Position
	this.posX = square.posX;
	this.posY = square.posY;
	this.width = square.width;
	this.height = square.height;

	//orientation (by alex)

	/*pour la lecture des images : 
      U   = 0
      UL  = 1
      UR  = 2
      L   = 3
      R   = 4
      DL  = 5
      DR  = 6
      D   = 7
    */

	this.orientation = square.orientation;
	//animation

		this.step = square.step;
		this.anim = square.anim;
		this.repeat = square.repeat;

	// sprites loading (temporaire)
	this.sprite = new Image();

	this.chemin = square.chemin;
	this.overlay = square.overlay;

		//true sprite loading (alex)

	this.img_height = square.img_height;
	this.img_width = square.img_width;
	this.state = square.state;


	//animation

		this.step = square.step;
		this.anim = square.anim;
		this.repeat = square.repeat;
		this.anim_max = this.anim_max;
	

	//done

	// Speed
	this.speed = square.speed;

	// Pathing
	this.nextDestination = square.nextDestination;
	this.path = square.path;

	// Combat
	this.selected = square.selected;

	// Modes
	this.movable = square.movable;
	this.ranged = square.ranged;
	this.attacking = square.attacking;
	this.dead = square.dead;

	this.player = square.player;
	this.following = square.following;

	// Health
	this.hitPoints = square.hitPoints;
	this.maxHitPoints = square.maxHitPoints;

	// Combat
	this.target = square.target;
	this.attackers = square.attackers;

	this.attackCallback = square.attackCallback;

	// Range
	this.attackRange = square.attackRange;
	this.visualRange = square.visualRange;

	// Zones drawing
	this.showCombatZone = square.showCombatZone;
	this.showRangeZone = square.showRangeZone;
	this.showPath = square.showPath;

	this.actionStack = [];

	this.fill();// tout en bas, la fonction récupere les informations de l'objet pour changer ses caractéristiques

	that.entities.unit[this.id] = this;


	// that.entities.unit[this.id] = this;
	}
	else{
		// that = game;
	this.type = type;
	that.getNewId(this);

	// Position
	this.posX = posX;
	this.posY = posY;
	this.width = 50;
	this.height = 50;

	this.orientation = 7;

	// Speed
	this.speed = 50;

	// Pathing
	this.nextDestination = null;
	this.path = [];

	// Combat
	this.selected = false;

	//animation

	this.step = 1;
	this.anim = 0;
	this.repeat = 1;
	this.anim_max = 7;

	// sprites loading (temporaire)
	this.sprite = new Image();

	this.chemin = "./sprites/jeu/unites/human/archer/";
	this.overlay = "_";

	//true sprite loading (alex)

	this.img_height = 0;
	this.img_width = 0;
	this.state = "walk";


	this.width = 58;
	this.height = 73;

	// Modes
	this.movable = true;
	this.ranged = false;
	this.attacking = false;
	this.dead = false;

	this.player = player;
	this.following = false;

	// Health
	this.hitPoints = 500;
	this.maxHitPoints = 500;

	// Combat
	this.target = null;
	this.attackers = {};
	this.setAttackRate(1000);

	this.attackCallback = null;

	// Range
	this.attackRange = 1;
	this.visualRange = 10;

	// Zones drawing
	this.showCombatZone = false;
	this.showRangeZone = false;
	this.showPath = false;

	this.actionStack = [];

	this.fill();// tout en bas, la fonction récupere les informations de l'objet pour changer ses caractéristiques

	// that.entities.unit[this.id] = this;
	}

	
}

Square.prototype.draw = function(context, xView, yView){
	context.save();	

	//modif by alex

	var screenPosition = this.getScreenPosition(xView, yView);

	if(this.showCombatZone)
		this.drawCombatZone(context);
	if(this.showRangeZone)
		this.drawRangeZone(context);
	if(this.showPath)
		this.drawPath(context);

	if(this.selected && !(this.player == that.player)){
		context.fillStyle = 'pink';
		this.overlay = '_pink';
		context.strokeRect(screenPosition.x,screenPosition.y,this.width,this.height);
	}
	else if(this.dead){
		context.fillStyle = 'black';
		this.overlay = '_black';
		context.strokeRect(screenPosition.x,screenPosition.y,this.width,this.height);
	}
	else if(this.selected){
		context.fillStyle = 'green';
		this.overlay = '_green';
		context.strokeRect(screenPosition.x,screenPosition.y,this.width,this.height);
	}
	else if(!(this.player == that.player)){
		context.fillStyle = 'red';
		this.overlay = '_red';
		context.strokeRect(screenPosition.x,screenPosition.y,this.width,this.height);
	}
	else
		context.fillStyle = 'blue';
		this.overlay = '_';

	this.sprite.src = this.chemin + this.state + this.overlay + ".png";
	var screenPosition = this.getScreenPosition(xView, yView);

	// console.log("draw de" + this.chemin + this.state + this.overlay + ".png");
	context.drawImage(this.sprite,this.width* this.step, this.height* this.orientation,this.width,this.height,screenPosition.x, screenPosition.y,this.width,this.height);
	if (this.anim%10 == 0){
		//context.drawImage(this.sprite,this.width* this.step, this.height* this.orientation,this.width,this.height,screenPosition.x, screenPosition.y,this.width,this.height);
		if (this.repeat == 1){
			this.step ++;
			if (this.step > this.anim_max){
				this.step = 0;
			}
		}
		else{
			this.step = 0;
		}
	}
	

	//done
	
	//context.fillRect(screenPosition.x, screenPosition.y, this.width, this.height);
	context.restore();
} 

Square.prototype.getScreenPosition = function(xView, yView){
	return {x : this.posX + this.posY * -1 - xView * 2, y : this.posX * 0.5 + this.posY*0.5 - yView};
}

Square.prototype.drawCombatZone = function(context){
	context.save();	

	var combatZone = this.getCombatZone();

	context.fillStyle = 'yellow';
	context.fillRect(combatZone.x, combatZone.y, combatZone.w, combatZone.h);

	context.restore();

}

Square.prototype.drawRangeZone = function(context){
	context.save();	

	var rangeZone = this.getRangeZone();

	context.fillStyle = 'grey';
	context.fillRect(rangeZone.x, rangeZone.y, rangeZone.w, rangeZone.h);

	context.restore();

}

Square.prototype.drawPath = function(context){

	context.save();

	if(this.nextDestination != null){
		if((this.player == that.player)){
			context.strokeStyle = 'green';
		}
		else{
			context.strokeStyle = 'red';
		}
		
		var center = this.getCenter();

		context.moveTo(center.x, center.y);
		context.lineTo(this.nextDestination.x, this.nextDestination.y);
	
		context.stroke();
	}
	context.restore();

}

Square.prototype.update = function(delta){

	//modif by Alex
	// console.log(this.attacking);
    // console.log(this.target);
	var oldposX =  this.posX;
	var oldposY =  this.posY;

	var angle;
	var angle_conv;

	this.repeat = 1;

	if(!this.dead){
		this.move(delta);
		this.checkCombat();
	}

	this.anim ++;
	//on considere A0B
	//O : old posX, old posY
	//A : pos X, old posY
	//B : pos X, pos Y

	//[OA] = pos X - old pos X
	//[AB] = pos Y - old posY
	//tan (AOB) = [AB] / [OA]
	//angle = arcTan((pos Y - old posY) / (pos X - old pos X));

	//on utilise atan2 (plus simple)

	angle = Math.atan2(this.posX - oldposX, this.posY - oldposY);

	if (oldposX == this.posX && oldposY == this.posY){
		this.repeat = 0;
	}

	// Converts from radians to degrees.
	angle_conv = (angle * 180 / Math.PI)+45;

	if (angle_conv>180){
		angle_conv = angle_conv -360;
	}

	if (this.repeat ==1){
			/*pour la lecture des images : 
      U   = 0
      UL  = 1
      UR  = 2
      L   = 3
      R   = 4
      DL  = 5
      DR  = 6
      D   = 7
    */
		/*console.log("X : " + this.posX + "Y : " + this.posY);
		console.log("oX: " + oldposX + "oY: " +oldposY);
		console.log("angle : "+ angle +"angle_conv : "+angle_conv);*/
		if (angle_conv > 0){
			if (angle_conv < 90){
				if (angle_conv < 23){
					//console.log("L");
					this.orientation = 3;
				}
				else if (angle_conv < 68){
					//console.log("DL");
					this.orientation = 5;
				}
				else{
					//console.log("D");
					this.orientation = 7;
				}
			}
			else{
				if (angle_conv < 113){
					//console.log("D");
					this.orientation = 7;
				}
				else if (angle_conv < 156){
					//console.log("DR");
					this.orientation = 6;
				}
				else {
					//console.log("right");
					this.orientation = 4;
				}
			}
		}
		else{
			if (angle_conv > -90){
				if (angle_conv > -23){
					//console.log("left");
					this.orientation = 3;
				}
				else if (angle_conv > -68){
					//console.log("UL");
					this.orientation = 1;
				}
				else{
					//console.log("U");
					this.orientation = 0;
				}
			}
			else{
				if (angle_conv > -113){
					//console.log("U");
					this.orientation = 0;
				}
				else if (angle_conv > -156){
					//console.log("UR");
					this.orientation = 2;
				}
				else {
					//console.log("right");
					this.orientation = 4;
				}
			}
		}
	}
	//done
	
}	

Square.prototype.move = function(delta){
	var center = this.getCenter();
	if(this.following)
		this.follow();
	if(this.nextDestination != null && !this.attacking){
		if(length(center.x - this.nextDestination.x, center.y - this.nextDestination.y) > 4){
			this.moveTo(this.nextDestination.x, this.nextDestination.y, delta);
		}
		else{	
			if(this.path.length > 0){
				var nextInPath = this.path.shift();
				this.nextDestination = {x : nextInPath.x, y : nextInPath.y};
			}
			else{
				this.nextDestination = null;
			}
		}
	}
}

Square.prototype.moveTo = function(x, y, delta){

	var center = this.getCenter();

	var directionVector = unitVector(x - center.x, y - center.y);

	// console.log("moving to "+directionVector.vx+" , "+directionVector.vy);
	// console.log("moving to "+this.posX+" , "+this.posY);

	this.posX += Math.round(directionVector.vx * this.speed * delta);
	this.posY += Math.round(directionVector.vy * this.speed * delta);

}

Square.prototype.setDestination = function(x, y){
	var thus = this;
	if(window.Worker) {
		var worker = new Worker("http://localhost:8080/js/worker.js");
		//console.log("Envoi message au worker");
		worker.postMessage([this.posX, this.posY, x, y, that.map.walls, that.map.getWidth(), that.map.getHeight(), 32]);
		
		worker.onmessage = function(path) {
			//console.log("Message reçu de la part du worker");
			thus.path = path.data.slice(0);
			
			var nextInPath = thus.path.shift();
			thus.nextDestination = {x : nextInPath.x, y : nextInPath.y};
		}
		
		
	
	}
	//this.path = getPath(this.posX, this.posY, x, y, that.map.walls, that.map.getWidth()*32, that.map.getHeight()*32, 32);
	//var nextInPath = this.path.shift();
		//		this.nextDestination = {x : nextInPath.x, y : nextInPath.y};
	// Pathfind
}

Square.prototype.select = function(){
	this.selected = true;
	// console.log(this.selected);
}

Square.prototype.unselect = function(){
	this.selected = false;
}

Square.prototype.toggleSelect = function(){
	if(this.selected == true)
		this.selected = false;
	else
		this.selected = true;
}

Square.prototype.selectSquad = function(){
	this.squad.select();
}

Square.prototype.isMovable = function(){
	return this.movable;
}

Square.prototype.setAttackRate = function(rate){
	this.attackCooldown = new Timer(rate);
}

Square.prototype.setMaxHitPoints = function(hp){
	this.maxHitPoints = hp;
	this.hitPoints = hp;
}

Square.prototype.engage = function(entity){
	// this.attacking = true;
	this.following = true;
	this.setTarget(entity);
}

Square.prototype.disengage = function(entity){
	this.attacking = false;
	this.following = false;
	this.removeTarget();
}

Square.prototype.isAttacking = function(){
	return this.attacking;
}

Square.prototype.die = function(){
	this.dead = true;

	if(this.deathCallback) {
		this.deathCallback();
    }

    delete that.entities.unit[this.id];
}

Square.prototype.hurt = function(dmg){
	this.hitPoints -= dmg;
	if(this.hitPoints <= 0){
		this.die();
	}

	// console.log(this.hitPoints);

}

Square.prototype.getCenter = function(){
	return {x : this.posX, y : this.posY };
}

Square.prototype.getCenterOnScreen = function(){
	var xView = that.camera.posX;
	var yView = that.camera.posY;

	var center = this.getScreenPosition(xView, yView);
	center.x += this.width/2;
	center.y += this.height/2;

	// var center = {x : this.posX + this.posY * -1 +this.width/2, y :  this.posX * 0.5 + this.posY*0.5 +this.height/2};

	return center;
}

Square.prototype.getCombatZone = function(xView, yView){
	var center = this.getCenterOnScreen();

	var rect = {x : center.x - this.visualRange*32/2,
				y : center.y - this.visualRange*32/2,	
				w : this.visualRange*32,
				h : this.visualRange*32};

	return rect;
}

Square.prototype.getRangeZone = function(xView, yView){
	var center = this.getCenterOnScreen();

	var rect = {x : center.x - (this.attackRange+1)*32/2,
				y : center.y - (this.attackRange+1)*32/2,	
				w : (this.attackRange+1)*32,
				h : (this.attackRange+1)*32};

	return rect;
}

Square.prototype.checkCombat = function(){
	if(this.target)
		if(this.target.dead)
			this.disengage();
		else{
			if(this.attackCooldown.isOver(Date.now()) && collisionBox(this.getRangeZone(), this.target.getRangeZone())){
				// this.target.actionStack.push(this.hurt(50));
				this.target.hurt(50);
				// console.log("dnzaofdnz");
			}
		}
}

Square.prototype.isAlliedWith = function(entity){
	if(this.player.id == entity.player.id){
		return true;
	}

	return false;
}

Square.prototype.isAllied = function(){
	return (this.player == that.player);
}

Square.prototype.setTarget = function(entity){
	this.target = entity;
}

Square.prototype.follow = function(){
	if(collisionBox(this.getRangeZone(), this.target.getSize())){
		this.attacking = true;
		this.following = false;
		this.nextDestination = null;
	}
}

Square.prototype.getTargetPos = function(){
	
	var targetPos = {};

	if(this.target){
		targetPos.x = this.target.posX;
		targetPos.y = this.target.posY;
	}

	return targetPos;
}

Square.prototype.removeTarget = function(){
	this.target = null;
	this.nextDestination = null;
}

Square.prototype.getSize = function(){
	var position = this.getCenterOnScreen();

	var box = {x : position.x, y : position.y, w : this.width, h : this.height};	
	return box;
}

Square.prototype.setId = function(id){
	this.id = id;
	that.entities.unit[id] = this;
}

Square.prototype.setInformation = function(entity){
	// console.log(entity.hitPoints+" , "+entity.id);
	// console.log(this.actionStack);


	if(this.player != that.player){
		// this.hitPoints = entity.hitPoints;
		this.posX = entity.posX;
		this.posY = entity.posY;
		
	}
	else{
		this.hitPoints = entity.hitPoints;
		this.dead = entity.dead;
		console.log(this.dead);
	}
	// this.actionStack = entity.actionStack;
	// for(var i in this.actionStack){
	// 	this.actionStack[i];
	// 	console.log(this.hitPoints);
	// }
	// this.actionStack = [];

}

Square.prototype.fill = function(){
	var race;
	var classe;
	var chemin_init = "./sprites/jeu/unites"
	if (this.player.type == Types.Races.HUMAN){
		race = "/human";
	}
	else {
		race = "/orc";
	}

	//ex : Unites["archers"]["nombre"] donne 6
	if (this.type[0] == 1 ){//cas du warrior
		classe = "/warrior/";
		this.img_height = Unites["warrior"]["image_walk"].img_size_x;
		this.img_width = Unites["warrior"]["image_walk"].img_size_y;
		this.width = Unites["warrior"]["image_walk"].sprite_size_x;
		this.height = Unites["warrior"]["image_walk"].sprite_size_y;
		this.anim_max = Unites["warrior"]["image_walk"].nb_anim -1;
		this.chemin = chemin_init + race + classe;

		this.speed = Unites["warrior"]["vitesse_deplacement"];
		this.atk_speed = Unites["warrior"]["vitesse_attaque"];
		
		this.maxHitPoints = Unites["warrior"]["points_vie"];
		this.hitPoints = maxHitPoints;

		this.setAttackRate(1000);
		this.attackRange = Unites["warrior"]["portée_attaque"];
		this.visualRange = Unites["warrior"]["champs_de_vision"];
	}
	
	else if (this.type[0] == 2){//cas du archer
		classe = "/archer/";
		this.img_height = Unites["archer"]["image_walk"].img_size_x;
		this.img_width = Unites["archer"]["image_walk"].img_size_y;
		this.width = Unites["archer"]["image_walk"].sprite_size_x;
		this.height = Unites["archer"]["image_walk"].sprite_size_y;
		this.anim_max = Unites["archer"]["image_walk"].nb_anim -1;
		this.chemin = chemin_init + race + classe;

		this.speed = Unites["archer"]["vitesse_deplacement"];
		this.atk_speed = Unites["archer"]["vitesse_attaque"];
		
		this.maxHitPoints = Unites["archer"]["points_vie"];
		this.hitPoints = this.maxHitPoints;

		this.setAttackRate(1000);
		this.attackRange = Unites["archer"]["portée_attaque"];
		this.visualRange = Unites["archer"]["champs_de_vision"];
	}

	else if (this.type[0] == 3){//cas du knight
		classe = "/knight/";
		this.img_height = Unites["knight"]["image_walk"].img_size_x;
		this.img_width = Unites["knight"]["image_walk"].img_size_y;
		this.width = Unites["knight"]["image_walk"].sprite_size_x;
		this.height = Unites["knight"]["image_walk"].sprite_size_y;
		this.anim_max = Unites["knight"]["image_walk"].nb_anim -1;
		this.chemin = chemin_init + race + classe;

		this.speed = Unites["knight"]["vitesse_deplacement"];
		this.atk_speed = Unites["knight"]["vitesse_attaque"];
		
		this.maxHitPoints = Unites["knight"]["points_vie"];
		this.hitPoints = maxHitPoints;

		this.setAttackRate(1000);
		this.attackRange = Unites["knight"]["portée_attaque"];
		this.visualRange = Unites["knight"]["champs_de_vision"];
	}
}

Square.prototype.tick = function(){
	if(this.following){
		var targetPos = this.getTargetPos();
		this.setDestination(targetPos.x, targetPos.y);
	}
}