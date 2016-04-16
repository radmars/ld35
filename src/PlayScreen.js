"use strict";

var PlayScreen = me.ScreenObject.extend({
	init: function(game) {
		this._super(me.ScreenObject, 'init', []);
		this.game = game;
	},

	onResetEvent: function() {
		me.levelDirector.loadLevel("test-level");
	},

	onDestroyEvent: function() {
	}
});
