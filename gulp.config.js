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
		less: client + 'styles/styles.less',
		server: server,
		temp: './.tmp/',

		/**
		 * Node settings
		 */
		defaultPort: 7203,
		nodeServer: './src/server/app.js'
	};

	return config;
};