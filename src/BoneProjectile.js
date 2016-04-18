"use strict";

var BoneProjectile = Bullet.extend({
	init : function (x, y, settings) {
		settings = settings || {};

		settings.image = "bone_projectile";
		settings.width = 64;
		settings.height = 64;
		settings.frameheight = 64;
		settings.framewidth = 64;
		settings.speed = 10;
		settings.mask = me.collision.types.ENEMY_OBJECT; // Friendly bullet!

		this._super(Bullet, 'init', [x, y, settings]);

		this.renderable.addAnimation("stand",  [0, 1, 2, 3], 100);
		this.renderable.setCurrentAnimation("stand");
	},
});

var PlayerBloodProjectile = Bullet.extend({
	init : function (x, y, settings) {
		settings = settings || {};

		settings.image = "player_blood_bullet";
		settings.width = 64;
		settings.height = 64;
		settings.frameheight = 64;
		settings.framewidth = 64;
		settings.speed = 10;
		settings.mask = me.collision.types.ENEMY_OBJECT; // Friendly bullet!



		this._super(Bullet, 'init', [x, y, settings]);

		this.renderable.addAnimation("stand",  [0, 1, 2, 3, 4], 100);
		this.renderable.setCurrentAnimation("stand");
	},
});

