"use strict";

var PlayerEntity = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.image = "player";
		settings.width = 196;
		settings.height = 196;
		settings.frameheight = 180;
		settings.framewidth = 130;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.pos.z = 5;

		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		me.state.current().player = this;

		this.alwaysUpdate = true;
		this.body.collisionType = me.collision.types.PLAYER_OBJECT;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(3, 3);
		this.body.setFriction(.1, .1);
		this.body.gravity = 0;

		this.renderable.addAnimation("stand",  [0], 100);
		this.renderable.setCurrentAnimation("stand");

		this.shootSub = me.event.subscribe(me.event.KEYDOWN, this.tryToShoot.bind(this));
		this.shootTimer = 0;
	},

	tryToShoot: function(action, keyCode, edge) {
		// TODO: shoot timersssss!
		if (action === "shoot" && this.shootTimer > 0) {
			this.shootTimer = 0;
			var x = 0;
			var y = 0;

			if (me.input.isKeyPressed('left')) {
				x = -1
			}
			else if (me.input.isKeyPressed('right')) {
				x = 1;
			}

			if(me.input.isKeyPressed('up')) {
				y = -1;
			}
			else if (me.input.isKeyPressed('down')) {
				y = 1;
			}

			if( y != 0 || x != 0) {
				var bullet = me.pool.pull(
					'boneProjectile',
					this.pos.x,
					this.pos.y,
					{
						dir:(new me.Vector2d(x, y)).normalize(),
					}
				);
				me.game.world.addChild(bullet, bullet.pos.z);
			}
		}
	},

	onDeactivateEvent: function() {
		me.event.unsubscribe(this.shootSub);
	},

	update : function (dt) {
		this.shootTimer += dt;

		if (me.input.isKeyPressed('left')) {
			this.body.vel.x -= 3 * me.timer.tick;

		}
		if (me.input.isKeyPressed('right')) {
			this.body.vel.x += 3 * me.timer.tick;
		}

		if(me.input.isKeyPressed('up')) {
			this.body.vel.y -= 3 * me.timer.tick;
		}

		if(me.input.isKeyPressed('down')) {
			this.body.vel.y += 3 * me.timer.tick;
		}

		this.body.update(dt);

		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.PROJECTILE_OBJECT) {
			return false;
		}
		return true;
	}
});
