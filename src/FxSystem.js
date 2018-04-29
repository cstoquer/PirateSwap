import ui.View as View;
import ui.ViewPool as ViewPool;
import src.Fx as Fx;


/* Manage a pool of fx animations for gem explosion
 */
exports = Class(View, function FxSystem(supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this.pool = new ViewPool({
			ctor: Fx,
			initCount: 20,
			initOpts: {
				superview: this
			}
		});

		this.actives = [];
	};

	/* Add an fx in the screen
	 *
	 * @param {number} i - i coordinate of the item in the grid
	 * @param {number} j - j coordinate of the item in the grid
	 */
	this.addFx = function (i, j) {
		var fx = this.pool.obtainView();

		fx.updateOpts({
			x: 32 * i - 16,
			y: 32 * j - 16
		});

		this.actives.push(fx);

		fx.play();

		// set a timeout to clear and remove this fx after 1s
		window.setTimeout(bind(this, this.removeFx, fx), 1000);
	};

	/* remove an fx fron the screen
	 *
	 * @param {Fx} fx - fx instance to be removed
	 */
	this.removeFx = function (fx) {
		this.pool.releaseView(fx);
		var index = this.actives.indexOf(fx);
		if (index === -1) {
			console.error('call to removeFx with an object not in actives');
			return;
		}
		this.actives.splice(index, 1);
	};

	/* tick particle engines of all active fx
	 */
	this.tick = function (dt) {
		for (var i = this.actives.length - 1; i >= 0; i--) {
			this.actives[i].tickParticle(dt);
		}
	};
});
