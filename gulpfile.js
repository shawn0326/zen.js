var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var watch = require('gulp-watch');

// base dir of src
var baseDir = "src/";

// name of all in one file
var outputName = "all";

// src of files
var filesSrc = [
    "Const.js",
    "State.js",
    "math/Matrix.js",
    "math/Rectangle.js",
    "Util.js",
    "TouchHandler.js",
    "texture/Texture.js",
    "texture/RenderTexture.js",
    "render/DrawData.js",
    "render/Render.js",
    "render/RenderTarget.js",
    "render/RenderBuffer.js",
    "shader/Shader.js",
    "shader/PrimitiveShader.js",
    "shader/TextureShader.js",
    "shader/ColorTransformShader.js",
    "shader/GrayShader.js",
    "shader/BlurXShader.js",
    "shader/BlurYShader.js",
    "filters/AbstractFilter.js",
    "filters/ColorTransformFilter.js",
    "filters/GrayFilter.js",
    "filters/BlurXFilter.js",
    "filters/BlurYFilter.js",
    "event/EventDispatcher.js",
    "event/Event.js",
    "event/TouchEvent.js",
    "display/DisplayObject.js",
    "display/DisplayObjectContainer.js",
    "display/Sprite.js",
    "display/Rect.js"
];

for(var i = 0, l = filesSrc.length; i < l; i++) {
    filesSrc[i] = baseDir + filesSrc[i];
}

gulp.task('default', ['build'], function() {
    // do nothing
});

gulp.task("build", function() {
    gulp.src(filesSrc)
    .pipe(concat(outputName + '.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'build success' }));
});

gulp.task("watch", ['build'], function() {
    gulp.watch(filesSrc, ['build']);
});

