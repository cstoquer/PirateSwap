import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;
import src.Button as Button;
import src.Boat as Boat;
import src.Clouds as Clouds;

exports = Class(View, function TitleScreen(supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function() {
		// clouds animation
		new Clouds({
			superview: this,
			x: 0,
			y: 200
		});

		// sea
		new View({
			superview: this,
			x: 0,
			y: 200,
			width: 320,
			height: 800,
			backgroundColor: '#3898ff'
		});

		// boat animation
		var boat = new Boat({
			superview: this,
			x: 100,
			y: 150
		});

		// title
		new TextView({
			superview: this,
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
			superview: this,
			title: 'START',
			on: {
				down: bind(this, 'startGame', ButtonView.states.UP)
			}
		});
	};

	this.startGame = function () {
		this.emit('titlescreen:start');
	};
});
