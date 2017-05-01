class MouseObj{
	constructor(){
		this.isDrawing = false;
		this.outLeft = false;
		this.outTop = false;
		this.outRight = false;
		this.outBottom = false;
		this.startX;
		this.startY;
		this.mouseX;
		this.mouseY;
		this.cameraX;
		this.cameraY;
	}

	draw(context, xView, yView) {
		if(this.isDrawing){
			context.strokeStyle = 'green';
			context.strokeRect(this.startX + this.getXOffset(xView, 2),
							   this.startY + this.getYOffset(yView, 2),
							   this.mouseX - this.startX - this.getXOffset(xView, 2),
							   this.mouseY - this.startY - this.getYOffset(yView, 2));
		}
	};
	
	setIsDrawing(state, xView, yView){
		this.isDrawing = state;
		this.cameraX = xView;
		this.cameraY = yView;
	}
	
	setOutLeft(state){
		this.outLeft = state;
	}
	
	setOutTop(state){
		this.outTop = state;
	}
	
	setOutRight(state){
		this.outRight = state;
	}
	
	setOutBottom(state){
		this.outBottom = state;
	}
	
	getXOffset(xView, coef){
		return (this.cameraX - xView) * 2;
	}
	
	getYOffset(yView,coef){
		return (this.cameraY - yView) * 2;
	}
	
	getSelectionBox(xView, yView){
		return {
			x : this.startX + this.getXOffset(xView, 2),
			y : this.startY + this.getYOffset(yView, 2),
			w : this.mouseX - this.startX - this.getXOffset(xView, 2),
			h : this.mouseY - this.startY - this.getYOffset(yView, 2)
		}
	}
}