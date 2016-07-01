/**
 * OutlineShader Class
 **/
var OutlineShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'attribute vec2 a_TexCoord;',
        'varying vec2 v_TexCoord;',
        'uniform vec2 u_Projection;',
        "const vec2 center = vec2(1.0, 1.0);",
        'void main() {',
            'gl_Position = vec4(a_Position / u_Projection - center, 0.0, 1.0);',
            'v_TexCoord = a_TexCoord;',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        // 'varying vec2 v_TexCoord;',
        'varying vec2 v_TexCoord;',
        // 'varying vec4 vColor;',
        'uniform sampler2D u_Sampler;',

        'uniform float thickness;',
        'uniform vec4 outlineColor;',
        'uniform float pixelWidth;',
        'uniform float pixelHeight;',
        'vec2 px = vec2(1. / pixelWidth, 1. / pixelHeight);',

        'void main(void) {',
            'const float quality = 8.;',
            'const float PI = 3.14159265358979323846264;',
            'vec4 ownColor = texture2D(u_Sampler, v_TexCoord);',
            'vec4 curColor;',
            'float maxAlpha = 0.;',
            'for (float angle = 0.; angle < PI * 2.; angle += PI * 2. / quality ) {',
                'curColor = texture2D(u_Sampler, vec2(v_TexCoord.x + thickness * px.x * cos(angle), v_TexCoord.y + thickness * px.y * sin(angle)));',
                'maxAlpha = max(maxAlpha, curColor.a);',
            '}',
            'float resultAlpha = max(maxAlpha, ownColor.a);',
            'gl_FragColor = vec4((ownColor.rgb * (1. - ownColor.a) + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);',
        '}'
    ].join("\n");

    OutlineShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

}

// inherit
Util.inherit(OutlineShader, Shader);

/**
 * activate this shader
 **/
OutlineShader.prototype.activate = function(gl, width, height) {

    BlurYShader.superClass.activate.call(this, gl, width, height);

    // set attributes
    var a_Position = gl.getAttribLocation(this.program, "a_Position");
    var a_TexCoord = gl.getAttribLocation(this.program, "a_TexCoord");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    // sync uniform
    var u_Sampler = gl.getUniformLocation(this.program, "u_Sampler");
    gl.uniform1i(u_Sampler, 0);

}

/**
 * setDistance
 **/
OutlineShader.prototype.setThickness = function(gl, distance) {
    // sync uniform
    var u_Distance = gl.getUniformLocation(this.program, "thickness");

    gl.uniform1f(u_Distance, distance);
}

/**
 * setColor
 **/
OutlineShader.prototype.setColor = function(gl, color) {
    // sync uniform
    var u_Color = gl.getUniformLocation(this.program, "outlineColor");
    var num = parseInt(color, 10);
    var r = num / (16 * 16 * 16 * 16);
    var g = num % (16 * 16 * 16 * 16) / (16 * 16);
    var b = num % (16 * 16) / 1;
    gl.uniform4f(u_Color, r / 256, g / 256, b / 256, 1.0);
}

/**
 * setViewSize
 **/
OutlineShader.prototype.setViewSize = function(gl, width, height) {
    // sync uniform
    var u_pixelWidth = gl.getUniformLocation(this.program, "pixelWidth");

    gl.uniform1f(u_pixelWidth, width);

    var u_pixelHeight = gl.getUniformLocation(this.program, "pixelHeight");

    gl.uniform1f(u_pixelHeight, height);
}
