// NOTE: webpackGameEntrypoint must go at top of file!
import webpackGameEntrypoint from 'devkitCore/clientapi/webpackGameEntrypoint';

import device from 'device';
import View from 'ui/View';
import ImageView from 'ui/ImageView';
import sounds from 'src/lib/sounds';

import StackView from 'ui/StackView';
import TitleScreen from 'src/TitleScreen';
import GameScreen from 'src/GameScreen';
import StageClearScreen from 'src/StageClearScreen';
import GameOverScreen from 'src/GameOverScreen';



export default class Application extends View {
  constructor (opts) {
    super(opts);

    // this.time = 0;

    this._resize();
    this._startGame();

    device.screen.on('Resize', () => this._resize());
  }

  /* Run after the engine is created and the scene graph is in
	 * place, but before the resources have been loaded.
	 */
	initUI () {
    // ...
  }

  /* Executed after the asset resources have been loaded.
	 * If there is a splash screen, it's removed.
	 */
	launchUI () {
    sounds.playSong('pirateSea');
	}

  _resize () {
    var screen = device.screen;
    var screenWidth = screen.width;
    var screenHeight = screen.height;

    this.style.width = screenWidth;
    this.style.height = screenHeight;
  }

  // _tick (dt) {
  //   // called every frame by the engine
  //   this.time += dt;
  // }

  _startGame () {
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

		titleScreen.on('titlescreen:start', function () {
			sounds.playSong('dubesque');
			rootView.push(gameScreen, true);
			gameScreen.emit('app:start');
		});

		gameScreen.on('game:stageClear', function () {
			sounds.playSong('win');
			rootView.push(stageClearScreen, true);
		});

		gameScreen.on('game:gameOver', function () {
			sounds.playSong('loose');
			rootView.push(gameOverScreen, true);
		});

		stageClearScreen.on('stageClearScreen:go', function () {
			rootView.pop(true);
			sounds.playSong('dubesque');
			gameScreen.emit('app:nextStage');
		});

		gameOverScreen.on('gameOverScreen:go', function () {
			rootView.pop(true);
			sounds.playSong('dubesque');
			gameScreen.emit('app:start');
		});
	}
}

webpackGameEntrypoint(Application);
