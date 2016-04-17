"use strict";

var BulletShooter = Bullet.extend({
	init : function (x, y, settings) {
		settings = settings || {};

		settings.image = "bone_projectile";
		settings.width = 48;
		settings.height = 48;
		settings.frameheight = 96;
		settings.framewidth = 64;
		settings.speed = 5;
		settings.mask = me.collision.types.PLAYER_OBJECT; // Enemy bullet!

		this._super(Bullet, 'init', [x, y, settings]);

		this.renderable.addAnimation("stand",  [0, 1], 100);
		this.renderable.setCurrentAnimation("stand");
	},
});
