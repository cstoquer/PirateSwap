import animate from 'animate';
import util from 'math/util';
import GestureView from 'ui/GestureView';
import View from 'ui/View';
import ViewPool from 'ui/ViewPool';
import Cell from 'src/game/Cell';
import Gem from 'src/game/Gem';
import GemSpawner from 'src/game/GemSpawner';
import FxSystem from 'src/game/FxSystem';


const GRID_WIDTH = 8;
const GRID_HEIGHT = 8;
const TILE_SIZE = 32; // px
const BOTTLE_ITME_TYPE = 7;

/* A 8 by 8 grid of gem.
 * This class contain most of the game logic.
 */
export default class Grid extends GestureView {
  constructor (opts) {
		super(opts);

		this._isInteractionLocked = false;
		this._lastMove = null;
	}

	init (opts) {
		opts = merge(opts, {
			// backgroundColor: 'rgba(255, 255, 0, 0.2)',
			width: TILE_SIZE * GRID_WIDTH,
			height: TILE_SIZE * GRID_HEIGHT,
			swipeMagnitude: 32,
			swipeTime: 1000
		});

		super.init(opts);

		this.build();
	}

	/* Build the grid
	 */
	build () {
		// gem spawner
		this.gemSpawner = new GemSpawner();

		// initialize a ViewPool for Gem
		this.gemPool = new ViewPool({
			ctor: Gem,
			initCount: GRID_WIDTH * GRID_HEIGHT,
			initOpts: {
				superview: this
			}
		});

		// create a 2-dimensional array of Cell
		this.cells = [];
		for (var i = 0; i < GRID_WIDTH; i++) {
			var row = [];
			this.cells.push(row);
			for (var j = 0; j < GRID_HEIGHT; j++) {
				var tile = new Cell({
					i: i,
					j: j,
					grid: this,
					item: this.gemPool.obtainView()
				});
				row.push(tile);
			}
		}

		// create FxSystem
		this.fxSystem = new FxSystem({
			superview: this
		});

		// set listeners for input events
		var selectedCell = null;

		this.on('InputStart', function (event, point) {
			var i = Math.floor(point.x / TILE_SIZE);
			var j = Math.floor(point.y / TILE_SIZE);
			if (i < 0 || i >= GRID_WIDTH || j < 0 || j >= GRID_HEIGHT) {
				return;
			}
			selectedCell = this.getCell(i, j);
			if (selectedCell) {
				selectedCell.emit('cell:select');
			}
		});

		this.on('FingerUp', function () {
			if (!selectedCell) {
				return;
			}
			selectedCell.emit('cell:selectEnd');
			selectedCell = null;
		});

		this.on('Swipe', function (angle, direction) {
			if (!selectedCell) {
				return;
			}
			selectedCell.emit('cell:swipe', direction);
		});

		// set game logic event listener
		this.on('grid:swapCells', swapCells.bind(this));
	}

	/* Get cell in the grid at coordinate i, j
	 * If the coordinate is outside the grid, returns null
	 *
	 * @param {number} i - i coordinate
	 * @param {number} j - j coordinate
	 */
	getCell (i, j) {
		if (i < 0 || i >= GRID_WIDTH || j < 0 || j >= GRID_HEIGHT) {
			return null;
		}
		// TODO: check that cell is not empty
		return this.cells[i][j];
	}

	/* Set stage data, and initialize cells accordingly
	 *
	 * @param {Object} stageData - stage data as it comes from stages.json
	 */
	setStage (stageData) {
		this.gemSpawner.setStage(stageData);

		for (var i = 0; i < GRID_WIDTH; i++) {
			for (var j = 0; j < GRID_HEIGHT; j++) {
				var tileData = stageData.tiles[i][j];
				var cell = this.getCell(i, j);
				cell.setData(tileData);
			}
		}
	}
}

/* Swap two cells' item. This occurs when user swipe two cells.
 *
 * @param {Cell} source - source cell to swap
 * @param {Cell} target - target cell to swap
 */
function swapCells(source, target) {
	if (this._isInteractionLocked) {
		return;
	}

	// save the swap
	this._lastMove = {
		source: source,
		target: target
	};

	this.emit('grid:gemSwapped');

	swapAnimation.call(this, source, target, bind(this, function () {
		var foundMatch = checkForMatch.call(this, 1);
		// NOTA: following code has been commented out because game felt more fun without.
		// if (!foundMatch) {
		// 	// cancel the last move if no match occured from it
		// 	cancelLastMove.call(this);
		// }
	}));
}

/* Create and start the swap animation, then call provided callback once it finishes
 *
 * @param {Cell} source - source cell to swap
 * @param {Cell} target - target cell to swap
 * @param {Function} cb - callback function to call when animation finishes
 */
