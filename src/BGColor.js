"use strict";

var BGColor = me.Renderable.extend({
	init: function(settings) {
		this.settings = settings;
		this._super(me.Renderable, 'init', [0, 0, this.settings.screenWidth, this.settings.screenHeight]);
		this.pos.z = -10;
	},
	draw: function(context) {
		context.setColor('#000');
		context.fillRect(0, 0, this.settings.screenWidth, this.settings.screenHeight);
	},
});
