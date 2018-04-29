import AudioManager;

exports.sound = null;

/* Initialize the audio files if they haven't been already.
 */
exports.getSound = function () {
	if (!exports.sound) {
		exports.sound = new AudioManager({
			path: 'resources/sounds',
			files: {
				pirateSea: {
					path: 'music',
					volume: 0.5,
					background: true,
					loop: true
				},
				dubesque: {
					path: 'music',
					volume: 0.6,
					background: true,
					loop: true
				},
				win: {
					path: 'music',
					volume: 0.5,
					background: true,
					loop: false
				},
				loose: {
					path: 'music',
					volume: 0.5,
					background: true,
					loop: false
				},
				swap: {
					path: 'effect',
					background: false
				},
				fall: {
					path: 'effect',
					background: false
				},
				combo_x2: {
					path: 'effect',
					background: false
				},
				combo_x3: {
					path: 'effect',
					background: false
				},
				combo_x4: {
					path: 'effect',
					background: false
				},
				combo_x5: {
					path: 'effect',
					background: false
				},
				combo_x6: {
					path: 'effect',
					background: false
				},
				explode: {
					path: 'effect',
					background: false
				},
				destroy: {
					path: 'effect',
					background: false
				},
				warning: {
					path: 'effect',
					background: false
				}
			}
		});
	}
	return exports.sound;
};
