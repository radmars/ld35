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

		this.flippedX = false;
		this.hp = 1;
		this.meatChance = 0;
		this.screenShakeIntensity = 4;
		this.screenShakeDuration = 500;

		this.renderable.addAnimation("stand", [0]);
		this.renderable.setCurrentAnimation("stand");

		this.behaviorIdle();
	},

	// Is the player above us?
	playerAbove : function() {
		var angle = this.angleTo(this.getPlayer());
		if(angle < 0){
			return true;
		}
		return false;
	},
	// Is the player to the right of us?
	playerRight : function() {
		var angle = this.angleTo(this.getPlayer());
		if(
			angle > -Math.PI / 2
			&& angle < Math.PI / 2
		){

			return true;
		}
		return false;
	},
	// When called, flip the sprite to face the player if appropriate.
	facePlayer : function() {
		if(
			this.flippedX
			&& !this.playerRight()
		){

			this.renderable.flipX(false)
		}
		else if(
			!this.flippedX
			&& this.playerRight()
		){

			this.renderable.flipX(true)
		}
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

	// Depends on having bulletType and bulletSpeed set.
	shoot : function (angle, args) {
		args = args || {};
		var speed = args.speed || this.bulletSpeed;
		var type = args.type || this.bulletType;

		var bullet = me.pool.pull(
			type,
			this.pos.x,
			this.pos.y,
			{
				dir:(new me.Vector2d(speed, 0)).rotate(angle),
			}
		);
		me.game.world.addChild(bullet, bullet.pos.z);
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
		if(n===0){
			// Special case.
			return false;
		}
		var result = Math.floor(Math.random() * n);
		return result === 0;
	},

	update : function (dt) {
		this.body.vel.x = this.dir.x * me.timer.tick;
		this.body.vel.y = this.dir.y * me.timer.tick;

		this.body.update(dt);

		me.collision.check(this);

		if(this.body.vel.x != 0) {
			this.renderable.flipX(this.body.vel.x > 0);
		}

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	changeAnimation: function(dest, next) {
		if(!this.renderable.isCurrentAnimation(dest)) {
			if(next) {
				next = next.bind(this);
			}
			this.renderable.setCurrentAnimation(dest, next);
		}
	},

	damage: function() {
		me.audio.play("hit");

		this.hp--;

		if(this.hp > 0){
			this.changeAnimation("hit");
			me.game.viewport.shake(2,250);


		}else{
			this.die();
		}


	},

	addMeat: function() {
		var meat = me.pool.pull(
			'meatGlob',
			this.pos.x,
			this.pos.y
		);
		me.game.world.addChild(meat, meat.pos.z);
	},

	die: function() {
		me.audio.play("splat");

		me.game.viewport.shake(this.screenShakeIntensity, this.screenShakeDuration);

		if(this.chanceInN(this.meatChance)){
			this.addMeat();
		}

		// We need to disable additional collisions so we don't attempt to remove objects multiple times.
		this.body.setCollisionMask(me.collision.types.NO_OBJECT);
		this.ancestor.removeChild(this);

		var splode = new me.AnimationSheet(this.pos.x, this.pos.y, {
			image: 'blood_explode_128',
			framewidth: 128,
			frameheight: 128,
		});
		splode.pos.z = 3;
		splode.addAnimation('splode', [0, 1, 2, 3, 4, 5], 100);
		splode.addAnimation('splode_over', [5], 100);
		var ancestor = this.ancestor;

		var sprite = new me.Sprite(this.pos.x, this.pos.y, {
			image: "splat" + (Number.prototype.random(0, 3) + 1),
		});
		sprite.pos.z = 3;
		ancestor.addChild(sprite, sprite.pos.z);
		splode.setCurrentAnimation('splode', (function() {
			splode.setCurrentAnimation("splode_over");
			ancestor.removeChild(splode);
		}).bind(this));
		ancestor.addChild(splode, splode.pos.z);
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.ENEMY_OBJECT){
			this.pos.sub(response.overlapV);
			return true;
		}
		if(other.body.collisionType == me.collision.types.PLAYER_OBJECT){
			other.damage();
			return false;
		}

		return true;
	}
});
