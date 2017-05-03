class Button{
	constructor(text, posX, posY, source){
		var self = this;

		this.posX = posX || 0;
		this.posY = posY || 0;
		this.pressed = false;
		this.showButton = false;
		this.description = "";
		this.stats = "";

		this.switchdraw = 0;

		this.text = text || "";

		this.icone = new Image();

		this.source = source;
		this.icone.src = source;
		if (this.source != null){
			this.switchdraw = 1;
		}
		else{
			this.switchdraw = 0;
			this.icone.src = "./sprite/hud/construction/blank.png";
		}
	}

	press(){
		this.pressed = true;
		this.onClick();
	}

	unpress(){
		this.pressed = false;
	}

	setPosition(x, y){
		this.posX = x;
		this.posY = y;
	}

	draw(context){
		context.save()
		if(this.showButton){		
			if(!this.pressed){
				if (this.switchdraw == 1){
					context.drawImage(this.icone,0,0,38,38,this.posX,this.posY,38,38);
				}
				else{
					context.strokeStyle = 'purple';
					
					context.strokeRect(this.posX, this.posY, 40, 40);
					if(this.text){
						context.fillStyle = 'purple';
	   	 				context.font = "8pt Arial";
	   	 				context.fillText(this.text, this.posX+5, this.posY+20);
					}
				}
			}
			else{
				if (this.switchdraw == 1){
					context.strokeStyle = 'yellow';
					context.strokeRect(this.posX, this.posY, 40, 40);
					context.drawImage(this.icone,0,0,38,38,this.posX,this.posY,38,38);
				}
				else{
					context.fillStyle = 'purple';
					context.fillRect(this.posX, this.posY, 40, 40);
					context.strokeStyle = 'yellow';
					context.strokeRect(this.posX, this.posY, 40, 40);
					if(this.text){
						context.fillStyle = 'white';
						context.font = "8pt Arial";
						context.fillText(this.text, this.posX+5, this.posY+20);
					}
				}
			}
		}
		context.restore();
	}

	onClick(){
		if(this.clickCallback){
			this.clickCallback();
		}
	}

	togglePressed(){
		if(this.pressed == true)
			this.pressed = false;
		else
			this.pressed = true;
	}

	setOnClick(callback){
		this.clickCallback = callback;
	}

	setText(text){
		this.text = text;
	}

	setDescription(description){
		this.description = description;
	}

	setStats(stats){
		this.stats = stats;
	}

	addDescription(description){
		this.description += description;
	}

	addStats(stats){
		this.stats += stats;
	}

	getBoundingBox(){
		return {x : this.posX, y : this.posY, w : 40, h : 40};
	}
}