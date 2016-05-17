var gulp = require('gulp');
var uglify = require('gulp-uglify');//js压缩
var concat = require('gulp-concat');//文件合并
var rename = require('gulp-rename');//文件更名
var notify = require('gulp-notify');//提示信息

gulp.task('default', function() {
    gulp.src([
        "src/State.js",
        "src/math/Matrix.js",
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
        "src/filters/AbstractFilter.js",
        "src/filters/ColorTransformFilter.js",
        "src/filters/GrayFilter.js",
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
