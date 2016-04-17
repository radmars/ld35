"use strict";

var PlayHUD = me.Container.extend({
	init: function() {
		this._super(me.Container, 'init');

		this.isPersistent = true;
		this.floating = true;
		this.z = 10;

		this.name = "HUD";

		this.addChild(new HPBar());
	},
});

var HPBar = me.Renderable.extend({
	init: function(x, y) {
		this._super(me.Renderable, 'init', [0,0,100,100]);
		this.barImage = new me.Sprite(195, 90, {
			image: 'healthbar',
		});
		this.z = 10;
	},

	update: function(dt) {
		return true;
	},

	draw: function(renderer) {
		this.barImage.draw(renderer);
	}
})
