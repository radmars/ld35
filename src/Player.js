"use strict";

var PlayerEntity = me.Entity.extend({
	init : function (x, y, settings) {
		settings = settings || {};
		settings.image = "player";
		settings.width = 64;
		settings.height = 64;
		settings.frameheight = 128;
		settings.framewidth = 128;
		settings.shapes = [ new me.Rect(0, 0, 64, 64) ]

		this._super(me.Entity, 'init', [x, y, settings]);
		this.pos.z = 6;
		this.shootDelay = 0;

		this.renderable.anchorPoint.y = .75
		//me.game.viewport.setBounds(0,0,960,640);
		me.game.viewport.setDeadzone(100,50);

		this.cameraTargetOffsetY = -100;
		this.cameraTargetPos = new me.Vector2d(this.pos.x, this.pos.y - this.cameraTargetOffsetY);

		me.game.viewport.follow(this.cameraTargetPos, me.game.viewport.AXIS.BOTH);
		me.state.current().player = this;

		this.takingDamage = false;
		this.hp = 1;

		this.aoeTriggered = false;

		this.alwaysUpdate = true;
		this.body.collisionType = me.collision.types.PLAYER_OBJECT;
		this.body.setVelocity(0, 0);
		this.body.setMaxVelocity(3, 3);
		this.body.setFriction(1, 1);
		this.body.gravity = 0;

		this.fireDirection = new me.Vector2d(0,0);

		this.facingUp = false;
		this.animationMap = {
			idle: 'idle_up',
			run: 'run_up',
			shoot: 'shoot_up',
		};
		// For overrides required in particular forms.  Mess doesn't have a dedicated dash animation, for instance.
		this.modeMap = {
			mess_dash: 'mess_dash_up',
			mess_dash_finish: 'mess_dash_finish_up',
		};

		this.modeMap = {
			big_mess_dash: 'big_mess_dash_up',
			big_mess_dash_finish: 'big_mess_dash_finish_up',
		};

		this.highestY = this.pos.y;
		this.yBuffer = 200;

		var dashRecovery = 250;

		this.renderable.addAnimation("skel_idle",         [0, 1, 2], 200);
		this.renderable.addAnimation("skel_idle_up",      [48, 49, 50], 200);
		this.renderable.addAnimation("skel_dash",         [3, 4], 100); // TODO Need "end of dash" support
		this.renderable.addAnimation("skel_dash_finish",  [5, 6, 7, 8, 9], dashRecovery / 5); // TODO Need "end of dash" support
		this.renderable.addAnimation("skel_shoot",        [10, 11, 12, 13, 12], 200);
		this.renderable.addAnimation("skel_shoot_up",     [44, 45, 46, 47, 46], 200);
		this.renderable.addAnimation("skel_run",          [14, 15, 16, 17 ], 200);
		this.renderable.addAnimation("skel_run_up",       [51, 52, 53, 54 ], 200);
		this.renderable.addAnimation("skel_die",          [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43], 100);
		this.renderable.addAnimation("skel_dead",         [43], 100);
		this.renderable.addAnimation("mess_idle",         [55, 56, 57], 200);
		this.renderable.addAnimation("mess_run",          [58, 59, 60, 61], 200);
		this.renderable.addAnimation("mess_shoot",        [62, 63, 64, 65], 200);
		this.renderable.addAnimation("mess_idle_up",    [66, 67, 68], 200);
		this.renderable.addAnimation("mess_run_up",     [69, 70, 71, 72], 200);
		this.renderable.addAnimation("mess_shoot_up",   [73, 74, 75, 76], 200);
		// Just stealing the skelly dash animation for the short term to resolve bug.
		this.renderable.addAnimation("mess_dash",         [58, 58], 100);
		this.renderable.addAnimation("mess_dash_up",         [69, 69], 100);
		this.renderable.addAnimation("mess_dash_finish",  [61, 61], dashRecovery / 2);
		this.renderable.addAnimation("mess_dash_finish_up",  [72, 72], dashRecovery / 2);


		this.renderable.addAnimation("big_mess_idle",         [77, 78, 79], 200);
		this.renderable.addAnimation("big_mess_run",          [80, 81, 82, 83, 84, 85], 100);
		this.renderable.addAnimation("big_mess_shoot",        [86, 87, 88, 89, 90, 91, 92, 93, 94, 95], 100);
		this.renderable.addAnimation("big_mess_idle_up",    [96, 97, 98], 200);
		this.renderable.addAnimation("big_mess_run_up",     [99,100,101,102,103,104], 100);
		this.renderable.addAnimation("big_mess_shoot_up",   [86, 87, 88, 89, 90, 91, 92, 93, 94, 95], 100);
		// Just stealing the skelly dash animation for the short term to resolve bug.
		this.renderable.addAnimation("big_mess_dash",         [80, 81, 82], 100);
		this.renderable.addAnimation("big_mess_dash_up",         [99,100,101], 100);
		this.renderable.addAnimation("big_mess_dash_finish",  [84, 85], dashRecovery / 2);
		this.renderable.addAnimation("big_mess_dash_finish_up",  [102,103], dashRecovery / 2);

		this.changeAnimation("idle");

		this.shootSub = me.event.subscribe(me.event.KEYDOWN, this.tryToShoot.bind(this));
		this.dashSub = me.event.subscribe(me.event.KEYDOWN, this.tryToDash.bind(this));
		this.dashing = false;
	},

	getAnimationName: function(name) {
		var n = name;
		if(this.facingUp) {
			n = this.animationMap[n] || n;
		}
		n = this.getMode() + "_" + n;

		// Copy pasta
		if(this.facingUp) {
			n = this.modeMap[n] || n;
		}

		return n;
	},

	getMode: function() {
		if(this.hp < 2) {
			return 'skel';
		}
		// TODO FIX THIS MAGIC NUMBER TO BE A BETTER ONE
		else if (this.hp < 5) {
			return 'mess';
		}
		else {
			return 'big_mess';
		}
	},

	addMeat: function() {
		me.audio.play("pickup");

		var mode = this.getMode();
		this.hp++;
		if(this.hp > 7) {
			this.hp = 7;
		}
		var newMode = this.getMode();
		if(mode != newMode){
			me.audio.play("transform");

			me.game.viewport.shake(5,300);
			var splode = new me.AnimationSheet(this.pos.x + Math.random()*32, this.pos.y+ Math.random()*32, {
				image: 'blood_explode_128',
				framewidth: 128,
				frameheight: 128,
			});
			splode.pos.z = 3;
			splode.addAnimation('splode', [0, 1, 2, 3, 4, 5], 100);
			splode.addAnimation('splode_over', [5], 100);

			var ancestor = this.ancestor;
			splode.setCurrentAnimation('splode', (function() {
				splode.setCurrentAnimation("splode_over");
				ancestor.removeChild(splode);
			}).bind(this));

			ancestor.addChild(splode, splode.pos.z);
		}
	},

	getControlDirection: function() {
		var x = 0;
		var y = 0;

		if (me.input.isKeyPressed('left')) {
			x = -1
		}
		else if (me.input.isKeyPressed('right')) {
			x = 1;
		}

		if(me.input.isKeyPressed('up')) {
			y = -1;
		}
		else if (me.input.isKeyPressed('down')) {
			y = 1;
		}
		return new me.Vector2d(x, y);
	},

	tryToDash: function(action, keycode, edge) {
		if (action === "dash" && !this.dashing) {
			me.audio.play("dash");

			var dashAnimCount = 0; // Goodbye recursion
			var dir = this.getControlDirection();
			if( dir.y != 0 || dir.x != 0) {
				this.dashing = true;
				this.body.setMaxVelocity(15, 15);
				this.body.vel.x = dir.x * 15;
				this.body.vel.y = dir.y * 15;
				var cb = function() {
					if(dashAnimCount > 0) {
						dashAnimCount--;
						this.changeAnimation("dash", cb)
					}
					else {
						this.body.setMaxVelocity(3, 3);
						this.changeAnimation("dash_finish", function() {
							this.dashing = false;
							this.changeAnimation("idle");
						})
					}
				};
				this.changeAnimation("dash", cb);
			}
		}
	},

	tryToShoot: function(action, keyCode, edge) {
		if(
			this.dashing
			|| this.takingDamage
			|| action != "shoot"
			|| this.shootDelay > 0
		) { //|| this.shooting

			return;
		}



		var initialX = this.fireDirection.x;
		var initialY = this.fireDirection.y;
		var dir = this.fireDirection; //this.getControlDirection();

		if( dir.y != 0 || dir.x != 0) {
			me.audio.play("player-shoot");

			this.shooting = true;
			this.changeAnimation("shoot", function(){
				this.changeAnimation("idle");
				this.shooting = false;
			})

			if( this.getMode() == "skel"){
				this.shootDelay = 175;
				var bullet = me.pool.pull(
					'boneProjectile',
					this.pos.x,
					this.pos.y,
					{
						dir: dir.normalize(),
					}
				);
				me.game.world.addChild(bullet, bullet.pos.z);

			}else{
				this.shootDelay = 100;
				var angle = Math.PI*0.15;
				dir.rotate(angle*-1);
				for(var i=0; i<3; i++){
					//tri shot.
					var bullet = me.pool.pull(
						'playerBloodProjectile',
						this.pos.x,
						this.pos.y,
						{
							dir: dir.normalize(),
						}
					);
					me.game.world.addChild(bullet, bullet.pos.z);
					dir.rotate(angle);
				}
			}

		}

		this.fireDirection.x = initialX;
		this.fireDirection.y = initialY;
	},


	fireAoe: function() {
		me.audio.play("player-melee");

		me.game.viewport.shake(3,500);

		var dir = new me.Vector2d(0,0);
		var num = 10;

		for(var i =0; i<num; i++){
			dir.x = Math.cos( Math.PI*2*(i/num) );
			dir.y = Math.sin( Math.PI*2*(i/num) );

			var bullet = me.pool.pull(
				'boneProjectile',
				this.pos.x,
				this.pos.y,
				{
					dir: dir.normalize(),
				}
			);
			me.game.world.addChild(bullet, bullet.pos.z);
		}
	},

	changeAnimation: function(dest, next) {
		if(!this.renderable.isCurrentAnimation(this.getAnimationName(dest))) {
			if(next) {
				next = next.bind(this);
			}
			this.renderable.setCurrentAnimation(this.getAnimationName(dest), next);
		}
	},

	onDeactivateEvent: function() {
		me.event.unsubscribe(this.shootSub);
		me.event.unsubscribe(this.dashSub);
	},


	update : function (dt) {


		if(this.shootDelay >=0){
			this.shootDelay-=dt;
		}

		var mode = this.getMode();
		if(mode == "big_mess"){
			if(this.renderable.isCurrentAnimation(this.getAnimationName("shoot"))){
				var frame = this.renderable.getCurrentAnimationFrame();
				if(frame == 6 && !this.aoeTriggered){
					this.aoeTriggered = true;
					this.fireAoe();
				}

				if( frame >= 8){
					this.aoeTriggered = false;
				}
			}
		}


		if(
			!this.dashing
			&& !this.dying
		) {

			var run = false;
			if (me.input.isKeyPressed('left')) {
				this.body.vel.x -= 3 * me.timer.tick;
				run = true;
			}
			if (me.input.isKeyPressed('right')) {
				this.body.vel.x += 3 * me.timer.tick;
				run = true;
			}

			if(me.input.isKeyPressed('up')) {
				this.body.vel.y -= 3 * me.timer.tick;
				run = true;
			}

			if(me.input.isKeyPressed('down')) {
				this.body.vel.y += 3 * me.timer.tick;
				run = true;
			}
			if(run){
				if(this.body.vel.x != 0) {
					this.renderable.flipX(this.body.vel.x < 0);
				}

				if(this.body.vel.y != 0) {
					this.facingUp = this.body.vel.y < 0;
				}
				if(!this.shooting) {
					this.changeAnimation("run", function() {
						this.changeAnimation("idle");
					})
				}
			}
		}
		if(this.body.vel.length() != 0){
			this.fireDirection.x = this.body.vel.x;
			this.fireDirection.y = this.body.vel.y;
		}

		if(this.body.vel.x != 0) {
			this.renderable.flipX(this.body.vel.x < 0);
		}

		if(this.body.vel.y != 0) {
			this.facingUp = this.body.vel.y < 0;
		}

		this.body.update(dt);

		if(this.pos.y < this.highestY){
			this.highestY = this.pos.y;
		}
		if(this.pos.y > this.highestY + this.yBuffer){
			this.pos.y = this.highestY + this.yBuffer;
		}

		this.cameraTargetPos.x = this.pos.x;
		this.cameraTargetPos.y = this.highestY + this.cameraTargetOffsetY;



		me.collision.check(this);

		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},

	damage: function(dir) {
		if(!this.takingDamage) {
			me.game.viewport.shake(5,1000);
			this.takingDamage = true;
			this.hp--;

			me.audio.play("player-hit");

			// Cheat to win!
			if(
				me.state.current().nodie
				&& this.hp <= 0
			) {

				this.hp = 1;
			}

			if(this.hp <= 0){
				me.audio.play("death");

				this.dying = true;
				this.changeAnimation("die", function() {
					this.changeAnimation("dead");
					me.timer.setTimeout(function(){
						me.state.change( me.state.GAMEOVER);
					}, 3000);
				})
			}
			else {
				this.renderable.flicker(500, (function () {
					this.takingDamage = false;
				}).bind(this));
			}
		}
	},

	onCollision : function (response, other) {
		if(other.body.collisionType == me.collision.types.PROJECTILE_OBJECT) {
			return false;
		}

		if(other.body.collisionType == me.collision.types.COLLECTABLE_OBJECT) {
			other.collect(this);
			return false;
		}

		return true;
	}
});
