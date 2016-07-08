/**
 * BlurShader Class
 **/
function getGaussianDistribution(x, y, rho) {
    var g = 1 / Math.sqrt(2 * 3.141592654 * rho * rho);
    return g * Math.exp( -(x * x + y * y) / (2 * rho * rho) );
}

var BlurShader = function(gl) {

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

    // sample times equals (halfSampleTimes * 2 + 1) * (halfSampleTimes * 2 + 1)
    var halfSampleTimes = 3;

    var totalWeight = 0;
    for(var i = -halfSampleTimes; i <= halfSampleTimes; i++) {
        for(var j = -halfSampleTimes; j <= halfSampleTimes; j++) {
            totalWeight += getGaussianDistribution(i * 3 / halfSampleTimes, j * 3 / halfSampleTimes, 1);
        }
    }

    var blurCode = "";
    for(var i = -halfSampleTimes; i <= halfSampleTimes; i++) {
        for(var j = -halfSampleTimes; j <= halfSampleTimes; j++) {
            blurCode += 'color += texture2D(u_Sampler, vec2(v_TexCoord.x + ' + (i / halfSampleTimes).toFixed(5) + ' * blurUv.x, v_TexCoord.y + ' + (j / halfSampleTimes).toFixed(5) + ' * blurUv.y)) * ' + (getGaussianDistribution(i * 3 / halfSampleTimes, j * 3 / halfSampleTimes, 1) / totalWeight).toFixed(7) + ';\n';
        }
    }

    var fshaderSource = [
        'precision mediump float;',
        'uniform sampler2D u_Sampler;',
        'varying vec2 v_TexCoord;',
        'uniform vec2 u_Blur;',
        'uniform vec2 u_TextureSize;',
        'void main() {',
            'vec2 blurUv = u_Blur / u_TextureSize;',
            'vec4 color = vec4(0.0, 0.0, 0.0, 0.0);',

            '%BLUR_CODE%',

            'gl_FragColor = color;',
        '}'
    ].join("\n").replace('%BLUR_CODE%', blurCode);

    BlurShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

}

// inherit
Util.inherit(BlurShader, Shader);

/**
 * activate this shader
 **/
BlurShader.prototype.activate = function(gl, width, height) {

    BlurShader.superClass.activate.call(this, gl, width, height);

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
 * setBlur
 **/
BlurShader.prototype.setBlur = function(gl, blurX, blurY) {
    // sync uniform
    var u_Blur = gl.getUniformLocation(this.program, "u_Blur");

    gl.uniform2f(u_Blur, blurX, blurY);
}

/**
 * set texture size
 **/
BlurShader.prototype.setTextureSize = function(gl, width, height) {
    // sync uniform
    var u_TextureSize = gl.getUniformLocation(this.program, "u_TextureSize");

    gl.uniform2f(u_TextureSize, width, height);
}
