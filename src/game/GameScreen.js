import utils from 'math/util';
import View from 'ui/View';
import ImageView from 'ui/ImageView';
import GestureView from 'ui/GestureView';
import Boat from 'src/game/Boat';
import Clouds from 'src/game/Clouds';
import Gauge from 'src/game/Gauge';
import Money from 'src/game/Money';
import Island from 'src/game/Island';
import Grid from 'src/game/Grid';
import soundController from 'src/game/soundController';
import stagesData from 'src/conf/stages.json';


export default class GameScreen extends View {
  constructor (opts) {
    super(opts);
		this.stageId = 0;
		this.targetScore = 0;
	}

	init (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0
		});

		super.init(opts);

		this.build();
	}

	build () {
		// clouds animation
		new Clouds({
			parent: this,
			x: 0,
			y: 100
		});

		// sea
		new View({
			parent: this,
			x: 0,
			y: 100,
			width: 320,
			height: 800,
			backgroundColor: '#3898ff'
		});

		// boat animation
		new Boat({
			parent: this,
			x: 10,
			y: 10
		});

		// grid background
		this.island = new Island({
			parent: this,
			x: 0,
			y: 150
		});

		// grid
		this.grid = new Grid({
			parent: this,
			x: 32,
			y: 150 + 32
		});

		// hud elements
		this.moneyScore = new Money({
			parent: this,
			x: 146,
			y: 20
		});

		this.staminaGauge = new Gauge({
			parent: this,
			x: 150,
			y: 86
		});

		// set event listeners
		this.on('app:start', resetGame.bind(this));
		this.on('app:nextStage', goToNextStage.bind(this));
		this.grid.on('grid:clearGem', bind(this, onClearGem));
		this.grid.on('grid:gemSwapped', bind(this, onSwapCells));
		this.grid.on('grid:turnEnd', bind(this, onTurnEnd));
	}
}

/* Player restart a fresh new game: go back to first stage and reset UI.
 */
function resetGame() {
	this.stageId = 0;
	setStage.call(this);
}

/* Go to the next stage
 */
function goToNextStage() {
	this.stageId += 1;
	if (this.stageId >= stagesData.stages.length) {
		this.stageId = 0;
	}

	setStage.call(this);
}

/* Read current stage from static data and initialise the level
 */
function setStage() {
	var stage = stagesData.stages[this.stageId];

	this.targetScore = stage.score;
	this.staminaGauge.setValue(stage.moves);
	this.moneyScore.setValue(0);

	this.island.setStage(stage);
	this.grid.setStage(stage);
}

/* Called when a group of gems have been cleared.
 *
 * Formula for calculating points is as follow:
 * - a match of gem worth 20 points
 * - 10 points for each extra gem after the first 3
 * - if clear occured from a chain, points are multiplied by the iteration number
 * - each bottle items gives 2 stamina when cleared, and 3 stamina for extra bottles.
 *
 * @param {number} match - total number of item in the match
 * @param {number} bottle - how many "bottle" item in the match (gives stamina)
 * @param {number} iteration - do match occured directly from swipe (iteration 1) or falling chain
 */
function onClearGem(match, bottle, iteration) {
	var gem = match - bottle;
	var points = 0;

	if (gem) {
		points += 20 + Math.max(0, gem - 3) * 10;
		points *= iteration;
	}

	var stamina = 2 * bottle + Math.max(0, bottle - 3);

	this.staminaGauge.addValue(stamina);
	this.moneyScore.addValue(points);

	// sound effects
	var sound = soundController.getSound();
	sound.play('explode');
	if (iteration > 1) {
		var comboId = util.clip(iteration, 2, 6);
		sound.play('combo_x' + comboId);
	}
}

/* Called when the user swap two gems
 */
function onSwapCells() {
	// decrease the stamina by 1
	this.staminaGauge.addValue(-1);

	// sound effect
	var sound = soundController.getSound();
	sound.play('swap');
}

/* Called when all gems have been cleared and fall, and grid is in a stable state
 */
function onTurnEnd() {
	var stamina = this.staminaGauge.getValue();
	if (this.moneyScore.getValue() >= this.targetScore) {
		// we reach the target score to clear the stage
		this.emit('game:stageClear');
	} else if (stamina <= 0) {
		// when there is no more stamina, it's game over
		this.emit('game:gameOver');
	} else if (stamina <= 3) {
		// play a warning sound if stamina runs low
		soundController.getSound().play('warning');
	}
}
