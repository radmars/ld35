"use strict";

var PlayerEntity = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.image = "player";

		this._super(me.Entity, 'init', [x, y, settings]);

		this.body.setVelocity(3, 15);

		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.alwaysUpdate = true;

		this.renderable.addAnimation("stand",  [0]);
		this.renderable.setCurrentAnimation("stand");
	},

	update : function (dt) {
		if (me.input.isKeyPressed('left')) {
			this.body.vel.x -= this.body.accel.x * me.timer.tick;

		}
		else if (me.input.isKeyPressed('right')) {
			this.body.vel.x += this.body.accel.x * me.timer.tick;
		}
		else {
			this.body.vel.x = 0;
		}

		this.body.update(dt);
		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	onCollision : function (response, other) {
		return true;
	}
});
