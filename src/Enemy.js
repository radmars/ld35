"use strict";

var Enemy = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};

		this._super(me.Entity, 'init', [x, y, settings]);

		this.alwaysUpdate = true;
		this.body.setVelocity(0, 0);
		this.body.setFriction(.1, .1);
		this.body.gravity = 0;
		this.pos.z = 5;

		this.renderable.addAnimation("stand", [0]);
		this.renderable.setCurrentAnimation("stand");

		this.behaviorIdle();
	},

	// Behavioral methods
	behaviorIdle : function () {
		this.timeInState = 0;
		this.dir = new me.Vector2d(0, 0);
		this.state = 'idle';
	},
	behaviorWander : function () {
		this.timeInState = 0;
		this.dir = this.wanderDirection(); // wanderDirection Needs to be defined by descendants.
		this.state = 'wander';
	},

	// Cuz I'm probably doing this wrong and will need to change this later.  This way, I only have to do so in a single location!
	getPlayer : function () {
		return me.state.current().player;
	},
	playerInRange : function () {
		return this.distanceTo(this.getPlayer()) <= this.detectDistance;
	},
	angleToPlayer : function () {
		return this.angleTo(this.getPlayer());
	},

	// Lots of random behavior.  Simple wrapper to facilitate this.  Has a 1 in n chance of returning true.
	chanceInN : function (n) {
		var result = Math.floor(Math.random() * n);
		return result === 0;
	},

	update : function (dt) {
		this.body.vel.x = this.dir.x * me.timer.tick;
		this.body.vel.y = this.dir.y * me.timer.tick;

		this.body.update(dt);

		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.ENEMY_OBJECT){
			this.pos.sub(response.overlapV);
			return true;
		}
		if(other.body.collisionType == me.collision.types.PLAYER_OBJECT){
			return false;
		}

		return true;
	}
});
