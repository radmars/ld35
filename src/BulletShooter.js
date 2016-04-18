"use strict";

var BulletShooter = Bullet.extend({
	init : function (x, y, settings) {
		settings = settings || {};

		settings.image = "bullet_shooter";
		settings.width = 32;
		settings.height = 32;
		settings.frameheight = 32;
		settings.framewidth = 32;
		settings.speed = 5;
		settings.mask = me.collision.types.PLAYER_OBJECT; // Enemy bullet!

		this._super(Bullet, 'init', [x, y, settings]);

		this.renderable.addAnimation("idle",  [0, 1, 2], 200);
		this.renderable.addAnimation("shoot" [3,4], 200);
		this.renderable.addAnimation("run", [0, 5, 0, 6], 200);
		this.renderable.addAnimation("hit", [7], 200);
		this.renderable.setCurrentAnimation("idle");

		this.renderable.addAnimation("stand",  [0, 0], 100);
		this.renderable.setCurrentAnimation("stand");
	},
});
