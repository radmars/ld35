'use strict';

var GameOverScreen = me.ScreenObject.extend({
	init: function() {
		this._super(me.ScreenObject, 'init', []);
	},

	onResetEvent: function() {
		this.bg = new me.ImageLayer( 0, 0, {
			image: "gameover",
		});

		me.game.world.addChild( this.bg, this.bg.pos.z);

		me.audio.stopTrack();
		//me.audio.playTrack( "ld33-title", 0.7 );
		//me.audio.play("micromancer");

		var keys = {
			OK:    [me.input.KEY.ENTER],
		};

		Object.keys(keys).forEach(function(k) {
			keys[k].forEach(function(code) {
				me.input.bindKey(code, k);
			})
		})

		if(me.input.GAMEPAD) {
			// A to go through menus...
			me.input.bindGamepad(0, me.input.GAMEPAD.BUTTONS.FACE_1, me.input.KEY.ENTER);
		}

		this.subscription = me.event.subscribe( me.event.KEYDOWN, function (action, keyCode, edge) {
			if( keyCode === me.input.KEY.SPACE ) {
				me.state.change( me.state.PLAY );
			}
			if( keyCode === me.input.KEY.ENTER ) {
				me.state.change( me.state.MENU);
			}
		});
		me.game.viewport.fadeOut( '#000000', 1000, function() {});
	},

	onDestroyEvent: function() {
		me.event.unsubscribe( this.subscription );
		me.audio.stopTrack();
	}
});
