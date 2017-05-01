class Map{
	constructor(map){
		this.tileset = new Tileset(map.tileset);
		this.terrain = map.terrain;
		this.walls = map.walls;
		}
	
	getHeight() {
		return this.terrain.length;
	}
	getWidth() {
		return this.terrain[0].length;
	}
	
	// Méthode de dessin du tile numéro "numero" dans le contexte 2D "context" aux coordonnées x et y
	draw(context, xView, yView) {
		context.save();	
	    context.transform(  1,   0.5,
	                   -1,   0.5,
	                  0,   0    );
	
		for(var i = 0, l = this.terrain.length ; i < l ; i++) {
			var ligne = this.terrain[i];
			var y = i * 32;
			for(var j = 0, k = ligne.length ; j < k ; j++) {
				this.tileset.dessinerTile(ligne[j], context, j * 32 - xView - yView, y - yView + xView);
				if(this.walls[i][j] == 1){
					context.save();
					context.fillStyle = "rgba(255, 255, 255, 1);"
					context.fillRect(j * 32 - xView - yView, y - yView + xView, 33, 33);
					context.restore();
				}
			}
		}
		context.restore();
	}
}