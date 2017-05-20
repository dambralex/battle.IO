class Camera{
    constructor(posX, posY, canvasWidth, canvasHeight, worldWidth, worldHeight){
        this.posX = posX || 0;
        this.posY = posY || 0;
    
        this.wView = canvasWidth;
        this.hView = canvasHeight;
    
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    
        this.speed = 500;
    } 

    update(dt, left, top, right, bottom){
        this.viewportBox = {x : this.posX, y : this.posY, w : this.wView, h : this.hView};
    
        if(left){
            this.posX -= this.speed * dt;
    
            this.posX = Math.max(this.posX, -this.worldHeight/2);
        }
        if(top){
            this.posY -= this.speed * dt;
    
            this.posY = Math.max(this.posY, 0);
    
        }
        if(right){
            this.posX += this.speed * dt;
    
            this.posX = Math.min(this.posX, -(this.wView - this.worldWidth)/2);
    
    
        }
        if(bottom){
            this.posY += this.speed * dt;

            this.posY = Math.min(this.posY, -this.hView + (this.worldHeight + this.worldWidth)/2 + 200);
        }
    }
}