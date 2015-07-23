var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || config.defaultPort;

gulp.task('vet', function() {
	log('Gulp analysis!');

	return gulp
		.src(config.alljs)
		.pipe($.if(args.verbose, $.print()))
		.pipe($.jscs())
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
		.pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function() {
	log('Compiling Less --> CSS');

	return gulp
		.src(config.less)
		.pipe($.plumber())
		.pipe($.less())
		.pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
		.pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function(done) {
	var files = config.temp + '**/*.css';
	clean(files, done);
});

gulp.task('less-watcher', function() {
	gulp.watch([config.less], ['styles']);
});

gulp.task('serve-dev', ['less-watcher'], function() {
	var isDev = true;

	var nodeOptions = {
		script: config.nodeServer,
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV': isDev ? 'dev' : 'build'
		},
		watch: [config.server]
	};

	return $.nodemon(nodeOptions)
		.on('restart', function(ev) {
			log('*** nodemon restarted');
			log('files changed on restart:\n' + ev);
		})
		.on('start', function() {
			log('*** nodemon started');
		})
		.on('crash', function() {
			log('*** nodemon crashed: script crashes for some reason');
		})
		.on('exit', function() {
			log('*** nodemon exited cleanly');
		});
});

/////////////

function clean(path, done) {
	log('Cleaning ' + $.util.colors.blue(path));
	del(path, done);
}

function log(msg) {
	if (typeof (msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.blue(msg[item]));
			}
		}
	} else {
		$.util.log($.util.colors.blue(msg));
	}
}