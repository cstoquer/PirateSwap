import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import math.util as util;


/* Constants definitions
 */
var grid_width = 10;
var grid_height = 10;
var tile_size = 32;

/* Tile images are named island_tile_A to island_tile_M.
 * Let's construct a hash map of all theses images.
 */
var tileIds = 'ABCDEFGHIJKLM';
var tileImages = {};

for (var i = 0; i < tileIds.length; i++) {
	var id = tileIds[i];
	tileImages[id] = new Image({url: 'resources/images/island_tile_' + id + '.png'});
}

/* map from neigbourCode to tile id
 */
var borderTileMap = {
	1: 'F',
	2: 'B',
	3: 'L',
	4: 'D',
	6: 'M',
	8: 'H',
	9: 'J',
	12: 'K'
};

/* Island is a 10 x 10 tile grid that serve as the background of the gems grid.
 * tiles can be reconfigured depending on the stage structure.
 */
exports = Class(View, function Island(supr) {
	this.stageData = null;

	this.init = function (opts) {
		supr(this, 'init', [opts]);

		// create a 2-dimensional array of ImageView
		this._tiles = [];
		for (var x = 0; x < grid_width; x++) {
			var row = [];
			this._tiles.push(row);
			for (var y = 0; y < grid_height; y++) {
				var tile = new ImageView({
					superview: this,
					width: tile_size,
					height: tile_size,
					x: tile_size * x,
					y: tile_size * y,
				});
				row.push(tile);
			}
		}
	};

	/* Set stage data and create the island
	 *
	 * @param {Object} stageData - stage data as it comes from stages.json
	 */
	this.setStage = function (stageData) {
		this.stageData = stageData;
		this.createIsland();
	};

	/* This method use the stage data to which image should be used 
	 * for each tiles of the island. We use a method to autotile the
	 * design of the island from simple data.
	 * A stage is a 8 x 8 grid of tiles. The island have a 1 tile
	 * padding for the borders.
	 *
	 * @param {Object} stageData - stage data as it comes from stages.json
	 */
	this.createIsland = function (stageData) {
		for (var x = 0; x < grid_width; x++) {
			for (var y = 0; y < grid_height; y++) {
				var tileData = this.getTileData(x, y);
				if (tileData === 0) {
					// The tile data is empty. We need to look at 
					// neighbours to determine the image (either 
					// empty or a border)
					var neighbourCode = this.getNeighbourCode(x, y);

					if (neighbourCode === 0) {
						// neighbourCode 0 is treated separatelly:
						// it has no direct neighbours but can have a diagonal
						// neighbour thus shoul diplay a corner tile (A, C, I, G)
						// or just be an empty tile
						if (this.getTileData(x + 1 , y + 1)) {
							// top left corner
							this.setTileImage(x, y, 'A');

						} else if (this.getTileData(x - 1 , y + 1)) {
							// top right corner
							this.setTileImage(x, y, 'C');

						} else if (this.getTileData(x + 1 , y - 1)) {
							// bottom left corner
							this.setTileImage(x, y, 'G');
						
						} else if (this.getTileData(x - 1 , y - 1)) {
							// bottom right corner
							this.setTileImage(x, y, 'I');

						} else {
							// empty tile
							this.setTileImage(x, y, null);
						}
						
					} else {
						this.setTileImage(x, y, borderTileMap[neighbourCode]);
					}

				 } else {
					// Tile with an item, we fill it with a plain tile "E"
					this.setTileImage(x, y, 'E');
				}
			}
		}
	};

	/* Set image of a tile
	 *
	 * @param {number} x - x coordinate of the tile
	 * @param {number} y - y coordinate of the tile
	 * @param {string} tileId - id of the tile in the `tileImages` map
	 */
	this.setTileImage = function (x, y, tileId) {
		if (!tileId) {
			this._tiles[x][y].hide();
		} else {
			this._tiles[x][y].setImage(tileImages[tileId]);
			this._tiles[x][y].show();
		}
	};

	/* Get a tile from its coordinates
	 *
	 * @param {number} x - x coordinate of the tile
	 * @param {number} y - y coordinate of the tile
	 */
	this.getTileData = function (x, y) {
		// if data is not available
		if (!this.stageData) {
			return 0;
		}

		// we are outside the stage: return an empty tile
		if (x < 1 || x >= grid_width - 1 || y < 1 || y >= grid_height - 1) {
			return 0;
		}

		// we assume stageData are correctly formated
		return this.stageData.tiles[x - 1][y - 1];
	};

	/* Returns a integer code from the type of the tile's 4 direct neighbours
	 *
	 * @param {number} x - x coordinate of the tile
	 * @param {number} y - y coordinate of the tile
	 */
	this.getNeighbourCode = function (x, y) {
		var north = util.clip(this.getTileData(x, y - 1), 0, 1);
		var east  = util.clip(this.getTileData(x + 1, y), 0, 1);
		var south = util.clip(this.getTileData(x, y + 1), 0, 1);
		var west  = util.clip(this.getTileData(x - 1, y), 0, 1);

		return 8 * north + 4 * east + 2 * south + west;
	};
});
