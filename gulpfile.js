var gulp 					= require('gulp'), 							//Подключение
		sass 					= require('gulp-sass'),					//Sass
		browserSync 	= require('browser-sync'),			//Browser-Sync(Server Auto-Reload)
		concat				= require('gulp-concat'),				//gulp-concat (для конкатенации файлов)
		uglify				=	require('gulp-uglifyjs'),			//gulp-uglifyjs (для сжатия JS)
		cssnano				= require('gulp-cssnano'),			//min CSS
		rename				= require('gulp-rename'),				//Rename
		del						= require('del'),								//Библиотека для удаления файлов и папок
		imagemin			= require('gulp-imagemin'),			//Библиотека для работы с изображениями
		pngquant			=	require('imagemin-pngquant'),	//Библиотека для работы с png
		cache					=	require('gulp-cache'),				//Кеширование
		autoprefixer 	= require('gulp-autoprefixer');	//Автоматическое добавление префиксов

//SASS TO CSS
gulp.task('sass',function(){						// Создаем таск Sass
	return gulp.src('app/sass/**/*.sass')	// Берем источник
		.pipe(sass())												// Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('app/css'))					// Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true}))	// Обновляем CSS на странице при изменении
});

//MIN JS LIBS
gulp.task('scripts', function(){
	return gulp.src([
			//List of JS libs
		//'app/libs/jquery/dist/jquery.min.js'
		])
		.pipe(concat('libs.min.js'))	// Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) 							// Сжимаем JS файл
		.pipe(gulp.dest('app/js'))
})

//MIN CSS LIBS
gulp.task('css-libs', function(){
	return gulp.src([
			//List of CSS libs
		//'app/libs/bootstrap/bootstrap-grid.min.css',
		//'app/libs/font-awesome/css/font-awesome.css'
		])
		.pipe(concat('libs.css'))				// Собираем их в кучу в новом файле libs.css
		.pipe(gulp.dest('app/css'))
		.pipe(cssnano())								// Сжимаем
		.pipe(rename({suffix: '.min'}))	// Добавляем суффикс .min
		.pipe(gulp.dest('app/css'));
});

//BROWSER-SYNC(Server Auto-Reload)
gulp.task('browser-sync', function(){
	browserSync({						// Выполняем browserSync
		server: {							// Определяем параметры сервера
			baseDir: 'app'			// Директория для сервера - app
		},
		notify: false					// Отключаем уведомления
	})
});

//CLEAN
gulp.task('clean', function(){
	return del.sync('dist')	// Удаляем папку dist перед сборкой
});

//CLEAR CACHE IMG
gulp.task('clear', function (callback) {
	return cache.clearAll();
});

//IMG
gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({  			// Сжимаем их с наилучшими настройками с учетом Кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

//CHECK SAVE - LIVE-RELOAD
gulp.task('watch', ['browser-sync','sass', 'css-libs', 'scripts'],function(){
	gulp.watch('app/sass/**/*.sass', ['sass']);				// Наблюдение за sass файлами в папке sass
	gulp.watch('app/*.html', browserSync.reload);			// Наблюдение за HTML файлами в корне проекта
	gulp.watch('app/js**/*.js', browserSync.reload);	// Наблюдение за JS файлами в папке js
});

//FINAL BUILD
gulp.task('build',['clean','img', 'sass', 'scripts'], function() {

	var buildCss = gulp.src('app/css/**/*')			// Переносим библиотеки в продакшен
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*') 			// Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') 			// Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));
});

//Default comand Gulp - Watch
gulp.task('default', ['watch']);