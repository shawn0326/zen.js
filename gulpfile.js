var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var watch = require('gulp-watch');

// base dir of src
var baseDir = "src/";

// name of all in one file
var outputName = "zen";

// src of files
var filesSrc = [
    // core
    "core/base.js",
    "core/const.js",
    "core/math/Matrix.js",
    "core/math/Rectangle.js",
    "core/math/Vec2.js",
    "core/texture/PVRParser.js",
    "core/texture/Texture.js",
    "core/texture/RenderTexture.js",
    "core/render/DrawData.js",
    "core/render/Render.js",
    "core/render/RenderTarget.js",
    "core/render/RenderBuffer.js",
    "core/shader/Shader.js",
    "core/shader/PrimitiveShader.js",
    "core/shader/TextureShader.js",
    "core/shader/ColorTransformShader.js",
    "core/shader/GlowShader.js",
    "core/shader/OutlineShader.js",
    "core/shader/AsciiShader.js",
    "core/shader/PixelateShader.js",
    "core/shader/BlurXShader.js",
    "core/shader/BlurYShader.js",
    "core/shader/BlurShader.js",
    "core/filters/AbstractFilter.js",
    "core/filters/ColorTransformFilter.js",
    "core/filters/GlowFilter.js",
    "core/filters/OutlineFilter.js",
    "core/filters/AsciiFilter.js",
    "core/filters/PixelateFilter.js",
    "core/filters/BlurXFilter.js",
    "core/filters/BlurYFilter.js",
    "core/filters/BlurFilter.js",
    "core/event/EventDispatcher.js",
    "core/event/Event.js",
    "core/event/TouchEvent.js",
    "core/event/LoadEvent.js",
    "core/display/DisplayObject.js",
    "core/display/DisplayObjectContainer.js",
    "core/display/Sprite.js",
    "core/display/Rect.js",
    "core/display/Text.js",
    // extension
    // TODO these js should concat to a independent file
    "extension/State.js",
    "extension/TouchHandler.js",
    "extension/ScreenAdapter.js",
    "extension/Loader.js"
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
