import View from 'ui.View';
import ImageView from 'ui.ImageView';
import ScoreView from 'ui.ScoreView';
import util from 'math.util';

var characterData = {};
for (var i = 0; i <= 9; i++) {
	characterData[i] = { 'image': 'resources/images/gold_number_' + i + '.png' };
}

/* Display the score in big golden numbers
 */
export default class Money extends View {
  constructor (opts) {
    super(opts);
		this._value = 0;
	}

	init (opts) {
		super.init(opts);

		new ImageView({
			parent: this,
			x: 0,
			y: 0,
			image: 'resources/images/gold_number_dollar.png',
			autoSize: true
		});

		this._scoreView = new ScoreView({
			parent: this,
			x: 42,
			y: 6,
			width: 122,
			height: 48,
			characterData: characterData,
			horizontalAlign: 'left',
			spacing: 4,
			text: '0'
		});
	}

	/* Get score value
	 */
	getValue () {
		return this._value;
	}

	/* Set score value and update display accordingly
	 *
	 * @param {number} value - score value to set
	 */
	setValue (value) {
		value = util.clip(value, 0, 999);
		this._value = value;
		this._scoreView.setText(value);
	}

	/* add `value` to the score current value
	 *
	 * @param {number} value - value to add
	 * @returns {number} score's updated value
	 */
	addValue (value) {
		this.setValue(this._value + value);
		return this._value;
	}
}
