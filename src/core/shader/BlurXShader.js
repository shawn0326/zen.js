/**
 * BlurXShader Class
 **/
var BlurXShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'attribute vec2 a_TexCoord;',
        'varying vec2 v_TexCoord;',
        'uniform vec2 u_Projection;',
        'const vec2 center = vec2(1.0, 1.0);',
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
        'float blurUv = u_Blur / u_TextureSize.x;',
        'void main() {',
            'vec4 color = vec4(0.0, 0.0, 0.0, 0.0);',
            'color += texture2D(u_Sampler, v_TexCoord + vec2(-3. / 3. * blurUv, 0.)) * 0.004431848411938341;',
            'color += texture2D(u_Sampler, v_TexCoord + vec2(-2. / 3. * blurUv, 0.)) * 0.05399096651318985;',
            'color += texture2D(u_Sampler, v_TexCoord + vec2(-1. / 3. * blurUv, 0.)) * 0.2419707245191454;',
            'color += texture2D(u_Sampler, v_TexCoord + vec2( 0. / 3. * blurUv, 0.)) * 0.3989422804014327;',
            'color += texture2D(u_Sampler, v_TexCoord + vec2( 1. / 3. * blurUv, 0.)) * 0.2419707245191454;',
            'color += texture2D(u_Sampler, v_TexCoord + vec2( 2. / 3. * blurUv, 0.)) * 0.05399096651318985;',
            'color += texture2D(u_Sampler, v_TexCoord + vec2( 3. / 3. * blurUv, 0.)) * 0.004431848411938341;',
            'gl_FragColor = color;',
        '}'
    ].join("\n");

    BlurXShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

}

// inherit
Util.inherit(BlurXShader, Shader);

/**
 * activate this shader
 **/
BlurXShader.prototype.activate = function(gl, width, height) {

    BlurXShader.superClass.activate.call(this, gl, width, height);

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
 * setBlurX
 **/
BlurXShader.prototype.setBlurX = function(gl, blur) {
    // sync uniform
    var u_Blur = gl.getUniformLocation(this.program, "u_Blur");

    gl.uniform1f(u_Blur, blur);
}

/**
 * set texture size
 **/
BlurXShader.prototype.setTextureSize = function(gl, width, height) {
    // sync uniform
    var u_TextureSize = gl.getUniformLocation(this.program, "u_TextureSize");

    gl.uniform2f(u_TextureSize, width, height);
}
