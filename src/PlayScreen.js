"use strict";

var PlayScreen = me.ScreenObject.extend({
	init: function(settings) {
		this._super(me.ScreenObject, 'init', []);
		this.settings = settings;

		this.musicVolume = 0.7;
		this.fadeTime = 100;

		this.hitForMusic = false;
		this.modes = ['skel', 'mess', 'big_mess'];

		this.setNextLevel(settings.level); //"level1"
	},

	setNextLevel: function(name) {
		this.settings.level = name;
		this.nextLevel = name;
	},

	onResetEvent: function() {
		this.hud = new PlayHUD();
		me.game.world.autoSort = true;
		me.game.world.autoDepth = false;

		this.hitForMusic = false;

		var keys = {
			left:  [me.input.KEY.LEFT, me.input.KEY.A],
			right: [me.input.KEY.RIGHT, me.input.KEY.D],
			up:    [me.input.KEY.UP, me.input.KEY.W],
			down:  [me.input.KEY.DOWN, me.input.KEY.S],

			shoot: [me.input.KEY.SPACE, me.input.KEY.J],
			dash:  [me.input.KEY.K, me.input.KEY.SHIFT],
			OK:    [me.input.KEY.ENTER],
		};

		Object.keys(keys).forEach(function(k) {
			keys[k].forEach(function(code) {
				me.input.bindKey(code, k);
			})
		})

		if(me.input.GAMEPAD) {
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.FACE_2, keys.dash[0]);
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.FACE_1, keys.shoot[0]);
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.UP, keys.up[0]);
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.DOWN, keys.down[0]);
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.LEFT, keys.left[0]);
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.RIGHT, keys.right[0]);
		}

		// Blast dem hip tunez
		//
		// This conditional logic only actually matters if you use the level-skip get string to skip straight to the boss level.
		var stage = (this.nextLevel === "level6")
			? 'boss'
			: 'main'
		;

		this.modes.forEach(function(mode) {
			me.audio.play(
				"ld35-" + stage + "-" + mode,
				true,
				null,
				// Can only start in skelly mode
				mode === 'skel'
					? this.musicVolume
					: 0.0
			);
		}.bind(this));

		this.loadNextLevel();
	},

	loadNextLevel: function() {
		me.levelDirector.loadLevel(this.nextLevel, {
			onLoaded: (function() {
				me.game.world.addChild(new BGColor(this.settings));
				me.game.world.addChild(this.hud, this.hud.pos.z);
				me.game.viewport.fadeOut('#000000');
			}).bind(this),
		});
	},

	onDestroyEvent: function() {
		me.game.world.removeChild(this.hud);
		['main', 'boss'].forEach(function(stage) {
			this.modes.forEach(function(mode) {
				me.audio.stop("ld35-" + stage + "-" + mode);
			}.bind(this));
		}.bind(this));
	},

	onModeChange: function(oldMode, newMode) {
		var song = "ld35-";
		// Go go globals!
		song += game.data.level === "level6" ? "boss" : "main";
		song += "-";
		me.audio.fade(song + oldMode, this.musicVolume * Howler.volume(), 0.0, this.fadeTime);
		me.audio.fade(song + newMode, 0.0, this.musicVolume * Howler.volume(), this.fadeTime);
	},
});
