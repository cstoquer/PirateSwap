import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';
import util from 'math/util';

var PELLET_IMAGE = new Image({ url: 'resources/images/gauge_pellet.png' });

export default class Gauge extends ImageView {
  constructor (opts) {
    super(opts);
		this._value = 10;
		this._pellets = [];
	}

	init (opts) {
		opts = merge(opts, {
			image: 'resources/images/gauge_background.png',
			autoSize: true,
		});

		super.init(opts);

		// creating pellets inside the gauge
		// var imgWidth = PELLET_IMAGE.getOrigWidth();
		for (var i = 0; i < 10; i++) {
			var pellet = new ImageView({
				superview: this,
				image: PELLET_IMAGE,
				autoSize: true,
				x: 10 + i * 14,
				y: 8
			});
			this._pellets.push(pellet);
		}
	}

	/* Returns gauge's value
	 */
	getValue () {
		return this._value;
	}

	/* Set gauge value and update rendering accordingly
	 *
	 * @param {number} value - value to set, integer in the range 0..10
	 */
	setValue (value) {
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
	}

	/* Add value amount to gauge current value
	 *
	 * @param {number} value - value to be added
	 */
	addValue (value) {
		this.setValue(this._value + value);
	}
}
