module.exports = function() {
	var client = './src/client/';
	var server = './src/server/';

	var config = {
		/**
		 * Files path
		 */
		alljs: [
			'./src/**/*.js',
			'./*.js'
		],
		build: './build/',
		fonts: client + 'fonts/**/*.*',
		images: client + 'images/**/*.*',
		index: client + 'index.html',
		less: client + 'styles/styles.less',
		server: server,
		temp: './.tmp/',

		/**
		 * Browser sync
		 */
		 browserReloadDelay: 1000,

		/**
		 * Node settings
		 */
		defaultPort: 7203,
		nodeServer: './src/server/app.js'
	};

	return config;
};