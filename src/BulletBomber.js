"use strict";

var BulletBomber = Bullet.extend({
	init : function (x, y, settings) {
		settings = settings || {};

		settings.image = "bullet_bomber";
		settings.width = 64;
		settings.height = 64;
		settings.frameheight = 64;
		settings.framewidth = 64;
		settings.speed = 5;
		settings.mask = me.collision.types.PLAYER_OBJECT; // Enemy bullet!

		this._super(Bullet, 'init', [x, y, settings]);

		this.renderable.addAnimation("stand",  [0, 0], 100);
		this.renderable.setCurrentAnimation("stand");
	},
});
