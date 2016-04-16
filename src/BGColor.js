"use strict";

var BGColor = me.Renderable.extend({
	init: function(game) {
		this.game = game;
		this._super(me.Renderable, 'init', [0, 0, this.game.screenWidth, this.game.screenHeight]);
		this.z = -10;
	},
	draw: function(context) {
		context.setColor('#000');
		context.fillRect(0, 0, this.game.screenWidth, this.game.screenHeight);
	},
});
