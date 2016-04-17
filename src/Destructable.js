"use strict";

var Destructable = me.Entity.extend({
	init: function (x, y, settings) {
		settings = settings || {};
		if(!settings.image) {
			throw "Missing image setting on destructable object!";
		}
		settings.width = 64;
		settings.height = 64;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.z = 0;
		this.alwaysUpdate = true;
		this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
		this.body.setCollisionMask(
			me.collision.types.PROJECTILE_OBJECT
			| me.collision.types.ENEMY_OBJECT
			| me.collision.types.PLAYER_OBJECT
		);
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(0, 0);
		this.body.setFriction(.1, .1);
		this.body.gravity = 0;
		this.bullets = settings.bullets;
	},

	onDeactivateEvent: function() {
	},

	update : function (dt) {
		this.body.update(dt);
		me.collision.check(this);
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.PROJECTILE_OBJECT) {
			if(this.bullets) {
				for(var i = 0; i < 8; i++ ) {
					var angle = Math.PI / 4 * i
					var ca = Math.cos(angle);
					var sa = Math.sin(angle);

					var bullet = me.pool.pull('boneProjectile', this.pos.x, this.pos.y);
					bullet.pos.add((new me.Vector2d(ca, sa)).scale(20, 20));
					bullet.setDirection(new me.Vector2d(ca, sa).normalize());
					// TODO WHAT MASK TO USE???????
					bullet.setMask(me.collision.types.ENEMY_OBJECT);
					me.game.world.addChild(bullet);
				}
			}
		}
		me.game.world.removeChild(this);
		return false;
	}
});
