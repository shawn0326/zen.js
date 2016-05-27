var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');

gulp.task('default', function() {
    gulp.src([
        "src/Const.js",
        "src/State.js",
        "src/math/Matrix.js",
        "src/math/Rectangle.js",
        "src/Util.js",
        "src/render/DrawData.js",
        "src/texture/Texture.js",
        "src/texture/RenderTexture.js",
        "src/render/Render.js",
        "src/render/RenderTarget.js",
        "src/render/RenderBuffer.js",
        "src/shader/Shader.js",
        "src/shader/PrimitiveShader.js",
        "src/shader/TextureShader.js",
        "src/shader/ColorTransformShader.js",
        "src/shader/GrayShader.js",
        "src/shader/BlurXShader.js",
        "src/shader/BlurYShader.js",
        "src/filters/AbstractFilter.js",
        "src/filters/ColorTransformFilter.js",
        "src/filters/GrayFilter.js",
        "src/filters/BlurXFilter.js",
        "src/filters/BlurYFilter.js",
        "src/event/EventDispatcher.js",
        "src/display/DisplayObject.js",
        "src/display/DisplayObjectContainer.js",
        "src/display/Sprite.js",
        "src/display/Rect.js"
    ])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({ message: 'js task ok' }));;
});
