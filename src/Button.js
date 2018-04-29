import ui.widget.ButtonView as ButtonView;

/* Pre-styled button
 */
exports = Class(ButtonView, function Button(supr) {
	this.init = function (opts) {
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
			},
			text: {
				color: '#c44d29',
				fontWeight: 'bold',
				strokeWidth: 8,
				strokeColor: '#fff275',
				fontFamily: 'rounded-x-mplus-1c-heavy',
				size: 30,
				padding: [0, 0, 15, 0],
				autoFontSize: false,
				autoSize: false
			}
		});

		supr(this, 'init', [opts]);
	};	
});
