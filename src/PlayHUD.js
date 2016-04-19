"use strict";

var PlayHUD = me.Container.extend({
	init: function() {
		this._super(me.Container, 'init');

		this.isPersistent = true;
		this.floating = true;
		this.pos.z = Infinity;

		this.name = "HUD";
		this.hp = 0;

		this.hpbar = new me.AnimationSheet(124, 50, {
			image: 'healthbar',
			frameheight: 96,
			framewidth: 224,
		});
		for(var i = 0; i < 8; i++) {
			this.hpbar.addAnimation(""+i, [i]);
		}
		this.hpbar.setCurrentAnimation("0");
		this.hpbar.floating = true;
		this.addChild(this.hpbar, this.hpbar.pos.z);


	},

	update: function(dt) {
		var newhp = me.state.current().player.hp;
		if(this.hp != newhp) {
			this.hpbar.setCurrentAnimation(''+newhp);
			this.hp = newhp;
		}
		this.hpbar.update(dt);
	},
});
