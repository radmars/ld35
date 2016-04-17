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
		this.body.setMaxVelocity(2, 2);
		this.body.setFriction(.1, .1);
		this.body.gravity = 0;

		this.renderable.addAnimation("stand",  [0]);
		this.renderable.setCurrentAnimation("stand");

		// Behaviors:
		//  meander  - Player far away.  Slow, random movement.
		//  excited  - Player just entered range.  Doge intensifies.
		//  charging - Full steam ahead, toward the player.
		this.behavior = 'meander';
		this.detectDistance = 100;
		this.speed = {
			meander: 0.1,
			charge: 2,
		};
		this.cooldown = {
			meander: 10,
			excited: 10,
			charge: 10,
		};

		this.randomDirection(this.speed.meander);
	},

	randomDirection : function (magnitude) {
		this.dir = new me.Vector2d(Math.random() - .5, Math.random() - .5);
		this.dir.normalize();
		this.dir.scale(magnitude);
	},

	update : function (dt) {
		/*
		// Handle charger behavior.
		if(this.behavior === 'meander'){
			if(this.distanceTo(PlayerEntity) <= this.detectDistance){
				this.behavior = 'excited';
				this.chargeAngle = this.angleTo(PlayerEntity);
				this.chargeDelay = this.cooldown.excited;
			}
		}
		else if (this.behavior === 'excited'){
			if(this.chargeDelay <= 0){
				this.behavior = 'charging';
				this.dir = this.chargeAngle;
				this.chargeTime = this.cooldown.charge;
			}
			else {
				this.chargeDelay--;
			}
		}
		else if (this.behavior === 'charging'){
			if(this.chargeTime <= 0){
				this.behavior = 'meander';
			}
			else {
				this.chargeTime--;
			}
		}
		*/

		// Apply physics
		this.body.vel.x = this.dir.x * me.timer.tick;
		this.body.vel.y -= this.dir.y * me.timer.tick;

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
