"use strict";

var globalSettings = {level:"level1"};

function LD35() {
	this.screenHeight = 640;
	this.screenWidth = 960;
	this.options = {};
}

LD35.prototype.onload = function() {
	// Load URL parameters

	window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		this.options[key] = value;
	}.bind(this));

	// Initialize the video.
	if (!me.video.init(this.screenWidth, this.screenHeight, {
		wrapper: "screen",
		scale: 1.0,
	})) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "?nodie=1" to have an easier time
	// add "?skipintro=1" to skip the radmars animation
	// add "?debug=1" to the URL to enable the debug Panel
	if (this.options.debug) {
		window.onReady(function () {
			me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
		});
	}

  me.audio.init("m4a,ogg");
	me.loader.onload = this.loaded.bind(this);
	me.loader.preload(GameResources);
	me.state.change(me.state.LOADING);
}

LD35.prototype.loaded = function() {
	this.playState = new PlayScreen(this);
	me.state.set(me.state.INTRO, new RadmarsScreen(this));
	me.state.set(me.state.MENU, new TitleScreen(this));
	me.state.set(me.state.GAMEOVER, new GameOverScreen(this));
	me.state.set(me.state.PLAY, this.playState);

	var volume = 0.5;

	if(this.options.level) {
		this.playState.setNextLevel(this.options.level);
	}
	if(this.options.nodie) {
		this.playState.nodie = true;
	}
	if(this.options.mute) {
		volume = 0.0;
	}
	me.audio.setVolume(volume);

	me.pool.register("mainPlayer", PlayerEntity);
	me.pool.register("shooter", EnemyShooter, true);
	me.pool.register("pouncer", EnemyPouncer, true);
	me.pool.register("bomber", EnemyBomber, true);
	me.pool.register("boss", EnemyBoss, true);
	me.pool.register("meatGlob", MeatGlob, true);
	me.pool.register("enemySpawn", EnemySpawnPoint, true);
	me.pool.register("boneProjectile", BoneProjectile, true);
	me.pool.register("playerBloodProjectile", PlayerBloodProjectile, true);
	me.pool.register("bulletBomber", BulletBomber, true);
	me.pool.register("bulletShooter", BulletShooter, true);
	me.pool.register("bulletBoss", BulletBoss, true);
	me.pool.register("destructable", Destructable, true);
	me.pool.register("levelChanger", LevelChanger, true);
	me.pool.register("dog", Dog, true);

	if (this.options.skipintro) {
		me.state.change(me.state.PLAY);
	}
	else {
		me.state.change(me.state.INTRO);
	}
}

var LevelChanger = me.LevelEntity.extend({
	init: function(x, y, settings) {
		settings.fade = "#000";
		settings.duration = 500;
		settings.onLoaded = this.levelChanged.bind(this);
		this.level = settings.to;
		this._super(me.LevelEntity, 'init', [x, y, settings]);
		this.body.gravity = 0;
	},

	levelChanged: function() {
		me.state.current().player.hp = this.hp;
	},

	update: function(dt) {
		this.body.update(dt);
		me.collision.check(this);
	},

	onCollision: function(response, other) {
		if(other == me.state.current().player) {
			this.hp = me.state.current().player.hp;
			globalSettings.level = this.level;
			console.log("levelchanger level!" + this.level);

			if (globalSettings.level == "level6") {
				me.audio.stop("ld35-main-skel");
				me.audio.stop("ld35-main-mess");
				me.audio.stop("ld35-main-big_mess");
				me.audio.play("ld35-boss-skel", true, null, me.state.current().player.getMode() == "skel" ? me.state.current().musicVolume : 0.0);
				me.audio.play("ld35-boss-mess", true, null, me.state.current().player.getMode() == "mess" ? me.state.current().musicVolume : 0.0);
				me.audio.play("ld35-boss-big_mess", true, null, me.state.current().player.getMode() == "big_mess" ? me.state.current().musicVolume : 0.0);
			}

			this.goTo();
		}
		return false;
	},
})
