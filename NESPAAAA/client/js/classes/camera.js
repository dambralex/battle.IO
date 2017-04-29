function Camera(game, posX, posY, canvasWidth, canvasHeight, worldWidth, worldHeight){
    // this.game = game;

    this.posX = posX || 0;
    this.posY = posY || 0;

    this.wView = canvasWidth;
    this.hView = canvasHeight;

    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;

    this.speed = 500;
}

Camera.prototype.update = function(dt, left, top, right, bottom){
    this.viewportBox = {x : this.posX, y : this.posY, w : this.wView, h : this.hView};
    // this.posX += this.speed * dt;

    if(left){
    	this.posX -= this.speed * dt;

        this.posX = Math.max(this.posX, -this.worldHeight/2);
    	// this.posY -= this.speed * dt;
     }
    if(top){
    	this.posY -= this.speed * dt;

        this.posY = Math.max(this.posY, 0);

    	// this.posY += this.speed * dt;
    }
    if(right){
    	this.posX += this.speed * dt;

        this.posX = Math.min(this.posX, -(this.wView - this.worldWidth)/2);

    	// this.posY += this.speed * dt;

    }
    if(bottom){
    	this.posY += this.speed * dt;
    	// this.posY -= this.speed * dt;
    }
}