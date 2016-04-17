"use strict";

var EnemyShooter = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.height = 64;
		settings.width = 64;
		settings.image = "shooter";

		this._super(me.Entity, 'init', [x, y, settings]);

		this.alwaysUpdate = true;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(2, 2);
		this.body.setFriction(.1, .1);
		this.body.gravity = 0;

		this.renderable.addAnimation("stand",  [0]);
		this.renderable.setCurrentAnimation("stand");

		this.dir = new me.Vector2d(Math.random() - .5, Math.random() - .5);
		this.dir.normalize();
	},

	update : function (dt) {
		this.body.vel.x = this.dir.x * me.timer.tick;
		this.body.vel.y = this.dir.y * me.timer.tick;

		this.body.update(dt);

		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.ENEMY_OBJECT){
			this.pos.sub(response.overlapV);
			return false;
		}
		if(other.body.collisionType == me.collision.types.PLAYER_OBJECT){
			return false;
		}
		return true;
	}
});
