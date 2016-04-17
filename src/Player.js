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
		this.dashSub = me.event.subscribe(me.event.KEYDOWN, this.tryToDash.bind(this));
		this.shootTimer = 0;
		this.dashing = false;
		this.globs = 0;
	},

	getMode: function() {
		if(this.globs < 5) {
			return 'skeleton';
		}
		else if (this.globs < 10) {
			return 'mess';
		}
		else {
			return 'behemoth';
		}
	},

	addMeat: function() {
		var mode = this.getMode();
		this.globs++;
		var newMode = this.getMode();
		if(mode != newMode){
			console.log("LEVELED UP BRO????");
		}
	},

	getControlDirection: function() {
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
		return new me.Vector2d(x, y);
	},

	tryToDash: function(action, keycode, edge) {
		if (action === "dash" && this.shootTimer > 1000) {
			this.dashing = true;
			var dir = this.getControlDirection();
			this.body.setMaxVelocity(10, 10);
			this.body.vel.x = dir.x * 10;
			this.body.vel.y = dir.y * 10;
			this.dashTimer = 0;
		}
	},

	finishDash: function() {
		this.body.setMaxVelocity(3, 3);
		this.dashing = false;
	},

	tryToShoot: function(action, keyCode, edge) {
		if(this.dashing) {
			return;
		}

		// TODO: shoot timersssss!
		if (action === "shoot" && this.shootTimer > 500) {
			this.shootTimer = 0;
			var dir = this.getControlDirection();

			if( dir.y != 0 || dir.x != 0) {
				var bullet = me.pool.pull(
					'boneProjectile',
					this.pos.x,
					this.pos.y,
					{
						dir: dir.normalize(),
					}
				);
				me.game.world.addChild(bullet, bullet.pos.z);
			}
		}
	},

	onDeactivateEvent: function() {
		me.event.unsubscribe(this.shootSub);
		me.event.unsubscribe(this.dashSub);
	},

	update : function (dt) {
		this.shootTimer += dt;
		this.dashTimer += dt;

		if(this.dashing) {
			if(this.dashTimer > 500) {
				this.finishDash();
			}
		}

		// Could stop dashing in finishDash()...
		if(!this.dashing) {
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
		}

		this.body.update(dt);

		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.PROJECTILE_OBJECT) {
			return false;
		}

		if(other.body.collisionType == me.collision.types.COLLECTABLE_OBJECT) {
			other.collect(this);
			return false;
		}

		return true;
	}
});
