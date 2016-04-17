"use strict";

var EnemyBomber = Enemy.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.height = 64;
		settings.width = 64;
		settings.image = "bomber";

		this._super(Enemy, 'init', [x, y, settings]);

		this.alwaysUpdate = true;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(10, 10);
		this.body.setFriction(.1, .1);
		this.body.gravity = 0;
		this.pos.z = 5;

		this.renderable.addAnimation("stand",  [0]);
		this.renderable.setCurrentAnimation("stand");
	},
});
