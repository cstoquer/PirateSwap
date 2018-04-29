import ui.View as View;
import ui.ImageView as ImageView;
import ui.ScoreView as ScoreView;
import math.util as util;

var characterData = {};
for (var i = 0; i <= 9; i++) {
	characterData[i] = { 'image': 'resources/images/gold_number_' + i + '.png' };
}

/* Display the score in big golden numbers
 */
exports = Class(View, function Money(supr) {
	this._value = 0;

	this.init = function (opts) {
		supr(this, 'init', [opts]);

		new ImageView({
			superview: this,
			x: 0,
			y: 0,
			image: 'resources/images/gold_number_dollar.png',
			autoSize: true
		});

		this._scoreView = new ScoreView({
			superview: this,
			x: 42,
			y: 6,
			width: 122,
			height: 48,
			characterData: characterData,
			horizontalAlign: 'left',
			spacing: 4,
			text: '0'
		});
	};

	/* Get score value
	 */
	this.getValue = function () {
		return this._value;
	};

	/* Set score value and update display accordingly
	 *
	 * @param {number} value - score value to set
	 */
	this.setValue = function (value) {
		value = util.clip(value, 0, 999);
		this._value = value;
		this._scoreView.setText(value);
	};

	/* add `value` to the score current value
	 *
	 * @param {number} value - value to add
	 * @returns {number} score's updated value
	 */
	this.addValue = function (value) {
		this.setValue(this._value + value);
		return this._value;
	};
});
