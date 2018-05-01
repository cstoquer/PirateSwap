import { merge } from 'base';
import ButtonView from 'ui/widget/ButtonView';
import FixedTextView from 'src/lib/FixedTextView';

/* Pre-styled button
 */
export default class Button extends ButtonView {
	constructor (opts) {
		opts = merge(opts, {
			width: 200,
			height: 48,
			x: 60,
			y: 350,
			images: {
				up: 'resources/images/button_up.png',
				down: 'resources/images/button_down.png'
			},
			scaleMethod: '3slice',
			sourceSlices: {
				horizontal: {left: 32, center: 32, right: 32}
			},
			destSlices: {
				horizontal: {left: 32, right: 32}
			}
		});

		super(opts);

		// title
		this.titleText = new FixedTextView({
			parent: this,
			text: opts.title,
			color: '#c44d29',
			x: 0,
			y: -10,
			width: 200,
			height: 48,
			fontWeight: 'bold',
			fontFamily: 'rounded-x-mplus-1c-heavy',
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			strokeWidth: 8,
			strokeColor: '#fff275',
			size: 30,
			autoFontSize: false,
			autoSize: false
		});
	}
}
