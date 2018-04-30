import Emitter from 'event/Emitter';

/* constants definitions
 */
var tile_size = 32; // px

/* Cell in the grid. It alway stays at the same place.
 * A cell can hold an item (e.g. a gem) and is responsible for interactions and logic.
 */
export default class Cell extends Emitter {
  constructor (opts) {
    super(opts);
		this.matched = false; // set to true when cell has been detected to be in a match
		this.isEmpty = false; // true if this is not a ground tile, and / or can not holds item.
	}

	init (opts) {
		super.init();

		this.i = opts.i; // horizontal position in the grid
		this.j = opts.j; // vertical position in the grid
		this.grid = opts.grid; // reference to cell's grid
		this.item = opts.item; // reference to a Gem instance

		this.item.updateOpts({
			x: tile_size * this.i,
			y: tile_size * this.j
		});

		this.on('cell:swipe', swipeFromCell.bind(this));
	}

	/* initialise cell from stage data
	 *
	 * @param {number} tileData - tile data as it comes from stage.json
	 */
	setData (tileData) {
		this.matched = false;
		this.isEmpty = tileData === 0;

		// reset item
		if (!this.item) {
			this.item = this.grid.gemPool.obtainView();
		}

		this.item.updateOpts({
			x: tile_size * this.i,
			y: tile_size * this.j
		});

		if (this.isEmpty) {
			this.item.hide();
		} else {
			this.item.show();
		}

		this.item.setGemType(tileData);
	}

	/* Returns true if this cell's item can be swapped with the cell's item passed in parameter
	 *
	 * @param {Cell} cell - the other cell instance to compare itself
	 */
	canSwapWith (cell) {
		if (this.isEmpty || !this.item) return false;
		// TODO: check if it's a special item that can't be swapped (e.g. rock)
		return true;
	}

	/* Returns true if this cell's item match with the other cell's item passed in parameter
	 *
	 * @param {Cell} cell - the other cell instance to compare itself
	 */
	isMatchable (cell) {
		if (!this.item || !cell.item) {
			return false;
		}
		if (this.item.type === cell.item.type) {
			return true;
		}
		// TODO: special items (e.g. bomb, chest)
		return false;
	}

	/* Clear marked gem
	 * Returns the number of gem cleared this way
	 *
	 * @param {ui.ViewPool} pool - pool of Gem
	 */
	clearGem (pool) {
		// TODO: special effects if special gem (e.g. bomb)

		pool.releaseView(this.item);
		this.item = null;
		this.matched = false;

		// explosion effect
		this.grid.fxSystem.addFx(this.i, this.j);

		return 1;
	}

	/* Make item in this cell fall if possible.
	 * Returns true if an item fall.
	 */
	makeFallVertically () {
		if (this.isEmpty || !this.item || this.item.isFalling) {
			return false;
		}

		var distance = 1;
		var cell = this.grid.getCell(this.i, this.j + distance);
		var target = null;

		while (cell && !cell.isEmpty && !cell.item) {
			target = cell;
			distance += 1;
			cell = this.grid.getCell(this.i, this.j + distance);
		}

		if (!target) {
			return false;
		}

		// swap item
		target.item = this.item;
		this.item = null;

		// create animation
		target.item.createFallAnimationTo(target, distance, false);

		return true;
	}

	makeFallDiagonally () {
		if (this.isEmpty || !this.item || this.item.isFalling) {
			return false;
		}
		var i = this.i;
		var j = this.j + 1;

		var left = this.grid.getCell(i - 1, j);
		if (left && !left.isEmpty && !left.item) {
			left.item = this.item;
			this.item = null;
			left.item.createFallAnimationTo(left, -1, true);
			return true;
		}

		var right = this.grid.getCell(i + 1, j);
		if (right && !right.isEmpty && !right.item) {
			right.item = this.item;
			this.item = null;
			right.item.createFallAnimationTo(right, -1, true);
			return true;
		}

		return false;
	}
}

/* User performed a swipe gesture from this cell
 *
 * @param {string} direction - swipe direction: "left" | "right" | "up" | "down"
 */
function swipeFromCell(direction) {
	var i = this.i;
	var j = this.j;

	switch (direction) {
		case 'left':  i -= 1; break;
		case 'right': i += 1; break;
		case 'up':    j -= 1; break;
		case 'down':  j += 1; break;
	}

	var otherCell = this.grid.getCell(i, j);

	if (otherCell && otherCell.canSwapWith(this)) {
		this.grid.emit('grid:swapCells', this, otherCell);
	}
}
