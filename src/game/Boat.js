import View from 'ui/View';
import ImageView from 'ui/ImageView';
import animate from 'animate';

const HORIZONTAL_DERIVATION = 5;
const VERTICAL_DERIVATION = 6;

/* Simple animation of the boat floating over the sea.
 */
export default class Boat extends View {
  constructor (opts) {
    super(opts);

		var image = new ImageView({
			parent: this,
			image: 'resources/images/boat.png',
			autoSize: true
		});

		/* full animation is acheived by combining two desynchronized animations
		 * vertical movement is set on the image and horizontal movement on its parent view
		 */
		animateHorizontally.call(this, this.style.x);
		animateVertically.call(image, image.style.y);
	}
}

function animateHorizontally (startPosition) {
	animate(this).clear()
		.now({x: startPosition - HORIZONTAL_DERIVATION}, 100, animate.linear)
		.then({x: startPosition + HORIZONTAL_DERIVATION}, 6340, animate.easeInOut)
		.then({x: startPosition - HORIZONTAL_DERIVATION}, 6340, animate.easeInOut)
		.then(animateHorizontally.bind(this, startPosition));
}

function animateVertically (startPosition) {
	animate(this).clear()
		.now({y: startPosition - VERTICAL_DERIVATION}, 100, animate.linear)
		.then({y: startPosition + VERTICAL_DERIVATION}, 2000, animate.easeInOut)
		.then({y: startPosition - VERTICAL_DERIVATION}, 2000, animate.easeInOut)
		.then(animateVertically.bind(this, startPosition));
}
