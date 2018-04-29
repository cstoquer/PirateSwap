import animate;
import ui.ImageView as ImageView;
import src.gemImages as gemImages;

/* Constants definitions
 */
var tile_size = 32; // px

/* Gem or item in grid's cell
 */
exports = Class(ImageView, function Gem(supr) {
	this.type = 0;
	this.isFalling = false;

	this.init = function (opts) {
		opts = merge(opts, {
			image: gemImages[this.type],
			autoSize: true
		});

		supr(this, 'init', [opts]);
	};

	/* Set the gem type (gem or object) and update image accordingly
	 *
	 * @param {number} type - type code of the item
	 */
	this.setGemType = function (type) {
		this.type = type;
		this.setImage(gemImages[type]);
	};

	/* Make this gem animate from its current position to a target cell position.
	 * This animation occurs when user swap two gems.
	 *
	 * @param {Cell} cell - the cell on which the gem should move to
	 */
	this.createSwapAnimationTo = function (cell) {
		return animate(this, 'gemSwapAnimation')
			.now({x: this.style.x, y: this.style.y}, 0)
			.then({x: cell.i * tile_size, y: cell.j * tile_size}, 500, animate.easeOutBack);
	};

	/* Make this gem fall into a target cell position
	 * This animation occurs when gems are falling
	 *
	 * @param {Cell} cell - the cell on which the gem should fall to
	 */
	this.createFallAnimationTo = function (cell, distance, isDiagonal) {
		var duration = 500 + 100 * distance;

		// mark this item has falling so we don't animate it before the end of this animation.
		this.isFalling = true;

		var easing = isDiagonal ? animate.linear : animate.easeOutBounce;

		return animate(this, 'gemFallAnimation')
			.now({x: this.style.x, y: this.style.y}, 0)
			.then({x: cell.i * tile_size, y: cell.j * tile_size}, duration, easing)
			.then(bind(this, function () {
				this.isFalling = false;
			}));
	};
});
