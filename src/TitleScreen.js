'use strict';

var PressEnter = me.ImageLayer.extend({
	init: function(x, y, args) {
		this._super(me.ImageLayer, 'init', [x, y, args]);
		this.flicker = 0;
	},
	draw: function(context) {
		this.flicker++;

		if(this.flicker === 20){
			this.alpha = 0;
		}
		if(this.flicker === 40){
			this.alpha = 1;
			this.flicker = 0;
		}

		this._super(me.ImageLayer, 'draw', [context]);
	},
});

var TitleScreen = me.ScreenObject.extend({
	init: function() {
		this._super(me.ScreenObject, 'init', []);
	},

	onResetEvent: function() {
		this.bg = new me.ImageLayer( 0, 0, {
			image: "title_screen",
			z: 1,
		});
		this.fg = new PressEnter(0, 0, {
			image: "press_enter",
			z: 2,
		});

		me.game.world.addChild( this.bg, this.bg.pos.z);
		me.game.world.addChild( this.fg, this.fg.pos.z);

		me.audio.playTrack("ld35-title", 0.5);

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
	},

	onDestroyEvent: function() {
		me.event.unsubscribe( this.subscription );
		me.audio.stopTrack();
	}
});
