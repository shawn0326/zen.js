/**
 * PrimitiveShader Class
 **/
var PrimitiveShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'uniform mat3 u_Projection;',
        'void main() {',
            'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        "uniform vec4 u_Color;",
        'void main() {',
            'gl_FragColor = u_Color;',
        '}'
    ].join("\n");

    PrimitiveShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);
}

// inherit
Util.inherit(PrimitiveShader, Shader);

/**
 * activate this shader
 **/
PrimitiveShader.prototype.activate = function(gl, width, height) {

    PrimitiveShader.superClass.activate.call(this, gl, width, height);

    // set attributes
    var a_Position = gl.getAttribLocation(this.program, "a_Position");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    this.fillColor(gl, 0xFFFF00);
}

/**
 * TODO this should pass by vertices array, delete this function
 * set color
 **/
PrimitiveShader.prototype.fillColor = function(gl, color) {
    // sync uniform
    var u_Color = gl.getUniformLocation(this.program, "u_Color");
    var num = parseInt(color, 10);
    var r = num / (16 * 16 * 16 * 16);
    var g = num % (16 * 16 * 16 * 16) / (16 * 16);
    var b = num % (16 * 16) / 1;
    gl.uniform4f(u_Color, r / 256, g / 256, b / 256, 1.0);
}
