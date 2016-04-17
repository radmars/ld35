"use strict";

var EnemySpawnPoint = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		if(!settings.type) {
			throw "Need to set what type of enemy to spawn with the 'type' propery!";
		}

		this.enemyType = settings.type;
		this.spawnTime = settings.rate;
		this.lastSpawn = 0;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.alwaysUpdate = true;

		this.body.collisionType = me.collision.types.NO_OBJECT
		this.body.setVelocity(0, 0);
		this.body.gravity = 0;
	},

	update : function (dt) {
		this.lastSpawn = this.lastSpawn + dt;
		if(this.lastSpawn > this.spawnTime) {
			var enemy = me.pool.pull(this.enemyType, this.pos.x, this.pos.y);
			me.game.world.addChild(enemy);
			this.lastSpawn = 0;
		}

		this.body.update(dt);

		return false;
	},
});
