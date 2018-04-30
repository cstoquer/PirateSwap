import View from 'ui/View';
import TextView from 'ui/TextView';
import ButtonView from 'ui/widget/ButtonView';
import Button from 'src/game/Button';

export default class GameOverScreen extends View {

	init (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0
		});

		super.init(opts);

		this.build();
	};

	build () {
		new TextView({
			parent: this,
			text: 'GAME OVER',
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
			title: 'RETRY',
			on: {
				down: () => { this.onButtonPress(ButtonView.states.UP); }
			}
		});
	};

	onButtonPress () {
		this.emit('gameOverScreen:go');
	}
}
