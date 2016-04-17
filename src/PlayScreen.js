"use strict";

var PlayScreen = me.ScreenObject.extend({
	init: function(game) {
		this._super(me.ScreenObject, 'init', []);
		this.game = game;
	},

	onResetEvent: function() {
		me.game.world.addChild(new BGColor(this.game));

		me.levelDirector.loadLevel("test-level", {
			onLoaded: (function() {
				console.log("loaded level");
				me.game.viewport.fadeOut( '#000000', 1000, function() {});
			}).bind(this),
		});
	},

	onDestroyEvent: function() {
	}
});
