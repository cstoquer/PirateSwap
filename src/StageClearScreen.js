import math.util as util;
import ui.View as View;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;
import ui.ParticleEngine as ParticleEngine;
import src.Button as Button;

var max_particles = 160;
var gem_images = [
	'resources/images/gem_diamond.png',
	'resources/images/gem_emerald.png',
	'resources/images/gem_lazuli.png',
	'resources/images/gem_opal.png',
	'resources/images/gem_gold.png',
	'resources/images/gem_ruby.png'
];

exports = Class(View, function StageClearScreen(supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function() {
		// particles
		this.particleEngine = new ParticleEngine({
			superview: this,
			centerAnchor: true
		});

		// title
		new TextView({
			superview: this,
			text: 'STAGE CLEAR!',
			color: '#c44d29',
			x: 0,
			y: 0,
			width: 320,
			height: 100,
			fontFamily: 'rounded-x-mplus-1c-heavy',
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			strokeWidth: 10,
			strokeColor: '#fff275',
			size: 40,
			autoFontSize: false,
			autoSize: false
		});

		// button
		new Button({
			superview: this,
			title: 'NEXT',
			on: {
				down: bind(this, 'onButtonPress', ButtonView.states.UP)
			}
		});

		this.createParticles();
	};

	this.onButtonPress = function () {
		this.emit('stageClearScreen:go');
	};

	this.createParticles = function () {
		var particleObjects = this.particleEngine.obtainParticleArray(max_particles);
		for (var i = 0; i < max_particles; i++) {
			var pObj = particleObjects[i];
			pObj.x = util.random(-30, 320);
			pObj.y = util.random(-50, 400);
			pObj.anchorX = 25;
			pObj.anchorY = 25;
			pObj.dx = 0;
			pObj.dy = util.random(300, 600);
			pObj.ddy = 50;
			pObj.dr = 20 * (Math.random() - 0.5);
			pObj.width = 50;
			pObj.height = 50;
			pObj.ttl = Infinity;
			pObj.image = gem_images[util.random(0, 6)];
			pObj.triggers.push({
				property: 'y',
				value: 600,
				smaller: false,
				action: function(particle) {
					// reset particule position to the top
					particle.pData.y = -50;
					particle.pData.dy = util.random(300, 600);
					particle.pData.ddy = 50;
				}
			});
		}
		this.particleEngine.emitParticles(particleObjects);
	};

	this.tick = function (dt) {
		this.particleEngine.runTick(dt);
	};
});
