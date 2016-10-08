var gulp = require('gulp');
var sass = require('gulp-sass');
var deploy = require('gulp-gh-pages');
var cred = require('./credentials/credentials.js');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var del = require('del');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var lazypipe = require('lazypipe');

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	})
});

gulp.task('deploy', function() {
	return gulp.src('dist/**/*')
		.pipe(deploy({
			"remoteUrl": "https://" + cred.username + ":" + cred.personalToken + "@github.com/maabrown/personal_site.git"
		}))
});

gulp.task('useref', function() {
	return gulp.src('app/*.html')
		.pipe(useref({}, lazypipe()
							.pipe(sourcemaps.init, { loadMaps: true})
							.pipe(function() {
								return gulpIf('*.js', uglify())
							})
							.pipe(function() {
								return gulpIf('*.css', cleanCSS())
							})
							))
		// .pipe(sourcemaps.init())
		// 	.pipe()
		// 	.pipe()
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
	return gulp.src('app/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
})

gulp.task('clean:dist', function() {
	return del.sync(['dist/**', '!dist']);
});

gulp.task('build', function(callback) {
	runSequence('clean:dist',
		['sass', 'useref', 'images'],
		callback
	)
});

gulp.task('default', function(callback) {
	runSequence(['sass', 'browserSync', 'watch'],
		callback
	)
});