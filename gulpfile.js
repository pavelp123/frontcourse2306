const {
	src, dest, watch, series, parallel,
} = require('gulp')
const del = require('del')
const pug = require('gulp-pug')
const sass = require('gulp-sass')(require('sass'))
const gcmq = require('gulp-group-css-media-queries')
const cssNano = require('gulp-cssnano')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const htmlWebp = require('gulp-webp-html-nosvg')
const newer = require('gulp-newer')
const browserSync = require('browser-sync').create()

const path = {
	html: {
		src: 'src/pug',
		dist: 'build',
	},
	css: {
		src: 'src/style',
		dist: 'build',
	},
	js: {
		src: 'src/js',
		dist: 'build',
	},
	img: {
		src: 'src/img',
		dist: 'build/img',
	},
	build: 'build',
	src: 'src',
}

function htmlGenerator() {
	return src(`${path.html.src}/pages/*.pug`)
		.pipe(pug({ pretty: false }))
		.pipe(htmlWebp())
		.pipe(dest(path.html.dist))
		.pipe(browserSync.stream())
}

function styleGenerator() {
	return src(`${path.css.src}/index.scss`)
		.pipe(sass())
		.pipe(gcmq())
		.pipe(cssNano())
		.pipe(rename('style.css'))
		.pipe(dest(path.css.dist))
		.pipe(browserSync.stream())
}

function bandleJsGenerator() {
	return src(`${path.js.src}/**/*.js`)
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(dest(path.js.dist))
		.pipe(browserSync.stream())
}

function imagesConverter() {
	return src(`${path.img.src}/**/*.{jpg,jpeg,png,gif,}`)
		.pipe(newer(path.img.dist))
		.pipe(webp())
		.pipe(src(`${path.img.src}/**/*.{jpg,jpeg,png,gif,}`))
		.pipe(newer(path.img.dist))
		.pipe(imagemin())
		.pipe(src(`${path.img.src}/**/*.{svg,webp}`))
		.pipe(newer(path.img.dist))
		.pipe(dest(path.img.dist))
		.pipe(browserSync.stream())
}

function server() {
	browserSync.init({
		server: {
			baseDir: path.build,
		},
	})

	watch(`${path.src}/**/*.*`).on('change', browserSync.reload)
}

function clear() {
	return del(path.build)
}

function clearImg() {
	return del(`${path.build}/img`)
}

function watcher() {
	watch(`${path.html.src}/**/*.pug`, htmlGenerator)
	watch(`${path.css.src}/**/*.scss`, styleGenerator)
	watch(`${path.img.src}/**/*.*`, series(clearImg, imagesConverter))
	watch(`${path.js.src}/**/*.js`, series(bandleJsGenerator, htmlGenerator, styleGenerator))
}

exports.default = series(
	clear,
	htmlGenerator,
	styleGenerator,
	bandleJsGenerator,
	imagesConverter,
	parallel(server, watcher),
)
