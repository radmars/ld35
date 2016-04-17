"use strict";

var PlayScreen = me.ScreenObject.extend({
	init: function(game) {
		this._super(me.ScreenObject, 'init', []);
		this.game = game;
	},

	onResetEvent: function() {
		this.hud = new PlayHUD();
		me.game.world.autoSort = true;
		me.game.world.autoDepth = false;

		me.levelDirector.loadLevel("test-level", {
			onLoaded: (function() {
				me.game.world.addChild(this.hud, this.hud.pos.z);
				me.game.viewport.fadeOut( '#000000', 1000, function() {});
			}).bind(this),
		});
	},

	onDestroyEvent: function() {
		me.game.world.removeChild(this.HUD);
	}
});
