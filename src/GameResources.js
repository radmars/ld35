"use strict";

var GameResources = (function() {
	/**
	 * @param {String} name file name relative to data/ without extension.
	 */
	function _Image( name ) {
		return { name: name, type: "image", src: "data/" + name + ".png" };
	}

	/**
	 * @param {String} name file name relative to data/audio.
	 */
	function _Audio( name ) {
		return { name: name, type: "audio", src: "data/audio/" , channels: 2 };
	}

	function _AddAudioArray( name, num, parent ) {
		for(var i = 1; i <= num; i++) {
			parent.push(_Audio(name + "-" + i));
		}
	}

	function _GetRandomIndexString(max) {
		var index = Math.floor(Math.random() * max) + 1;
		return "-" + index;
	}

	/**
	 * @param {String} name file name relative to data/ without extension.
	 */
	function _Level( name ) {
		return { name: name, type: "tmx", src: "data/" + name + ".tmx" };
	}

	var GameResources = [
		/* Radmars Logo */
		_Image("intro_bg"),
		_Image("intro_glasses1"),
		_Image("intro_glasses2"),
		_Image("intro_glasses3"),
		_Image("intro_glasses4"),
		_Image("intro_mars"),
		_Image("intro_radmars1"),
		_Image("intro_radmars2"),
		_Image("title_screen"),
		_Image("press_enter"),
		_Image("gameover"),
		_Audio("radmarslogo"),

		/* Less exciting stuff */
		_Image("collision_tiles"),
		_Image("map_tiles"),
		_Image("tiles"),
		_Level("test-level"),
		_Level("level1"),
		_Level("level2"),
		_Level("level3"),
		_Level("level4"),
		_Level("level5"),
		_Level("level6"),

		_Image("player"),
		_Image("blood_explode_128"),
		_Image("blood_impact_64"),
		_Image("splat1"),
		_Image("splat2"),
		_Image("splat3"),
		_Image("splat4"),
		_Image("splat5"),
		_Image("player"),
		_Image("shooter"),
		_Image("pouncer"),
		_Image("bomber"),
		_Image("boss"),
		_Image("bullet_shooter"),
		_Image("bullet_bomber"),
		_Image("bullet_boss"),
		_Image("bone_projectile"),
		_Image("meat_glob"),
		_Image('healthbar'),
		_Image('dog'),
		_Image("box"),
		_Image("flesh_box"),
		_Image("bloody_box"),
		_Image("totem"),
		_Image('rock'),
		_Image('tiles'),
		_Image('player_blood_bullet'),

		_Audio('bomber-shoot'),
		_Audio('bomb-tick'),
		_Audio('boss-death'),
		_Audio('dash'),
		_Audio('death'),
		_Audio('explosion'),
		_Audio('hit'),
		_Audio('pickup'),
		_Audio('player-hit'),
		_Audio('player-melee'),
		_Audio('player-shoot'),
		_Audio('pouncer-dash'),
		_Audio('shooter-shoot'),
		_Audio('splat'),
		_Audio('transform'),
	];

	return GameResources;
})();
