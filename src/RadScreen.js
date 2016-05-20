'use strict';

var RadScreen = me.ScreenObject.extend({
	init: function() {
		this._super(me.ScreenObject, 'init', []);
	},

	onResetEvent: function() {
		if (this.image) {
			this.bg = new me.ImageLayer( 0, 0, {
				image: this.image,
			});

			me.game.world.addChild( this.bg, this.bg.pos.z);
		}
		if (this.audio) {
			var volume = this.volume || 1;
			me.audio.playTrack(this.audio, this.volum);
		}

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
			if( keyCode === me.input.KEY.ENTER ) {
				me.state.change( me.state.PLAY );
			}
		});
		me.game.viewport.fadeOut( '#000000', 1000, function() {});
	},

	onDestroyEvent: function() {
		me.event.unsubscribe( this.subscription );
		me.audio.stopTrack();
	}
});
