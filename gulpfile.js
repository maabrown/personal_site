var gulp = require('gulp');
var sass = require('gulp-sass');
var deploy = require('gulp-gh-pages');
var cred = require('./credentials/credentials.js');
var browserSync = require('browser-sync').create();

gulp.task('hello', function() {
	console.log('Hello Zell');
})

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
})

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
})

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	})
})

gulp.task('deploy', function() {
	return gulp.src('dist/**/*')
		.pipe(deploy({
			"remoteUrl": "https://" + cred.username + ":" + cred.personalToken + "@github.com/maabrown/personal_site.git"
		}))
});