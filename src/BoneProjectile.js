"use strict";

var BoneProjectile = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.image = "bone_projectile";
		settings.width = 64;
		settings.height = 64;
		settings.frameheight = 64;
		settings.framewidth = 64;

		this._super(me.Entity, 'init', [x, y, settings]);

		this.alwaysUpdate = true;
		this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(5, 5);
		this.body.setFriction(0, 0);
		this.body.gravity = 0;

		this.renderable.addAnimation("stand",  [0], 100);
		this.renderable.setCurrentAnimation("stand");
	},

	setMask: function(add) {
		this.body.setCollisionMask(me.collision.types.PROJECTILE_OBJECT | me.collision.types.WORLD_SHAPE | add)
	},

	setDirection: function(dir) {
		this.direction = dir;
	},

	onDeactivateEvent: function() {
		this.direction = null;
	},

	update : function (dt) {
		this.body.vel.x += this.direction.x * 3 * me.timer.tick;
		this.body.vel.y += this.direction.y * 3 * me.timer.tick;

		this.body.update(dt);

		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.ENEMY_OBJECT) {
			me.game.world.removeChild(other);
			me.game.world.removeChild(this);
		}

		// Bullets never respond to collisions other than with destruction.
		return false;
	}
});
