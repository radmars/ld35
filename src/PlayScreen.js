"use strict";

var PlayScreen = me.ScreenObject.extend({
	init: function(game) {
		this._super(me.ScreenObject, 'init', []);
		this.game = game;

		this.musicVolume = 0.7;
		this.fadeTime = 100;

		this.hitForMusic = false;

		this.setNextLevel(globalSettings.level); //"level1"
	},

	setNextLevel: function(name) {
		globalSettings.level = name;
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

		me.audio.play("ld35-main-skel", true, null, this.musicVolume);
		me.audio.play("ld35-main-mess", true, null, 0.0);
		me.audio.play("ld35-main-big_mess", true, null, 0.0);

		this.loadNextLevel();
	},

	loadNextLevel: function() {
		me.levelDirector.loadLevel(this.nextLevel, {
			onLoaded: (function() {
				me.game.world.addChild(new BGColor(this.game));
				me.game.world.addChild(this.hud, this.hud.pos.z);
				me.game.viewport.fadeOut( '#000000', 1000, function() {});
			}).bind(this),
		});

		if (this.nextLevel == "level6") {
			me.audio.stop("ld35-main-skel");
			me.audio.stop("ld35-main-mess");
			me.audio.stop("ld35-main-big_mess");
			me.audio.play("ld35-boss-skel", true, null, this.player.getMode() == "skel" ? this.musicVolume : 0.0);
			me.audio.play("ld35-boss-mess", true, null, this.player.getMode() == "mess" ? this.musicVolume : 0.0);
			me.audio.play("ld35-boss-big_mess", true, null, this.player.getMode() == "big_mess" ? this.musicVolume : 0.0);
		}
	},

	onDestroyEvent: function() {
		me.game.world.removeChild(this.hud);
		me.audio.stop("ld35-main-skel");
		me.audio.stop("ld35-main-mess");
		me.audio.stop("ld35-main-big_mess");
		me.audio.stop("ld35-boss-skel");
		me.audio.stop("ld35-boss-mess");
		me.audio.stop("ld35-boss-big_mess");
	},

	onModeChange: function(oldMode, newMode) {
		var song = "ld35-";
		song += globalSettings.level == "level6" ? "boss" : "main";
		song += "-";
		me.audio.fade(song + oldMode, this.musicVolume * Howler.volume(), 0.0, this.fadeTime);
		me.audio.fade(song + newMode, 0.0, this.musicVolume * Howler.volume(), this.fadeTime);
	},
});
