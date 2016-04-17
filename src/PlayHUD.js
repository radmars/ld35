"use strict";

var PlayHUD = me.Container.extend({
	init: function() {
		this._super(me.Container, 'init');

		this.isPersistent = true;
		this.floating = true;
		this.pos.z = Infinity;

		this.name = "HUD";
		var hpbar = new me.Sprite(195, 90, {
			image: 'healthbar',
		});
		this.addChild(hpbar, hpbar.pos.z);
		this.sort();
	},
});
