var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || config.defaultPort;

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

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

gulp.task('scripts', ['clean-scripts'], function() {
	log('Copying & optimizing JS');

	return gulp
		.src(config.js)
		.pipe($.plumber())
		.pipe($.uglify())
		.pipe(gulp.dest(config.temp));
});

gulp.task('styles', ['clean-styles'], function() {
	log('Compiling Less --> CSS & optimizing CSS');

	return gulp
		.src(config.less)
		.pipe($.plumber())
		.pipe($.less())
		.pipe($.csso())
		.pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
		.pipe(gulp.dest(config.temp));
});

gulp.task('fonts', ['clean-fonts'], function() {
	log('Copying fonts');

	return gulp
		.src(config.fonts)
		.pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function() {
	log('Copying and compressing the images');

	return gulp
		.src(config.images)
		.pipe($.imagemin({optimizationLevel: 4}))
		.pipe(gulp.dest(config.build + 'images'));
});

gulp.task('html', ['clean-html'], function() {
	log('Copying HTML files');

	return gulp
		.src(config.index)
		.pipe(gulp.dest(config.build));
});

gulp.task('clean', function(done) {
	var delconfig = [].concat(config.build, config.temp);
	log('cleaning: ' + $.util.colors.blue(delconfig));
	del(delconfig, done);
});

gulp.task('clean-scripts', function(done) {
	clean(config.temp + '**/*.js', done);
});

gulp.task('clean-styles', function(done) {
	clean(config.temp + '**/*.css', done);
});

gulp.task('clean-fonts', function(done) {
	clean(config.build + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function(done) {
	clean(config.temp + 'build/**/*.*', done);
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
			setTimeout(function() {
				browserSync.notify('relaoding now ...');
				browserSync.reload({stream: false});
			}, config.browserReloadDelay);
		})
		.on('start', function() {
			log('*** nodemon started');
			startBrowserSync();
		})
		.on('crash', function() {
			log('*** nodemon crashed: script crashes for some reason');
		})
		.on('exit', function() {
			log('*** nodemon exited cleanly');
		});
});

/////////////

function changeEvent(event) {
	var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
	log('File' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync() {
	if (browserSync.active) {
		return;
	}

	log('Starting browser-sync on port ' + port);

	gulp.watch([config.less], ['styles'])
		.on('change', function(event) { changeEvent(event); });

	var options = {
		proxy: 'localhost:' + port,
		port: 3000,
		files: [
			config.client + '**/*.*',
			'!' + config.less,
			config.temp + '**/*.css'
		],
		ghostNode: {
			clicks: true,
			location: false,
			forms: true,
			scroll: true
		},
		injectChanges: true,
		logFileChanges: true,
		logLevel: 'debug',
		logPrefix: 'gulp-patterns',
		notify: true,
		reloadDelay: 0
	};

	browserSync(options);
}

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