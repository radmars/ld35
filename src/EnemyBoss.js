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
		this.renderable.addAnimation("shoot_bullet", [7,8,9,10,11], 200);
		this.renderable.addAnimation("shoot_bomb", [7,8,12,13,14,15], 200);
		this.renderable.addAnimation("hit", [16], 200);
		this.renderable.setCurrentAnimation("idle");

		this.hp = 10;
		this.meatChance = 1;

		// Properties of this nefarious creature.
		this.speed = 2;

		this.body.setMaxVelocity(this.speed, this.speed);
		this.detectDistance = 300;
		this.timers = {
			idle: 20,
			wander: 100,
			shoot_bullet: 20,
			shoot_bomb: 20,
		};
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

	getAnimation : function (state) {
		return state;
	},

	behaviorShootBullet : function () {
		this.timeInState = 0;
		this.dir = new me.Vector2d(0, 0);
		this.bulletAngle = -this.bulletSpread / 2;
		this.state = 'shoot_bullet';
		this.renderable.setCurrentAnimation(this.getAnimation(this.state));
	},
	behaviorShootBomb : function () {
		this.timeInState = 0;
		this.dir = new me.Vector2d(0, 0);
		this.state = 'shoot_bomb';
		this.renderable.setCurrentAnimation(this.getAnimation(this.state));
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
				var bomb = this.chanceInN(4);
				if(bomb){
					this.behaviorShootBomb();
				}
				else{
					this.behaviorShootBullet();
				}
			}
			else if(this.timeInState > this.timers.wander) {
				this.behaviorIdle();
			}
			else{
				this.timeInState++;
			}
		}
		else if(this.state === 'shoot_bomb'){
			if(this.timeInState === 0){
				this.shoot(this.angleToPlayer(), {
					type : 'bulletBomber',
					speed : 1
				});
			}

			if(this.timeInState > this.timers.shoot_bomb) {
				this.behaviorIdle();
			}
			else {
				this.timeInState++;
			}
		}
		else if(this.state === 'shoot_bullet'){
			if(this.timeInState === 0){
				this.shoot(this.angleToPlayer(), {
					type : 'bulletBoss',
					speed : 2
				});
			}

			if(this.timeInState > this.timers.shoot_bullet) {
				this.behaviorIdle();
			}
			else {
				this.timeInState++;
			}
		}

		return this._super(Enemy, 'update', [dt]);
	},
});
