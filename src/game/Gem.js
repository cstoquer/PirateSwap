import animate from 'animate';
import ImageView from 'ui/ImageView';
import gemImages from 'src/game/gemImages';
import { merge } from 'base';


const TILE_SIZE = 32; // px

/* Gem or item in grid's cell
 */
export default class Gem extends ImageView {
  constructor (opts) {
		opts = merge(opts, {
			// image: gemImages[this.type],
			autoSize: true
		});

    super(opts);
		this.type = 0;
		this.isFalling = false;
	}

	/* Set the gem type (gem or object) and update image accordingly
	 *
	 * @param {number} type - type code of the item
	 */
	setGemType (type) {
		this.type = type;
		this.setImage(gemImages[type]);
	}

	/* Make this gem animate from its current position to a target cell position.
	 * This animation occurs when user swap two gems.
	 *
	 * @param {Cell} cell - the cell on which the gem should move to
	 */
	createSwapAnimationTo (cell) {
		return animate(this, 'gemSwapAnimation')
			.now({x: this.style.x, y: this.style.y}, 0)
			.then({x: cell.i * TILE_SIZE, y: cell.j * TILE_SIZE}, 500, animate.easeOutBack);
	}

	/* Make this gem fall into a target cell position
	 * This animation occurs when gems are falling
	 *
	 * @param {Cell} cell - the cell on which the gem should fall to
	 */
	createFallAnimationTo (cell, distance, isDiagonal) {
		var duration = 500 + 100 * distance;

		// mark this item has falling so we don't animate it before the end of this animation.
		this.isFalling = true;

		var easing = isDiagonal ? animate.linear : animate.easeOutBounce;

		return animate(this, 'gemFallAnimation')
			.now({x: this.style.x, y: this.style.y}, 0)
			.then({x: cell.i * TILE_SIZE, y: cell.j * TILE_SIZE}, duration, easing)
			.then(() => {
				this.isFalling = false;
			});
	}
}
