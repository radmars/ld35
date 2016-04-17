"use strict";

var BoneProjectile = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.image = "bone_projectile";
		settings.width = 48;
		settings.height = 48;
		settings.frameheight = 96;
		settings.framewidth = 64;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.z = 1;
		this.speed = 5;

		this.alwaysUpdate = true;
		this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(5, 5);
		this.body.setFriction(0, 0);
		this.body.gravity = 0;
		this.setDirection(settings.dir);
		this.setMask(settings.mask);


		this.renderable.addAnimation("stand",  [0, 1], 100);
		this.renderable.setCurrentAnimation("stand");
	},

	setMask: function(add) {
		this.body.setCollisionMask( 0
			| me.collision.types.WORLD_SHAPE
			| me.collision.types.COLLECTABLE_OBJECT
			| add
		)
	},

	setDirection: function(dir) {
		this.body.vel.x = dir.x * this.speed;
		this.body.vel.y = dir.y * this.speed;
	},

	onDeactivateEvent: function() {
	},

	update : function (dt) {
		this.body.update(dt);

		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {

		if(other.body.collisionType == me.collision.types.ENEMY_OBJECT) {
			// We need to disable additional collisions so we don't attempt to remove objects multiple times.
			other.body.setCollisionMask(me.collision.types.NO_OBJECT);

			me.game.world.removeChild(other);
		}

		// Bullets never respond to collisions other than with destruction.
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);
		me.game.world.removeChild(this);

		return false;
	}
});
