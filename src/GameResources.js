"use strict";

var GameResources = (function() {
	/**
	 * @param {String} name file name relative to data/ without extension.
	 */
	function _Image( name ) {
		return { name: name, type: "image", src: "data/image/" + name + ".png" };
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
		_Audio("radmarslogo"),

    /* Less exciting stuff */
		_Image("collision_tiles"),
		_Image("map_tiles"),
		_Level("test-level"),
	];

	return GameResources;
})();
