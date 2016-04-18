"use strict";

var EnemyPouncer = Enemy.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.height = 64;
		settings.width = 64;
		settings.framewidth = 64;
		settings.frameheight = 64;
		settings.image = "pouncer";

		this._super(Enemy, 'init', [x, y, settings]);

		this.renderable.addAnimation("idle",  [0, 1, 2], 200);
		this.renderable.addAnimation("run", [0,3,0,4], 100);
		this.renderable.addAnimation("hit", [5], 200);
		this.renderable.setCurrentAnimation("idle");

		// Properties of this nefarious creature.
		this.body.setMaxVelocity(10, 10);
		this.detectDistance = 200;
		this.speed = {
			wander: 1,
			charge: 10,
		};
		this.timers = {
			idle: 20,
			wander: 100,
			excited: 30,
			charge: 60,
		};
		this.meatChance = 4;
	},

	// Behaviors:
	//  idle     - Catching breath after moving.
	//  wander   - Player far away.  Slow, random movement.
	//  excited  - Player just entered range.  Doge intensifies.
	//  charging - Full steam ahead, toward the player.

	// Behavioral methods
	wanderDirection : function () {
		var direction = new me.Vector2d(Math.random() - .5, Math.random() - .5);
		direction.normalize();
		direction.scale(this.speed.wander);

		return direction;
	},
	behaviorExcited : function () {
		this.timeInState = 0;
		this.chargeAngle = this.angleToPlayer();
		this.dir = new me.Vector2d(0, 0);
		this.state = 'excited';
	},
	behaviorCharge : function () {
		this.timeInState = 0;
		// Unwiggle
		this.anchorPoint = new me.Vector2d(0.5, 0.5);
		this.dir = new me.Vector2d(this.speed.charge, 0);
		this.dir.rotate(this.chargeAngle);
		this.state = 'charge';
	},

	// cosmetic behavior
	wiggle : function () {
		// Sprite will be displaced up to this much from center when wiggling.
		var range = 0.1;
		var randomize = function () {
			return Math.random() * 2 * range + (0.5 - range);
		};

		this.anchorPoint = new me.Vector2d(
			randomize(),
			randomize()
		);
	},

	// melonJS built-in handlers
	update : function (dt) {
		// Handle charger behavior.

		if(this.body.vel.length() == 0){
			this.changeAnimation("idle");
		}else{
			this.changeAnimation("run");
		}


		if(this.state === 'idle'){
			if(this.timeInState > this.timers.idle) {
				this.behaviorWander();
			}
			else {
				this.timeInState++;
			}
		}
		if(this.state === 'wander'){
			if(this.timeInState > this.timers.wander) {
				this.behaviorIdle();
			}
			else {
				this.timeInState++;
			}
			if(this.playerInRange()){
				this.behaviorExcited();
			}
		}
		else if (this.state === 'excited'){
			if(this.timeInState > this.timers.excited) {
				this.behaviorCharge();
			}
			else {
				this.timeInState++;
				this.wiggle();
			}
		}
		else if (this.state === 'charge'){
			if(this.timeInState > this.timers.charge) {
				this.behaviorIdle();
			}
			else {
				this.timeInState++;
			}
		}

		return this._super(Enemy, 'update', [dt]);
	},
});
