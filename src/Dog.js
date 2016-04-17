"use strict";

var Dog = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.height = 128;
		settings.width = 128;
		settings.image = "dog";

		this._super(me.Entity, 'init', [x, y, settings]);

		this.alwaysUpdate = true;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(10, 10);
		this.body.setFriction(.1, .1);
		this.body.setCollisionMask(me.collision.types.WORLD_SHAPE);
		this.body.gravity = 0;
		this.z = 0;

		this.renderable.addAnimation("stand",  [0]);
		this.renderable.setCurrentAnimation("stand");
		this.angle = 0;
		this.dir = new me.Vector2d();
	},

	// melonJS built-in handlers
	update : function (dt) {
		// run in circles
		this.angle += .001 * dt;
		if(this.angle > Math.PI * 2) {
			this.angle -= Math.PI * 2;
		}
		this.dir.x = Math.cos(this.angle);
		this.dir.y = Math.sin(this.angle);

		this.body.vel.x = this.dir.x * 2 * me.timer.tick;
		this.body.vel.y = this.dir.y * 2 * me.timer.tick;

		this.body.update(dt);

		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.WORLD_SHAPE) {
			return true;
		}
		return false;
	}
});
