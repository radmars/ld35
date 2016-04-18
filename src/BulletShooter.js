"use strict";

var BulletShooter = Bullet.extend({
	init : function (x, y, settings) {
		settings = settings || {};

		settings.image = "bullet_shooter";
		settings.width = 64;
		settings.height = 63;
		settings.frameheight = 64;
		settings.framewidth = 64;
		settings.speed = 5;
		settings.mask = me.collision.types.PLAYER_OBJECT; // Enemy bullet!

		this._super(Bullet, 'init', [x, y, settings]);

		this.renderable.addAnimation("idle",  [0, 1, 2, 4], 200);
		this.renderable.setCurrentAnimation("idle");
	},
});
