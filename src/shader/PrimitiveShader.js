/**
 * PrimitiveShader Class
 **/
var PrimitiveShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'uniform vec2 u_Projection;',
        "const vec2 center = vec2(1.0, 1.0);",
        'void main() {',
            'gl_Position = vec4(a_Position / u_Projection - center, 0.0, 1.0);',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        "const vec4 color = vec4(1.0, 0.0, 0.0, 1.0);",
        'void main() {',
            'gl_FragColor = color;',
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

}
