/**
 * GlowShader Class
 **/
var GlowShader = function(gl) {

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
        // todo
    ].join("\n");

    GlowShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

}

// inherit
Util.inherit(GlowShader, Shader);

/**
 * activate this shader
 **/
GlowShader.prototype.activate = function(gl, width, height) {

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
GlowShader.prototype.setDistance = function(gl, distance) {
    // sync uniform
    // todo
}

/**
 * setColor
 **/
GlowShader.prototype.setColor = function(gl, color) {
    // sync uniform
    // todo
}

/**
 * setOuterStrength
 **/
GlowShader.prototype.setOuterStrength = function(gl, color) {
    // sync uniform
    // todo
}

/**
 * setInnerStrength
 **/
GlowShader.prototype.setInnerStrength = function(gl, color) {
    // sync uniform
    // todo
}

/**
 * setViewSize
 **/
GlowShader.prototype.setViewSize = function(gl, color) {
    // sync uniform
    // todo
}
