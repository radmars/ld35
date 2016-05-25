"use strict";

var LevelChanger = me.LevelEntity.extend({
	init: function(x, y, settings) {
		settings.fade = "#000";
		settings.duration = 500;
		settings.onLoaded = this.levelChanged.bind(this);
		this.level = settings.to;
		this._super(me.LevelEntity, 'init', [x, y, settings]);
		this.body.gravity = 0;
		// Not sure what ACTION_OBJECT is meant for, so here it means "regions on maps that trigger behavior when the player runs over them without impeding movement."
		this.body.collisionType = me.collision.types.ACTION_OBJECT;
		this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
	},

	levelChanged: function() {
		me.state.current().player.hp = this.hp;
		me.state.current().player.changeAnimation("idle");
	},

	update: function(dt) {
		this.body.update(dt);
		me.collision.check(this);
	},

	onCollision: function(response, other) {
		if(other == me.state.current().player) {
			this.hp = me.state.current().player.hp;
			game.data.level = this.level;

			if (
				this.level === "level6"
				&& !me.state.current().hitForMusic
			) {

				me.state.current().player.getModes().forEach(function(mode) {
					me.audio.stop("ld35-main-" + mode);
					me.audio.play(
						"ld35-boss-" + mode,
						true,
						null,
						me.state.current().player.getMode() === mode
							? me.state.current().musicVolume
							: 0.0
					);
				}.bind(this));

				me.state.current().hitForMusic = true;
			}

			this.goTo();
		}
		return false;
	},
})
