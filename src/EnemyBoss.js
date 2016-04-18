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
		this.detectDistance = 500;
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

	wanderDirection : function () {
		// Choose a random, arbitrary direction.
		var direction = new me.Vector2d(this.speed);
		direction.rotate(Math.random() * Math.PI * 2);

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

	clearBehavior : function () {
		this.active = false;
		this.renderable.setCurrentAnimation("idle");
		this.state = 'idle';
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

			this.renderable.setCurrentAnimation("shoot_bullet", this.clearBehavior.bind(this));
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

			this.renderable.setCurrentAnimation("shoot_bomb", this.clearBehavior.bind(this));
		}).bind(this));
	},

	// melonJS built-in handlers
	update : function (dt) {
		if(!this.active){
			if(this.state === 'idle'){
				this.facePlayer();

				if(!this.renderable.isCurrentAnimation("idle")) {
					this.renderable.setCurrentAnimation("idle");
				}

				if(this.timeInState > this.timers.idle) {
					this.behaviorWander();
				}
				else {
					this.timeInState++;
				}
			}
			else if(this.state === 'wander'){
				if(!this.renderable.isCurrentAnimation("run")) {
					this.renderable.setCurrentAnimation("run");
				}

				if(this.playerInRange()){
					var bomb = this.chanceInN(3);
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