function swapAnimation(source, target, cb) {
	// lock interactions
	this._isInteractionLocked = true;

	// animation
	source.item.createSwapAnimationTo(target);
	target.item.createSwapAnimationTo(source);

	// swap items in cells
	var item = source.item;
	source.item = target.item;
	target.item = item;

	// wait for swap animations to finish
	animate.getGroup('gemSwapAnimation').once('Finish', cb);
}

/* Undo the last swap move
 */
function cancelLastMove() {
	var source = this._lastMove.source;
	var target = this._lastMove.target;

	swapAnimation.call(this, source, target, bind(this, function () {
		this._isInteractionLocked = false;
	}));
}

/* Check the grid for matching cells and mark them as `matched`.
 * Returns true if any match was found.
 *
 * @param {number} iteration - iteration number in the match detection process
 */
function checkForMatch(iteration) {
	var foundMatch = false;

	for (var i = 0; i < GRID_WIDTH; i++) {
		for (var j = 0; j < GRID_HEIGHT; j++) {

			var cell = this.getCell(i, j);
			if (cell.isEmpty) {
				continue;
			}

			var left   = this.getCell(i - 1, j);
			var right  = this.getCell(i + 1, j);
			var top    = this.getCell(i, j - 1);
			var bottom = this.getCell(i, j + 1);

			// horizontal match
			if (left && left.isMatchable(cell) && right && right.isMatchable(cell)) {
				cell.matched = true;
				left.matched = true;
				right.matched = true;
				foundMatch = true;
			}

			// vertical match
			if (top && top.isMatchable(cell) && bottom && bottom.isMatchable(cell)) {
				cell.matched = true;
				top.matched = true;
				bottom.matched = true;
				foundMatch = true;
			}
		}
	}

	if (foundMatch) {
		clearMatchingGem.call(this, iteration);
	} else {
		// unlock the interactions
		this._isInteractionLocked = false;
		this.emit('grid:turnEnd');
	}

	return foundMatch;
};

/* Clear all gem that has been marked as `matched`
 *
 * @param {number} iteration - iteration number in the match detection process
 */
function clearMatchingGem(iteration) {
	var gemCleared = 0;
	var bottleCleared = 0;

	for (var i = 0; i < GRID_WIDTH; i++) {
		for (var j = 0; j < GRID_HEIGHT; j++) {
			var cell = this.getCell(i, j);
			if (!cell.matched) {
				continue;
			}

			var itemType = cell.item.type;
			gemCleared += cell.clearGem(this.gemPool);

			if (itemType === BOTTLE_ITME_TYPE) {
				bottleCleared += 1;
			}
		}
	}

	// TODO: a special tile should be added if matches is greater than 3

	this.emit('grid:clearGem', gemCleared, bottleCleared, iteration);

	makeGemFall.call(this, iteration);
};

/* Check for all gem that should fall, create new gems to fill any gap and
 * create their falling animations. When all animations finishes, check the
 * grid again for matches (next iteration in the match detection)
 *
 * NOTA: falling is done in two passes: first vertically (priority),
 *       then diagonally
 *
 * @param {number} iteration - iteration number in the match detection process
 */
function makeGemFall(iteration) {
	var i, j, cell;
	var hasFallen = false;

	// make gem falls vertically
	for (j = GRID_HEIGHT - 2; j >= 0; j--) {
		for (i = 0; i < GRID_WIDTH; i++) {
			hasFallen = this.getCell(i, j).makeFallVertically() || hasFallen;
		}
	}

	// make new gem appears and fall vertically from the top
	for (i = 0; i < GRID_WIDTH; i++) {
		cell = this.getCell(i, 0);
		if (!cell || cell.isEmpty || cell.item) {
			continue;
		}

		// how many gem should spawn
		var spawn = 0;

		while (cell && !cell.isEmpty && !cell.item) {
			spawn += 1;
			cell = this.getCell(i, spawn);
		}

		for (j = 0; j < spawn; j++) {
			cell = this.getCell(i, j);
			cell.setData(this.gemSpawner.getGem());

			cell.item.updateOpts({
				y: TILE_SIZE * (cell.j - spawn)
			});

			// animation
			cell.item.createFallAnimationTo(cell, spawn, false);
			cell.item.isFalling = false; // allow gem to fall diagonally
		}
	}

	// make gem falls diagonally
	for (j = GRID_HEIGHT - 1; j >= 0; j--) {
		for (i = 0; i < GRID_WIDTH; i++) {
			if (this.getCell(i, j).makeFallDiagonally()) {
				hasFallen = true;

				// make the whole row also fall before continuing
				var row = j - 1;
				cell = this.getCell(i, row);
				while (cell && cell.makeFallVertically()) {
					row -= 1;
					cell = this.getCell(i, row);
				}
			}
		}
	}

	// wait for animation to finish if any, and iterate to the next step
	if (hasFallen) {
		// wait for all fall animations to finish before next step
		animate.getGroup('gemFallAnimation').once('Finish', bind(this, makeGemFall, iteration));
	} else {
		// iterate on checkForMatch
		iteration += 1;
		checkForMatch.call(this, iteration);
	}
};
