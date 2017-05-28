class Unit{
	constructor(square, player, type, posX, posY){
		// Constructeur de copie
		if(square){
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
			this.selected = false;
		
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
			this.showCombatZone = false;
			this.showRangeZone = false;
			this.showPath = false;

			this.showHPVariation = true;
		    this.HPVariation = [];
		
			this.actionStack = [];
		
			this.fill();// tout en bas, la fonction récupere les informations de l'objet pour changer ses caractéristiques
		
			that.entities.unit[this.id] = this;
		}

		// Constructeur
		else{
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
			this.showPath = true;

			this.showHPVariation = true;
		    this.HPVariation = [];
		
			this.actionStack = [];

			this.worker = new Worker("./js/worker.js");

			this.player.population++;

			this.fill();// tout en bas, la fonction récupere les informations de l'objet pour changer ses caractéristiques
		}
	}

	draw(context, xView, yView){
		//modif by alex
	
		var screenPosition = this.getScreenPosition(xView, yView);
	
		if(this.showCombatZone)
			this.drawCombatZone(context);
		if(this.showRangeZone)
			this.drawRangeZone(context);
		if(this.showPath)
			this.drawPath(context);
		if(this.showHPVariation)
			this.drawHPVariation(context);
	
		context.save();	

		if(this.selected && !(this.player == that.player)){
			context.strokeStyle = 'red';
			this.overlay = '_pink';
			context.strokeRect(screenPosition.x,screenPosition.y,this.width,this.height);
		}
		else if(this.dead){
			context.strokeStyle = 'black';
			this.overlay = '_';
			context.strokeRect(screenPosition.x,screenPosition.y,this.width,this.height);
		}
		else if(this.selected){
			context.strokeStyle = 'green';
			this.overlay = '_green';
			context.strokeRect(screenPosition.x,screenPosition.y,this.width,this.height);
		}
		else if(!(this.player == that.player)){
			this.overlay = '_red';
		}
		else{
				context.strokeStyle = 'blue';
				this.overlay = '_';
		}
		context.restore();
	
		this.sprite.src = this.chemin + this.state + this.overlay + ".png";
		var screenPosition = this.getScreenPosition(xView, yView);
	
		context.drawImage(this.sprite,this.width* this.step, this.height* this.orientation,this.width,this.height,screenPosition.x, screenPosition.y,this.width,this.height);
		if (this.anim%10 == 0){
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
	} 
	
	getScreenPosition(xView, yView){
		return {x : this.posX + this.posY * -1 - xView * 2, y : this.posX * 0.5 + this.posY*0.5 - yView};
	}
	
	drawCombatZone(context){
		context.save();	
	
		var combatZone = this.getCombatZone();
	
		context.fillStyle = 'yellow';
		context.fillRect(combatZone.x, combatZone.y, combatZone.w, combatZone.h);
	
		context.restore();
	
	}
	
	drawRangeZone(context){
		context.save();	
	
		var rangeZone = this.getRangeZone();
	
		context.fillStyle = 'grey';
		context.fillRect(rangeZone.x, rangeZone.y, rangeZone.w, rangeZone.h);
	
		context.restore();
	
	}
	
	drawPath(context){
	
		context.save();
	
		if(this.nextDestination != null){
			var endPath = {};
			// var endPath = this.path[this.path.length-1];
			if(this.path.length > 0){
				endPath.x = this.path[this.path.length-1].x;
				endPath.y = this.path[this.path.length-1].y;
			}
			else{
				endPath = this.nextDestination;
			}

			var xView = that.camera.posX;
			var yView = that.camera.posY;
			endPath = {x : endPath.x - endPath.y - xView * 2, y : endPath.x * 0.5 + endPath.y*0.5 - yView};

			if(this.target){
				context.strokeStyle = 'red';
			}
			else{
				context.strokeStyle = 'blue';
			}
			
			var center = this.getCenterOnScreen();
			
			context.beginPath();
			context.moveTo(center.x, center.y);
			context.lineTo(endPath.x, endPath.y);
		
			context.stroke();
		}
		context.restore();
	
	}

	drawHPVariation(context){
		context.save();
		for(var i in this.HPVariation){
			var timePourcent = this.HPVariation[i].timer.pourcentageOver(Date.now());

			if(timePourcent > 1){
				delete this.HPVariation[i];
				return;
			}

			if(this.HPVariation[i].variation > 0)
				context.fillStyle = 'green';
			else
				context.fillStyle = 'red';

			var xView = that.camera.posX;
			var yView = that.camera.posY;

			var position = this.getScreenPosition(xView, yView);

	    	context.font = "7pt Arial";
			context.fillText(this.HPVariation[i].variation, position.x + this.width/2, position.y-50*timePourcent);

		}

		context.restore();
	}
	
	update(delta){
	
		//modif by Alex
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
			
			if (angle_conv > 0){
				if (angle_conv < 90){
					if (angle_conv < 23){
						this.orientation = 3;
					}
					else if (angle_conv < 68){
						this.orientation = 5;
					}
					else{
						this.orientation = 7;
					}
				}
				else{
					if (angle_conv < 113){
						this.orientation = 7;
					}
					else if (angle_conv < 156){
						this.orientation = 6;
					}
					else {
						this.orientation = 4;
					}
				}
			}
			else{
				if (angle_conv > -90){
					if (angle_conv > -23){
						this.orientation = 3;
					}
					else if (angle_conv > -68){
						this.orientation = 1;
					}
					else{
						this.orientation = 0;
					}
				}
				else{
					if (angle_conv > -113){
						this.orientation = 0;
					}
					else if (angle_conv > -156){
						this.orientation = 2;
					}
					else {
						this.orientation = 4;
					}
				}
			}
		}
		//done
		
	}	
	
	move(delta){
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
	
	moveTo(x, y, delta){
	
		var center = this.getCenter();
	
		var directionVector = unitVector(x - center.x, y - center.y);
		
		this.posX += Math.round(directionVector.vx * this.speed * delta);
		this.posY += Math.round(directionVector.vy * this.speed * delta);
	
	}	

	setDestination(x, y){
		var thus = this;
		var center = this.getCenter();
		if(window.Worker && !this.dead) {
			this.worker.postMessage([center.x, center.y, x, y, that.map.walls, that.map.getWidth(), that.map.getHeight(), 32]);
			
			this.worker.onmessage = function(path) {
				thus.path = path.data.slice(0);
				thus.path[thus.path.length-1] = {x : x, y : y};
				
				var nextInPath = thus.path.shift();
				if(nextInPath){
					thus.nextDestination = {x : nextInPath.x, y : nextInPath.y};
				}
			}
		}
	}
	
	select(){
		this.selected = true;
	}
	
	unselect(){
		this.selected = false;
	}
	
	toggleSelect(){
		if(this.selected == true)
			this.selected = false;
		else
			this.selected = true;
	}
	
	isMovable(){
		return this.movable;
	}
	
	setAttackRate(rate){
		this.attackCooldown = new Timer(rate);
	}
	
	setMaxHitPoints(hp){
		this.maxHitPoints = hp;
		this.hitPoints = hp;
	}
	
	engage(entity){
		if(!this.nextDestination){
			this.setFollow(entity);
		}
	}
	
	disengage(entity){
		this.attacking = false;
		this.following = false;
		this.removeTarget();
	}
	
	setFollow(entity){
		this.following = true;
		this.setTarget(entity);
	}
	
	isAttacking(){
		return this.attacking;
	}
	
	die(){
		this.dead = true;
		this.following = false;
		this.path = [];
		this.player.population--;
	
		if(this.deathCallback) {
			this.deathCallback();
	    }

	    // if(this.player != that.player)
	    	// delete that.entities.unit[this.id];
	
	    // Faire disparaitre les cadavres *siffle en faisant l'innocent*
	}
	
	hurt(dmg){
		this.hitPoints -= dmg;
		this.HPVariation.push({timer : new Timer(1000, Date.now()), variation : -dmg});
		if(this.hitPoints <= 0){
			this.die();
		}	
	}
	
	getCenter(){
		var width = this.width/4 + this.height/2;
		var height = -this.width/4 + this.height/2;

		return {x : this.posX + width, y : this.posY + height};
	}
	
	getCenterOnScreen(){
		var xView = that.camera.posX;
		var yView = that.camera.posY;
	
		var center = this.getScreenPosition(xView, yView);
		center.x += this.width/2;
		center.y += this.height/2;
		
		return center;
	}
	
	getCombatZone(xView, yView){
		var center = this.getCenterOnScreen();
	
		var rect = {x : center.x - this.visualRange*32/2,
					y : center.y - this.visualRange*32/2,	
					w : this.visualRange*32,
					h : this.visualRange*32};
	
		return rect;
	}
	
	getRangeZone(xView, yView){
		var center = this.getCenterOnScreen();
	
		var rect = {x : center.x - (this.attackRange+1)*32/2,
					y : center.y - (this.attackRange+1)*32/2,	
					w : (this.attackRange+1)*32,
					h : (this.attackRange+1)*32};
	
		return rect;
	}
	
	checkCombat(){
		if(this.target)
			if(this.target.dead)
				this.disengage();
			else{
				if(collisionBox(this.getRangeZone(), this.target.getSizeOnScreen())){
	
				}
				if(this.attackCooldown.isOver(Date.now()) && collisionBox(this.getRangeZone(), this.target.getSizeOnScreen())){	
					this.target.hurt(20);
					var tmp = {
						id : this.target.id,
						argument : "entity",
						methode : "entity.hurt(20)"
					};
	
					that.actionStack.push(tmp);
				}
			}
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
	
	setTarget(entity){
		this.target = entity;
	}
	
	follow(){
		if(collisionBox(this.getRangeZone(), this.target.getSizeOnScreen())){
			this.attacking = true;
			this.nextDestination = null;
		}
	}
	
	getTargetPos(){
		
		var targetPos = {};
	
		if(this.target){
			targetPos = this.target.getCenter();
		}
	
		return targetPos;
	}
	
	removeTarget(){
		this.target = null;
		this.nextDestination = null;
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
	
	setId(id){
		this.id = id;
		that.entities.unit[id] = this;
	}
	
	setInformation(entity){

		this.maxHitPoints = entity.maxHitPoints;
		this.hitPoints = entity.hitPoints;
		this.posX = entity.posX;
		this.posY = entity.posY;
		this.orientation = entity.orientation;
		this.step = entity.step;
		this.anim = entity.anim;
		this.dead = entity.dead;
	}
	
	fill(){
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
			
	
			this.speed = Unites["knight"]["vitesse_deplacement"];
			this.atk_speed = Unites["knight"]["vitesse_attaque"];
			
			this.maxHitPoints = Unites["knight"]["points_vie"];
			this.hitPoints = this.maxHitPoints;
	
			this.setAttackRate(1000);
			this.attackRange = Unites["knight"]["portée_attaque"];
			this.visualRange = Unites["knight"]["champs_de_vision"];
		}
		this.chemin = chemin_init + race + classe;
	}
	
	tick(){
	
		if(this.following){
			var targetPos = this.getTargetPos();
			this.setDestination(targetPos.x, targetPos.y);
		}
	}
	
}