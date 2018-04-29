import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import math.util as util;

var pellet_image = new Image({url: 'resources/images/gauge_pellet.png'});

exports = Class(ImageView, function Gauge(supr) {
	this._value = 10;
	this._pellets = [];

	this.init = function (opts) {
		opts = merge(opts, {
			image: 'resources/images/gauge_background.png',
			autoSize: true,
		});

		supr(this, 'init', [opts]);

		// creating pellets inside the gauge
		// var imgWidth = pellet_image.getOrigWidth();
		for (var i = 0; i < 10; i++) {
			var pellet = new ImageView({
				superview: this,
				image: pellet_image,
				autoSize: true,
				x: 10 + i * 14,
				y: 8
			});
			this._pellets.push(pellet);
		}
	};

	/* Returns gauge's value
	 */
	this.getValue = function () {
		return this._value;
	};

	/* Set gauge value and update rendering accordingly
	 *
	 * @param {number} value - value to set, integer in the range 0..10
	 */
	this.setValue = function (value) {
		value = util.clip(value, 0, 10);
		if (value === this._value) {
			return;
		}
		this._value = value;
		for (var i = 0; i < 10; i++) {
			var pellet = this._pellets[i];
			if (i < this._value) {
				pellet.show();
			} else {
				pellet.hide();
			}
		}
	};

	/* Add value amount to gauge current value
	 *
	 * @param {number} value - value to be added
	 */
	this.addValue = function (value) {
		this.setValue(this._value + value);
	};
});
