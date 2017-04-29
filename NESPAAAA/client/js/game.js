define(['map', 'squad', 'unit','../../shared/js/gametypes'], function(Map, Squad, Unit)){
	var Game = {
		init: function(){
			this.started = false;
			this.hasNeverStarted = true;

			this.player = new Squad("squad", "");

			this.entities = {};
		}

		tick: function(){
			this.currentTime = new Date().getTime();

			this.
		}
	};
}