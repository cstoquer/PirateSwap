import ui.View as View;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;
import src.Button as Button;

exports = Class(View, function GameOverScreen(supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function() {
		new TextView({
			superview: this,
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
			superview: this,
			title: 'RETRY',
			on: {
				down: bind(this, 'onButtonPress', ButtonView.states.UP)
			}
		});
	};

	this.onButtonPress = function () {
		this.emit('gameOverScreen:go');
	};
});
