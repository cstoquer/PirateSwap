import device;
import ui.StackView as StackView;
import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;
import src.StageClearScreen as StageClearScreen;
import src.GameOverScreen as GameOverScreen;
import src.soundController as soundController;

exports = Class(GC.Application, function (supr) {

	/* Run after the engine is created and the scene graph is in
	 * place, but before the resources have been loaded.
	 */
	this.initUI = function () {
		var titleScreen = new TitleScreen();
		var gameScreen = new GameScreen();
		var stageClearScreen = new StageClearScreen();
		var gameOverScreen = new GameOverScreen();

		this.view.style.backgroundColor = '#6eeeff';

		var rootView = new StackView({
			superview: this,
			x: 0,
			y: 0,
			width: 320,
			height: 480,
			clip: false,
			scale: device.width / 320
		});

		rootView.push(titleScreen);

		var sound = soundController.getSound();

		titleScreen.on('titlescreen:start', function () {
			sound.play('dubesque');
			rootView.push(gameScreen, true);
			gameScreen.emit('app:start');
		});

		gameScreen.on('game:stageClear', function () {
			sound.play('win');
			rootView.push(stageClearScreen, true);
		});

		gameScreen.on('game:gameOver', function () {
			sound.play('loose');
			rootView.push(gameOverScreen, true);
		});

		stageClearScreen.on('stageClearScreen:go', function () {
			rootView.pop(true);
			sound.play('dubesque');
			gameScreen.emit('app:nextStage');
		});

		gameOverScreen.on('gameOverScreen:go', function () {
			rootView.pop(true);
			sound.play('dubesque');
			gameScreen.emit('app:start');
		});
	};

	/* Executed after the asset resources have been loaded.
	 * If there is a splash screen, it's removed.
	 */
	this.launchUI = function () {
		soundController.getSound().play('pirateSea');
	};
});
