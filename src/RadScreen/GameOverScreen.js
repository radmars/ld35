'use strict';

var GameOverScreen = RadScreen.extend({
	init: function() {
		this.image = "gameover";
		this.audio = "ld35-title";
		this.volume = 0.5;

		this._super(RadScreen, 'init', []);
	},
});
