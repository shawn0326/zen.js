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
        'uniform vec4 u_ColorAdd;',
        'void main() {',
            'vec4 texColor = texture2D(u_Sampler, v_TexCoord);',
            'vec4 locColor = texColor * u_Matrix;',
            'if (locColor.a != 0.0) {',
                'locColor += u_ColorAdd * locColor.a;',
            '}',
            'gl_FragColor = locColor;',
        '}'
    ].join("\n");

    ColorTransformShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    this.transform = new Float32Array(4 * 4);

    this.colorAdd = new Float32Array(4);
}

// inherit
Util.inherit(ColorTransformShader, Shader);

/**
 * activate this shader
 **/
ColorTransformShader.prototype.activate = function(gl, width, height) {

    ColorTransformShader.superClass.activate.call(this, gl, width, height);

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
    var u_ColorAdd = gl.getUniformLocation(this.program, "u_ColorAdd");

    // matrix
    this.transform[0] = array[0];
    this.transform[1] = array[1];
    this.transform[2] = array[2];
    this.transform[3] = array[3];

    this.transform[4] = array[5];
    this.transform[5] = array[6];
    this.transform[6] = array[7];
    this.transform[7] = array[8];

    this.transform[8] = array[10];
    this.transform[9] = array[11];
    this.transform[10] = array[12];
    this.transform[11] = array[13];

    this.transform[12] = array[15];
    this.transform[13] = array[16];
    this.transform[14] = array[17];
    this.transform[15] = array[18];

    // color add
    this.colorAdd[0] = array[4] / 255;
    this.colorAdd[1] = array[9] / 255;
    this.colorAdd[2] = array[14] / 255;
    this.colorAdd[3] = array[19] / 255;

    gl.uniformMatrix4fv(u_Matrix, false, this.transform);
    gl.uniform4fv(u_ColorAdd, this.colorAdd);
}
