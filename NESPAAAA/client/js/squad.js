define(['entity', 'timer'], function(Entity, Timer) {
	
	var Squad = Entity.extend({
		init: function(id, kind){
			var self = this;

			this._super(id, kind);

			// Range
			this.visualRange = 0;
			this.attackRange = 0;

			// Combat
			this.moral = 0;
			this.maxMoral = 0;

			// Movement
			this.nextDestination = null;

			// Composition
			this.units = {};

			// Modes
			this.attackingMode = false;
			this.fleeingMode = false;
			this.isDecimated = false;

		},

		moveTo: function(x, y){
			var xOffset = 0;
			var yOffset = 0;
			for(var unit in units){
				unit.moveTo(x + xOffset, y + yOffset);
			}
		}

		addUnit: function(unit){
			units.push(unit);
		}
    });

    return Squad;
});