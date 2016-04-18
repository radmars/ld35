"use strict";

var EnemyBoss = Enemy.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.height = 170;
		settings.width = 260;
		settings.frameheight = 256;
		settings.framewidth = 300;
		settings.image = "boss";

		this._super(Enemy, 'init', [x, y, settings]);

		this.renderable.addAnimation("idle",  [0, 1, 2], 200);
		this.renderable.addAnimation("run", [3,4,5,6], 200);
		this.renderable.addAnimation("wind_up", [7,8], 200);
		this.renderable.addAnimation("shoot_bullet", [9,10,11], 200);
		this.renderable.addAnimation("shoot_bomb", [12,13,14,15], 200);
		this.renderable.addAnimation("hit", [16], 200);
		this.renderable.setCurrentAnimation("idle");

		// Properties of this nefarious creature.
		this.speed = 2;
		this.hp = 10;
		this.meatChance = 1;

		this.body.setMaxVelocity(this.speed, this.speed);
		this.detectDistance = 300;
		this.timers = {
			idle: 20,
			wander: 100,
			shoot_bullet: 20,
			shoot_bomb: 20,
		};

		this.active = false;
	},

	// Sometimes produces meat when damaged.
	dropMeat : function () {
	},

	// Is the player above us?
	playerAbove : function() {
		var angle = this.angleTo(this.getPlayer());
		if(angle < 0){
			return true;
		}
		return false;
	},

	// Move mostly left and right, so reduced magnitude up and down.  Favor moving toward the player on the vertical axis, but do not do so all the time.
	wanderDirection : function () {
		// Left or right?
		var right = this.chanceInN(2);

		// Up or down?
		var away = this.chanceInN(4);
		var up = this.playerAbove() != away;

		// Oh boy, vector time!
		var direction = new me.Vector2d(this.speed.x, -this.speed.y); // Initially up and to the right
		direction.scale(
			right ? 1 : -1,
			up ? 1 : -1
		);

		return direction;
	},

	makeShots : function (args) {
		var angleDiff = args.spread / args.count;
		var angle = this.angleToPlayer() - args.spread / 2;

		for(var i = 0; i < args.count; i++) {
			this.shoot(angle, {
				type : args.type,
				speed : args.speed,
			});

			angle += angleDiff;
		}
	},

	shootBullet : function () {
		this.active = true;
		this.dir = new me.Vector2d(0, 0);

		this.renderable.setCurrentAnimation("wind_up", (function() {
			this.makeShots({
				count : 5,
				type : 'bulletBoss',
				speed : 1,
				spread : Math.PI * 3/4,
			});

			this.renderable.setCurrentAnimation("shoot_bullet", (function() {
				this.active = false;
				this.renderable.setCurrentAnimation("idle");
			}).bind(this));
		}).bind(this));
	},
	shootBomb : function () {
		this.active = true;
		this.dir = new me.Vector2d(0, 0);

		this.renderable.setCurrentAnimation("wind_up", (function() {
			this.makeShots({
				count : 3,
				type : 'bulletBomber',
				speed : 1,
				spread : Math.PI * 3/4,
			});

			this.renderable.setCurrentAnimation("shoot_bomb", (function() {
				this.active = false;
				this.renderable.setCurrentAnimation("idle");
			}).bind(this));
		}).bind(this));
	},

	// melonJS built-in handlers
	update : function (dt) {
		if(!this.active){
			if(this.state === 'idle'){
				if(this.timeInState > this.timers.idle) {
					this.behaviorWander();
				}
				else {
					this.timeInState++;
				}
			}
			else if(this.state === 'wander'){
				if(this.playerInRange()){
					var bomb = this.chanceInN(4);
					if(bomb){
						this.shootBomb();
					}
					else{
						this.shootBullet();
					}
				}
				else if(this.timeInState > this.timers.wander) {
					this.behaviorIdle();
				}
				else{
					this.timeInState++;
				}
			}
		}

		return this._super(Enemy, 'update', [dt]);
	},
});
