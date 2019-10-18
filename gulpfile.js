var gulp = require("gulp"),
    stylus = require('gulp-stylus'),
	pug = require('gulp-pug'),
	concatCSS = require('gulp-concat-css'),
	concatJS = require('gulp-concat'),
	browserSync = require('browser-sync'),
	imagemin = require('gulp-tinypng-nokey'),
	del = require('del'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),

	rename = require('gulp-rename'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano');

// postcss. Order does matter.


/*del*/
gulp.task('clean', function () {
	return del.sync('dist');
});

/*fonts*/
gulp.task('fontsdest', function () {
	gulp.src('src/fonts/*')
		.pipe(gulp.dest('dist/fonts'))
});

/*video*/
gulp.task('videodest', function () {
	gulp.src('src/video/*')
		.pipe(gulp.dest('dist/video'))
});

/*css*/
gulp.task('stylus', function () {
	var processors = [
		autoprefixer({browsers: ['last 15 version']}),
	];
	return gulp.src('src/styl/**/*.styl')
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'stylus',
					message: err.message
				};
			})
		}))
		.pipe(stylus())
		.pipe(gulp.dest('src/trash/css'))
		//.pipe(concatCSS('concat-css.css'))
		.pipe(postcss(processors))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('libs-css', function () {
	var processors = [
		autoprefixer({browsers: ['last 15 version']}),
	];
	return gulp.src('src/libs/css/**/*.css')
		.pipe(concatCSS('concat-css-libs.css'))
		.pipe(postcss(processors))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('cssnano', function () {
	var processors = [
		cssnano(),
	];
	return gulp.src('dist/css/**/*.css')
		.pipe(postcss(processors))
		.pipe(gulp.dest('dist/css'))
});


/*js*/
gulp.task('libs-js', function () {
	gulp.src('src/libs/**/*.js')
		.pipe(concatJS('concat-js-libs.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('common-js', function () {
	gulp.src('src/js/**/*.js')
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'js',
					message: err.message
				};
			})
		}))
		.pipe(concatJS('common.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({stream: true}))
});

/*pug*/
gulp.task('pug', function () {
	return gulp.src(['!src/pug-components/**/*.pug', 'src/*.pug'])
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'pug',
					message: err.message
				};
			})
		}))
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({stream: true}))
});

/*img*/
gulp.task('imagemin', function () {
	gulp.src('src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('imgdest', function () {
	gulp.src('src/img/*')
		.pipe(gulp.dest('dist/img'))
});

/*browser-sync*/
gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
});

/*build*/
gulp.task('build', ['imagemin'], function () {

});


gulp.task('watch', ['clean',  'browser-sync', 'pug', 'stylus', 'libs-css', 'libs-js', 'common-js', 'fontsdest', 'videodest', 'imgdest'], function () {
	gulp.watch('src/styl/**/*.styl', ['stylus']);
	gulp.watch('src/**/*.pug', ['pug']);
	gulp.watch('src/libs/css/**/*.css', ['libs-css']);
	gulp.watch('src/libs/**/*.js', ['libs-js']);
	gulp.watch('src/js/**/*.js', ['common-js']);
	gulp.watch('src/img/*', ['imgdest']);
	gulp.watch('src/fonts/*', ['fontsdest']);
	gulp.watch('src/video/*', ['videodest']);
});

