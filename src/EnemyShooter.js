"use strict";

var EnemyShooter = Enemy.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.height = 128;
		settings.width = 128;
		settings.image = "shooter";

		this._super(Enemy, 'init', [x, y, settings]);

		// Properties of this nefarious creature.
		this.speed = {
			x: 3,
			y: 1,
		};
		this.timers = {
			idle: 40,
			wander: 100,
			shootspread: 50,
			shootburst: 30,
		};
		this.bulletSpread = Math.PI;
		this.bulletSpeed = 1;
		this.bulletType = 'bulletShooter';

		this.body.setMaxVelocity(this.speed.x, this.speed.y);
		this.detectDistance = 300;
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

	behaviorShootSpread : function () {
		this.timeInState = 0;
		this.dir = new me.Vector2d(0, 0);
		this.bulletAngle = -this.bulletSpread / 2;
		this.state = 'shootspread';
	},
	behaviorShootBurst : function () {
		this.timeInState = 0;
		this.dir = new me.Vector2d(0, 0);
		this.state = 'shootburst';
	},

	// melonJS built-in handlers
	update : function (dt) {
		var bulletTime = function(args) {
			if(args.time % Math.floor(args.totalTime / args.count) === 0){
				return true;
			}

			return false;
		};

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
				var spray = this.chanceInN(4);
				if(spray){
					this.behaviorShootSpread();
				}
				else{
					this.behaviorShootBurst();
				}
			}
			else if(this.timeInState > this.timers.wander) {
				this.behaviorIdle();
			}
			else{
				this.timeInState++;
			}
		}
		else if(this.state === 'shootspread'){
			var bulletCount = 5;

			if(bulletTime({
					count : bulletCount,
					time : this.timeInState,
					totalTime: this.timers.shootspread
			})){

				this.shoot(this.angleToPlayer() + this.bulletAngle);
				this.bulletAngle += (this.bulletSpread / bulletCount);
			}

			if(this.timeInState > this.timers.shootspread) {
				this.behaviorIdle();
			}
			else {
				this.timeInState++;
			}
		}
		else if(this.state === 'shootburst'){
			var bulletCount = 3;

			if(bulletTime({
					count : bulletCount,
					time : this.timeInState,
					totalTime: this.timers.shootburst
			})){

				this.shoot(this.angleToPlayer());
			}

			if(this.timeInState > this.timers.shootburst) {
				this.behaviorIdle();
			}
			else {
				this.timeInState++;
			}
		}

		return this._super(Enemy, 'update', [dt]);
	},
});
