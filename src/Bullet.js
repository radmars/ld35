"use strict";

var Bullet = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		this._super(me.Entity, 'init', [x, y, settings]);

		this.pos.z = 10;
		this.speed = settings.speed || 5;

		this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(this.speed, this.speed);
		this.body.setFriction(0, 0);
		this.body.gravity = 0;
		this.setDirection(settings.dir);
		this.setMask(settings.mask);
	},

	setMask: function(add) {
		this.body.setCollisionMask( 0
			| me.collision.types.WORLD_SHAPE
			| me.collision.types.COLLECTABLE_OBJECT
			| me.collision.types.ACTION_OBJECT
			| add
		)
	},

	setDirection: function(dir) {
		this.body.vel.x = dir.x * this.speed;
		this.body.vel.y = dir.y * this.speed;
		this.renderable.angle = Math.atan2(dir.y, dir.x);
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
			other.damage();
		}
		if(other.body.collisionType == me.collision.types.PLAYER_OBJECT) {
			other.damage();
		}

		var splode = new me.AnimationSheet(
			this.pos.x + Math.random()*32,
			this.pos.y+ Math.random()*32,
			{
				image: 'blood_impact_64',
				framewidth: 64,
				frameheight: 64,
			}
		);
		splode.pos.z = 3;
		splode.addAnimation('splode', [0, 1, 2, 3, 4], 100);
		splode.addAnimation('splode_over', [4], 100);
		var ancestor = this.ancestor;
		splode.setCurrentAnimation('splode', (function() {
			splode.setCurrentAnimation("splode_over");
			ancestor.removeChild(splode);
		}).bind(this));
		ancestor.addChild(splode, splode.pos.z);

		// Bullets never respond to collisions other than with destruction.
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);
		me.game.world.removeChild(this);

		return false;
	}
});
