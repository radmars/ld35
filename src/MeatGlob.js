"use strict";

var MeatGlob = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.image = "meat_glob";
		settings.width = 48;
		settings.height = 48;
		settings.frameheight = 96;
		settings.framewidth = 64;
		settings.speed = 5;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.pos.z = 5;
		this.body.setCollisionMask( me.collision.types.PLAYER_OBJECT);
		this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
		this.renderable.addAnimation("stand",  [0, 1], 100);
		this.renderable.setCurrentAnimation("stand");
	},

	collect: function(player) {
		this.body.setCollisionMask( me.collision.types.NO_OBJECT);
		this.ancestor.removeChild(this);
		player.addMeat();
	},

	onCollision : function (response, other) {
		return false;
	},
});
