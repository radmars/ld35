"use strict";

var EnemyShooter = Enemy.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.height = 128;
		settings.width = 128;
		settings.image = "shooter";

		this._super(Enemy, 'init', [x, y, settings]);

		// Properties of this nefarious creature.
		this.speed = {
			x: 3,
			y: 1,
		};

		this.body.setMaxVelocity(this.speed.x, this.speed.y);

		this.chooseDirection();

		this.behavior = {
			current : 'rest',
		};
	},

	// Is the player above us?
	playerAbove : function() {
		var angle = this.angleTo(this.getPlayer());
		if(angle < 0){
			return true;
		}
		return false;
	},

	// Move mostly left and right, so reduced magnitude up and down.  Favor moving toward the player on the vertical axis, but do not do so all the time.
	chooseDirection : function () {
		// Left or right?
		var right = Math.floor(Math.random() * 2) === 0;

		// Up or down?
		var skew = 3; // Likelihood of moving toward the player.  skew out of skew + 1 times we will do so.
		var away = (Math.floor(Math.random() * (skew + 1))) === 0;
		var up = this.playerAbove() != away;
		
		// Oh boy, vector time!
		this.dir = new me.Vector2d(this.speed.x, this.speed.y); // Initially up and to the right
		this.dir.scale(
			right ? 1 : -1,
			up ? 1 : -1
		);
	},
});
