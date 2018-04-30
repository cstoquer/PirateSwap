import util from 'math.util';
import View from 'ui.View';
import TextView from 'ui.TextView';
import ButtonView from 'ui.widget.ButtonView';
import ParticleEngine from 'ui.ParticleEngine';
import Button from 'src.Button';

var MAX_PARTICLES = 160;
var GEM_IMAGES = [
	'resources/images/gem_diamond.png',
	'resources/images/gem_emerald.png',
	'resources/images/gem_lazuli.png',
	'resources/images/gem_opal.png',
	'resources/images/gem_gold.png',
	'resources/images/gem_ruby.png'
];

export default class StageClearScreen extends View {
  constructor (opts) {
		super(opts);
	}

	init (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0
		});

		super.init(opts);

		this.build();
	}

	build () {
		// particles
		this.particleEngine = new ParticleEngine({
			parent: this,
			centerAnchor: true
		});

		// title
		new TextView({
			parent: this,
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
			parent: this,
			title: 'NEXT',
			on: {
				down: bind(this, 'onButtonPress', ButtonView.states.UP)
			}
		});

		this.createParticles();
	}

	onButtonPress () {
		this.emit('stageClearScreen:go');
	}

	createParticles () {
		var particleObjects = this.particleEngine.obtainParticleArray(MAX_PARTICLES);
		for (var i = 0; i < MAX_PARTICLES; i++) {
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
			pObj.image = GEM_IMAGES[util.random(0, 6)];
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
	}

	tick (dt) {
		this.particleEngine.runTick(dt);
	}
}
