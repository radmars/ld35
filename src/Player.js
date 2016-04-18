"use strict";

var PlayerEntity = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.image = "player";
		settings.width = 64;
		settings.height = 64;
		settings.frameheight = 128;
		settings.framewidth = 128;
		settings.shapes = [ new me.Rect(0, 0, 64, 64) ]

		this._super(me.Entity, 'init', [x, y, settings]);
		this.pos.z = 5;

		this.renderable.anchorPoint.y = .75
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		me.state.current().player = this;

		this.takingDamage = false;
		console.log("Activate!");
		this.hp = 1;

		this.alwaysUpdate = true;
		this.body.collisionType = me.collision.types.PLAYER_OBJECT;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(3, 3);
		this.body.setFriction(.1, .1);
		this.body.gravity = 0;

		this.animationMap = {
			idle: 'idle_up',
			run: 'run_up',
			shoot: 'shoot_up',
		};
		this.facingUp = false;

		this.renderable.addAnimation("idle",         [0, 1, 2], 200);
		this.renderable.addAnimation("idle_up",      [48, 49, 50], 200);
		this.renderable.addAnimation("dash",         [3, 4], 100); // TODO Need "end of dash" support
		this.renderable.addAnimation("dash_finish",  [5, 6, 7, 8, 9], 100); // TODO Need "end of dash" support
		this.renderable.addAnimation("shoot",        [10, 11, 12, 13, 12], 200);
		this.renderable.addAnimation("shoot_up",     [44, 45, 46, 47, 46], 200);
		this.renderable.addAnimation("run",          [14, 15, 16, 17 ], 200);
		this.renderable.addAnimation("run_up",       [51, 52, 53, 54 ], 200);
		this.renderable.addAnimation("die",          [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43], 100);
		this.renderable.addAnimation("dead",         [43], 100);

		this.changeAnimation("idle");

		this.shootSub = me.event.subscribe(me.event.KEYDOWN, this.tryToShoot.bind(this));
		this.dashSub = me.event.subscribe(me.event.KEYDOWN, this.tryToDash.bind(this));
		this.shootTimer = 0;
		this.dashing = false;
	},

	getAnimationName: function(name) {
		if(this.facingUp) {
			return this.animationMap[name] || name;
		}
		return name;
	},

	getMode: function() {
		if(this.hp < 2) {
			return 'skeleton';
		}
		else if (this.hp < 6) {
			return 'mess';
		}
		else {
			return 'behemoth';
		}
	},

	addMeat: function() {
		var mode = this.getMode();
		this.hp++;
		if(this.hp > 7) {
			this.hp = 7;
		}
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
		if (action === "dash" && !this.dashing) {
			var dashAnimCount = 3;
			this.dashing = true;
			var dir = this.getControlDirection();
			if( dir.y != 0 || dir.x != 0) {
				this.body.setMaxVelocity(10, 10);
				this.body.vel.x = dir.x * 10;
				this.body.vel.y = dir.y * 10;
				var cb = function() {
					if(dashAnimCount > 0) {
						dashAnimCount--;
						this.changeAnimation("dash", cb)
					}
					else {
						this.body.setMaxVelocity(3, 3);
						this.changeAnimation("dash_finish", function() {
							this.dashing = false;
							this.changeAnimation("idle");
						})
					}
				};
				this.changeAnimation("dash", cb);
			}
		}
	},

	tryToShoot: function(action, keyCode, edge) {
		if(this.dashing || this.takingDamage) {
			return;
		}

		// TODO: shoot timersssss!
		if (action === "shoot" && this.shootTimer > 500) {
			this.shootTimer = 0;
			var dir = this.getControlDirection();

			if( dir.y != 0 || dir.x != 0) {
				this.changeAnimation("shoot", function(){
					this.changeAnimation("idle");
				})
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

	changeAnimation: function(dest, next) {
		if(!this.renderable.isCurrentAnimation(this.getAnimationName(dest))) {
			if(next) {
				next = next.bind(this);
			}
			this.renderable.setCurrentAnimation(this.getAnimationName(dest), next);
		}
	},

	onDeactivateEvent: function() {
		me.event.unsubscribe(this.shootSub);
		me.event.unsubscribe(this.dashSub);
	},

	update : function (dt) {
		this.shootTimer += dt;

		if(!this.dashing && !this.takingDamage) {
			var run = false;
			if (me.input.isKeyPressed('left')) {
				this.body.vel.x -= 3 * me.timer.tick;
				run = true;
			}
			if (me.input.isKeyPressed('right')) {
				this.body.vel.x += 3 * me.timer.tick;
				run = true;
			}

			if(me.input.isKeyPressed('up')) {
				this.body.vel.y -= 3 * me.timer.tick;
				run = true;
			}

			if(me.input.isKeyPressed('down')) {
				this.body.vel.y += 3 * me.timer.tick;
				run = true;
			}
			if(run){
				if(this.body.vel.x != 0) {
					this.renderable.flipX(this.body.vel.x < 0);
				}

				if(this.body.vel.y != 0) {
					this.facingUp = this.body.vel.y < 0;
				}
				this.changeAnimation("run", function() {
					this.changeAnimation("idle");
				})
			}
		}

		if(this.body.vel.x != 0) {
			this.renderable.flipX(this.body.vel.x < 0);
		}

		if(this.body.vel.y != 0) {
			this.facingUp = this.body.vel.y < 0;
		}

		this.body.update(dt);

		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	damage: function(dir) {
		if(!this.takingDamage) {
			this.takingDamage = true;
			this.hp--;
			console.log(this.hp);
			if(this.hp <= 0) {
				this.changeAnimation("die", function() {
					this.changeAnimation("dead");
					me.timer.setTimeout(function(){
						me.state.change( me.state.GAMEOVER);
					}, 3000);
				})
			}
			else {
				this.renderable.flicker(500, (function () {
					this.takingDamage = false;
				}).bind(this));
			}
		}
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.PROJECTILE_OBJECT) {
			return false;
		}

		if(other.body.collisionType == me.collision.types.COLLECTABLE_OBJECT) {
			other.collect(this);
			return false;
		}

		if(other.body.collisionType == me.collision.types.ACTION_OBJECT) {
			return false;
		}

		return true;
	}
});
