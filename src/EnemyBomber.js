"use strict";

var EnemyBomber = Enemy.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.height = 80;
		settings.width = 80;
		settings.image = "bomber";
		settings.frameheight = 80;
		settings.framewidth = 80;

		this._super(Enemy, 'init', [x, y, settings]);

		this.body.setMaxVelocity(1, 1);
		// Properties of this nefarious creature.
		this.speed = 1;
		this.timers = {
			idle: 40,
			wander: 100,
			shoot: 100,
		};

		this.hp = 5;
		this.meatChance = 1;

		this.bulletSpeed = 0.5;
		this.bulletType = 'bulletBomber';

		this.renderable.addAnimation("idle",  [0, 1, 2], 200);
		this.renderable.addAnimation("run", [0,3,0,4], 200);
		this.renderable.addAnimation("shoot" [5], 200);
		this.renderable.addAnimation("hit", [6], 200);
		this.renderable.setCurrentAnimation("idle");
		this.body.setMaxVelocity(this.speed, this.speed);
		this.detectDistance = 500;
	},

	wanderDirection : function () {
		var direction = new me.Vector2d(this.speed, 0);
		direction.rotate(Math.random() * Math.PI * 2);

		return direction;
	},

	behaviorShoot : function () {
		this.timeInState = 0;
		this.dir = new me.Vector2d(0, 0);
		this.state = 'shoot';
	},

	// melonJS built-in handlers
	update : function (dt) {
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
				this.behaviorShoot();
			}
			else if(this.timeInState > this.timers.wander) {
				this.behaviorIdle();
			}
			else{
				this.timeInState++;
			}
		}
		else if(this.state === 'shoot'){
			if(this.timeInState === 0){
				this.shoot(this.angleToPlayer());
			}
			if(this.timeInState > this.timers.shoot) {
				this.behaviorIdle();
			}
			else{
				this.timeInState++;
			}
		}

		return this._super(Enemy, 'update', [dt]);
	},
});
