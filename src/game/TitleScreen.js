import View from 'ui/View';
import ImageView from 'ui/ImageView';
import TextView from 'ui/TextView';
import ButtonView from 'ui/widget/ButtonView';
import Button from 'src/game/Button';
import Boat from 'src/game/Boat';
import Clouds from 'src/game/Clouds';


export default class TitleScreen extends View {

	init (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0
		});

		super.init(opts);

		this.build();
	}

	build () {
		// clouds animation
		new Clouds({
			parent: this,
			x: 0,
			y: 200
		});

		// sea
		new View({
			parent: this,
			x: 0,
			y: 200,
			width: 320,
			height: 800,
			backgroundColor: '#3898ff'
		});

		// boat animation
		var boat = new Boat({
			parent: this,
			x: 100,
			y: 150
		});

		// title
		new TextView({
			parent: this,
			text: 'PIRATE SWAP',
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


		// start button
		new Button({
			parent: this,
			title: 'START',
			on: {
				down: bind(this, 'startGame', ButtonView.states.UP)
			}
		});
	}

	startGame () {
		this.emit('titlescreen:start');
	}
}
