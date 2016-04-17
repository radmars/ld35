"use strict";

var EnemyCharger = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.height = 64;
		settings.width = 64;
		settings.image = "charger";

		this._super(me.Entity, 'init', [x, y, settings]);

		this.alwaysUpdate = true;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(10, 10);
		this.body.setFriction(.1, .1);
		this.body.gravity = 0;
		this.z = 0;

		this.renderable.addAnimation("stand",  [0]);
		this.renderable.setCurrentAnimation("stand");

		// Behaviors:
		//  rest     - Catching breath after moving.
		//  meander  - Player far away.  Slow, random movement.
		//  excited  - Player just entered range.  Doge intensifies.
		//  charging - Full steam ahead, toward the player.
		this.detectDistance = 200;
		this.speed = {
			meander: 1,
			charge: 10,
		};
		this.timers = {
			rest: 20,
			meander: 100,
			excited: 30,
			charge: 60,
		};

		this.playerTarget = me.state.current().player;
		this.rest();
	},

	// Behavioral methods
	rest : function () {
		this.timeInState = 0;
		this.dir = new me.Vector2d(0, 0);
		this.behavior = 'rest';
	},
	meander : function () {
		this.timeInState = 0;
		this.dir = new me.Vector2d(Math.random() - .5, Math.random() - .5);
		this.dir.normalize();
		this.dir.scale(this.speed.meander);
		this.behavior = 'meander';
	},
	excited : function () {
		this.timeInState = 0;
		this.chargeAngle = this.angleTo(this.playerTarget);
		this.dir = new me.Vector2d(0, 0);
		this.behavior = 'excited';
	},
	charge : function () {
		this.timeInState = 0;
		// Unwiggle
		this.anchorPoint = new me.Vector2d(0.5, 0.5);
		this.dir = new me.Vector2d(this.speed.charge, 0);
		this.dir.rotate(this.chargeAngle);
		this.behavior = 'charge';
	},

	// cosmetic behavior
	wiggle : function () {
		var range = 0.15;
		this.anchorPoint = new me.Vector2d(
			Math.random() * range + (0.5 + range / 2),
			Math.random() * range + (0.5 + range / 2)
		);
	},

	// melonJS built-in handlers
	update : function (dt) {
		// Handle charger behavior.
		if(this.behavior === 'rest'){
			if(this.timeInState > this.timers.rest) {
				this.meander();
			}
			else {
				this.timeInState++;
			}
		}
		if(this.behavior === 'meander'){
			if(this.timeInState > this.timers.meander) {
				this.rest();
			}
			else {
				this.timeInState++;
			}
			if(this.distanceTo(this.playerTarget) <= this.detectDistance){
				this.excited();
			}
		}
		else if (this.behavior === 'excited'){
			if(this.timeInState > this.timers.excited) {
				this.charge();
			}
			else {
				this.timeInState++;
				this.wiggle();
			}
		}
		else if (this.behavior === 'charge'){
			if(this.timeInState > this.timers.charge) {
				this.rest();
			}
			else {
				this.timeInState++;
			}
		}

		// Apply physics
		this.body.vel.x = this.dir.x * me.timer.tick;
		this.body.vel.y = this.dir.y * me.timer.tick;

		this.body.update(dt);

		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.ENEMY_OBJECT){
			this.pos.sub(response.overlapV);
			return false;
		}
		if(other.body.collisionType == me.collision.types.PLAYER_OBJECT){
			return false;
		}

		return true;
	}
});
