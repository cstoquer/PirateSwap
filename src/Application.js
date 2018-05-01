// NOTE: webpackGameEntrypoint must go at top of file!
import webpackGameEntrypoint from 'devkitCore/clientapi/webpackGameEntrypoint';

import device from 'device';
import View from 'ui/View';
import ImageView from 'ui/ImageView';
import sounds from 'src/lib/sounds';

import StackView from 'ui/StackView';
import TitleScreen from 'src/game/TitleScreen';
import GameScreen from 'src/game/GameScreen';
import StageClearScreen from 'src/game/StageClearScreen';
import GameOverScreen from 'src/game/GameOverScreen';



export default class Application extends View {
  constructor (opts) {
    super(opts);

    // this.time = 0;

    this._resize();
    this._startGame();

    device.screen.on('Resize', () => this._resize());
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
		this.style.backgroundColor = '#6eeeff';

		var rootView = new StackView({
			parent: this,
			x: 0,
			y: 0,
			width: 320,
			height: 480,
			clip: false,
			scale: device.width / 320
		});

		var titleScreen = new TitleScreen();
		var gameScreen = new GameScreen();
		var stageClearScreen = new StageClearScreen();
		var gameOverScreen = new GameOverScreen();


		rootView.push(titleScreen);
		sounds.playSong('pirateSea');


		titleScreen.on('titlescreen:start', () => {
			sounds.playSong('dubesque');
			rootView.push(gameScreen, true);
			gameScreen.emit('app:start');
		});

		gameScreen.on('game:stageClear', () => {
			sounds.playSong('win');
			rootView.push(stageClearScreen, true);
		});

		gameScreen.on('game:gameOver', () => {
			sounds.playSong('loose');
			rootView.push(gameOverScreen, true);
		});

		stageClearScreen.on('stageClearScreen:go', () => {
			rootView.pop(true);
			sounds.playSong('dubesque');
			gameScreen.emit('app:nextStage');
		});

		gameOverScreen.on('gameOverScreen:go', () => {
			rootView.pop(true);
			sounds.playSong('dubesque');
			gameScreen.emit('app:start');
		});
	}
}

webpackGameEntrypoint(Application);
