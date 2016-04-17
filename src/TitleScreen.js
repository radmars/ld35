'use strict';
var TitleScreen = me.ScreenObject.extend({
	init: function() {
		this._super(me.ScreenObject, 'init', []);
	},

	onResetEvent: function() {
		this.bg = new me.ImageLayer( 0, 0, {
			image: "title_screen",
		});

		me.game.world.addChild( this.bg );

		me.audio.stopTrack();
		//me.audio.playTrack( "ld33-title", 0.7 );
		//me.audio.play("micromancer");

		this.subscription = me.event.subscribe( me.event.KEYDOWN, function (action, keyCode, edge) {
			if( keyCode === me.input.KEY.ENTER ) {
				me.state.change( me.state.PLAY );
			}
		});
	},

	onDestroyEvent: function() {
		me.event.unsubscribe( this.subscription );
		me.audio.stopTrack();
	}
});
