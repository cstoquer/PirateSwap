import View from 'ui/View';
import ImageView from 'ui/ImageView';
import util from 'math/util';
import animate from 'animate';

var cloud_images = [
	'resources/images/cloud1.png',
	'resources/images/cloud2.png',
	'resources/images/cloud3.png',
	'resources/images/cloud4.png',
	'resources/images/cloud5.png'
];

/* Animate few lovely clouds in the background on the horizon
 */
export default class Clouds extends View {
	constructor (opts) {
    super(opts);

		// creating a ImageView per cloud image and animate
		for (var i = 0; i < cloud_images.length; i++) {
			var cloud = new ImageView({
				parent: this,
				image: cloud_images[i],
				autoSize: true
			});

			// set offset at the bottom left corner of the image
			cloud.style.offsetY = -cloud.style.height;

			// randomize initial position
			cloud.style.x = util.random(-cloud.style.width, 320);

			continuousAnimate.call(cloud);
		}
	}
}

function continuousAnimate() {
	// make cloud move from left to right past the borders
	animate(this).clear()
		.now({x: this.style.x}, 0, animate.linear)
		.then({x: 320}, util.random(20, 25) * 1000, animate.linear)
		.then({x: 0 - this.style.width}, 0, animate.linear)
		.then(continuousAnimate.bind(this));
}
