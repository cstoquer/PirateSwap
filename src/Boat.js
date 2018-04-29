import ui.View as View;
import ui.ImageView as ImageView;
import animate;

var horizontal_derivation = 5,
		vertical_derivation = 6;

/* Simple animation of the boat floating over the sea.
 */
exports = Class(View, function Boat(supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		var image = new ImageView({
			superview: this,
			image: 'resources/images/boat.png',
			autoSize: true
		});

		/* full animation is acheived by combining two desynchronized animations
		 * vertical movement is set on the image and horizontal movement on its parent view
		 */
		animateHorizontally.call(this, this.style.x);
		animateVertically.call(image, image.style.y);
	};
});

function animateHorizontally (startPosition) {
	animate(this).clear()
		.now({x: startPosition - horizontal_derivation}, 100, animate.linear)
		.then({x: startPosition + horizontal_derivation}, 6340, animate.easeInOut)
		.then({x: startPosition - horizontal_derivation}, 6340, animate.easeInOut)
		.then(animateHorizontally.bind(this, startPosition));
}

function animateVertically (startPosition) {
	animate(this).clear()
		.now({y: startPosition - vertical_derivation}, 100, animate.linear)
		.then({y: startPosition + vertical_derivation}, 2000, animate.easeInOut)
		.then({y: startPosition - vertical_derivation}, 2000, animate.easeInOut)
		.then(animateVertically.bind(this, startPosition));
}
