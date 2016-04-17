"use strict";

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
	// TODO: me.state.set(me.state.MENU, new TitleScreen());
  me.state.set(me.state.INTRO, new RadmarsScreen(this));
	me.state.set(me.state.PLAY, new PlayScreen(this));

	me.pool.register("mainPlayer", PlayerEntity);
	me.pool.register("shooter", EnemyShooter, true);
	me.pool.register("charger", EnemyCharger, true);
	me.pool.register("enemySpawn", EnemySpawnPoint, true);
	me.pool.register("boneProjectile", BoneProjectile, true);
	me.pool.register("destructable", Destructable, true);

	var keys = {
		left:  [me.input.KEY.LEFT, me.input.KEY.A],
		right: [me.input.KEY.RIGHT, me.input.KEY.D],
		up:    [me.input.KEY.UP, me.input.KEY.W],
		down:  [me.input.KEY.DOWN, me.input.KEY.S],
		shoot: [me.input.KEY.SPACE],
	};

	Object.keys(keys).forEach(function(k) {
		keys[k].forEach(function(code) {
			me.input.bindKey(code, k);
		})
	})

	me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.FACE_1, me.input.KEY.SPACE);
	me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.UP, me.input.KEY.UP);
	me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.DOWN, me.input.KEY.DOWN);
	me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.LEFT, me.input.KEY.LEFT);
	me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.RIGHT, me.input.KEY.RIGHT);

	if (this.options.skipintro) {
		me.state.change(me.state.PLAY);
	}
	else {
		me.state.change(me.state.INTRO);
	}
}
