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
		settings.mask = me.collision.types.PLAYER_OBJECT;

		this._super(Bullet, 'init', [x, y, settings]);

		this.renderable.addAnimation("idle",  [0, 1], 100);
		this.renderable.setCurrentAnimation("idle");

		this.height = 10;
		this.upVelocity = 30;
		this.age = 0;
		this.lifetime = 150;
	},

	explode : function () {
		me.audio.play("explosion");

		var fragments = 8;
		var bulletType = 'bulletShooter';
		var bulletSpeed = 1;

		this.body.setCollisionMask(me.collision.types.NO_OBJECT);
		me.game.world.removeChild(this);

		for(var i = 0; i < fragments; i++){
			var angle = i * (Math.PI * 2) / fragments;

			var bullet = me.pool.pull(
				bulletType,
				this.pos.x,
				this.pos.y,
				{
					dir:(new me.Vector2d(bulletSpeed, 0)).rotate(angle),
				}
			);
			me.game.world.addChild(bullet, bullet.pos.z);
		}
	},


	update : function (dt) {
		// Height logic.  Entirely cosmetic.
		this.height += this.upVelocity;
		this.anchorPoint = new me.Vector2d(0.5, -this.height / 300);

		// BOUNCE
		if(this.height < 0){
			me.audio.play("bomb-tick");
			this.height *= -1;
			this.upVelocity *= -0.5;
		}
		this.upVelocity--;

		this.body.update(dt);
		if(this.body.vel.length() > 0) {
		}

		if(this.age > this.lifetime){
			this.explode();
		}
		else {
			me.collision.check(this);
			this.age++;
		}

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {
		// SUPER BOUNCY!
		return true;
	}
});
