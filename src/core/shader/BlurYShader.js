/**
 * BlurYShader Class
 **/
var BlurYShader = function(gl) {

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
        'uniform float u_Blur;',
        'uniform vec2 u_TextureSize;',
        'void main() {',
            'const int sampleRadius = 5;',
            'const int samples = sampleRadius * 2 + 1;',
            'vec4 color = vec4(0, 0, 0, 0);',
            'for (int i = -sampleRadius; i <= sampleRadius; i++) {',
                'color += texture2D(u_Sampler, v_TexCoord + vec2(0, float(i) * u_Blur / float(sampleRadius) / u_TextureSize.y));',
            '}',
            'color /= float(samples);',
            'gl_FragColor = color;',
        '}'
    ].join("\n");

    BlurYShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

}

// inherit
Util.inherit(BlurYShader, Shader);

/**
 * activate this shader
 **/
BlurYShader.prototype.activate = function(gl, width, height) {

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
 * setBlurY
 **/
BlurYShader.prototype.setBlurY = function(gl, blur) {
    // sync uniform
    var u_Blur = gl.getUniformLocation(this.program, "u_Blur");

    gl.uniform1f(u_Blur, blur);
}

/**
 * set texture size
 **/
BlurYShader.prototype.setTextureSize = function(gl, width, height) {
    // sync uniform
    var u_TextureSize = gl.getUniformLocation(this.program, "u_TextureSize");

    gl.uniform2f(u_TextureSize, width, height);
}
