import math.array as array;

var defaultSpawn = [1, 2, 3, 4, 5, 6, 7];

/* System to fairly get random item from a defined spawn template
 */
exports = function GemSpawner() {
	this.spawn = []; // a list of item types that can be spawn
	this.bag = []; // the randomized set of item type

	/* Set stage data. The stage contain an array of gem type to be used when
	 * spawning new gems in the grid.
	 *
	 * @param {Object} stage - stage data as it comes from stages.json
	 */
	this.setStage = function (stage) {
		this.spawn = stage.spawn || defaultSpawn;
		this.bag = [];
		fillBag.call(this);
	}

	/* Get the next gem in the bag
	 */
	this.getGem = function () {
		if (this.bag.length === 0) {
			fillBag.call(this);
		}
		return this.bag.pop();
	}
};

/* Initialize and randomize the bag with a set of gem to be used when new gem spawn.
 * The algorithm is inspired by how Tetris' pieces spawn system works.
 */
function fillBag() {
	if (this.spawn.length === 0) {
		console.error('No spawn template set');
		// set to default template
		this.spawn = defaultSpawn;
	}

	// fill the bag with 2 times the items in spawn
	for (var i = 0; i < this.spawn.length; i++) {
		this.bag.push(this.spawn[i]);
		this.bag.push(this.spawn[i]);
	}

	// shuffle the bag
	array.shuffle(this.bag);
}
