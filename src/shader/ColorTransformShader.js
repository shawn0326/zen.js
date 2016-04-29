/**
 * ColorTransformShader Class
 **/
var ColorTransformShader = function(gl) {

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
        'uniform sampler2D u_Sampler;',
        'varying vec2 v_TexCoord;',
        'uniform mat4 u_Matrix;',
        'void main() {',
            'vec4 color = u_Matrix * texture2D(u_Sampler, v_TexCoord);',
            'gl_FragColor = vec4(color.rgb * color.a, color.a);',
        '}'
    ].join("\n");

    ColorTransformShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    this.transform = new Float32Array(4 * 4);
}

// inherit
Util.inherit(ColorTransformShader, Shader);

/**
 * activate this shader
 **/
ColorTransformShader.prototype.activate = function(gl, width, height) {

    TextureShader.superClass.activate.call(this, gl, width, height);

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
 * set color
 **/
ColorTransformShader.prototype.setMatrix = function(gl, array) {
    // sync uniform
    var u_Matrix = gl.getUniformLocation(this.program, "u_Matrix");

    for(var i = 0; i < array.length; i++) {
        this.transform[i] = array[i];
    }

    gl.uniformMatrix4fv(u_Matrix, false, this.transform);
}
