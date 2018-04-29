import animate;
import ui.View as View;
import ui.SpriteView as SpriteView;
import ui.ParticleEngine as ParticleEngine;

var particles_images = [
	'resources/images/smoke_big.png',
	'resources/images/smoke_medium.png',
	'resources/images/smoke_medium.png',
	'resources/images/smoke_small.png',
	'resources/images/smoke_small.png',
	'resources/images/smoke_small.png'
];

/* Graphic special effect for gem clear.
 */
exports = Class(View, function Fx(supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		// create particle engine and particles
		this.pEngine = new ParticleEngine({
			superview: this,
			centerAnchor: true
		});

		// create animated sprite
		this.sprite = new SpriteView({
			superview: this,
			width: 64,
			height: 64,
			url: 'resources/images/fx',
			defaultAnimation: 'idle'
		});
	};

	this.play = function () {
		this.sprite.startAnimation('explosion');

		var particleObjects = this.pEngine.obtainParticleArray(particles_images.length);
		for (var i = 0; i < particles_images.length; i++) {
			var pObj = particleObjects[i];
			pObj.ox = 20;
			pObj.oy = 20;
			pObj.polar = true;
			pObj.dradius = 100 + Math.random() * 100;
			pObj.ddradius = -20;
			pObj.theta = Math.random() * 2 * Math.PI;
			pObj.width = 20;
			pObj.height = 20;
			pObj.ttl = 500;
			pObj.image = particles_images[i];
		}
		this.pEngine.emitParticles(particleObjects);

		return this;
	};

	this.tickParticle = function (dt) {
		this.pEngine.runTick(dt)
	};
});
