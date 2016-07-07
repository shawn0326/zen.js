/**
 * AsciiShader Class
 **/
var AsciiShader = function(gl) {

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

        'uniform vec2 u_TextureSize;',
        'uniform float pixelSize;',
        'uniform sampler2D u_Sampler;',
        'varying vec2 v_TexCoord;',

        'float character(float n, vec2 p)',
        '{',
            'p = floor(p*vec2(4.0, -4.0) + 2.5);',
            'if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)',
            '{',
                'if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;',
            '}',
            'return 0.0;',
        '}',

        'void main()',
        '{',
            'vec2 uv = v_TexCoord.xy;',

            'vec2 uvPixel = pixelSize / u_TextureSize;',

            'vec3 col = texture2D(u_Sampler, floor( uv / uvPixel) * uvPixel).rgb;',

            'float gray = (col.r + col.g + col.b) / 3.0;',

            'float n =  65536.0;',             // .
            'if (gray > 0.2) n = 65600.0;',    // :
            'if (gray > 0.3) n = 332772.0;',   // *
            'if (gray > 0.4) n = 15255086.0;', // o
            'if (gray > 0.5) n = 23385164.0;', // &
            'if (gray > 0.6) n = 15252014.0;', // 8
            'if (gray > 0.7) n = 13199452.0;', // @
            'if (gray > 0.8) n = 11512810.0;', // #

            'vec2 p = mod( uv / ( uvPixel * 0.5 ), 2.0) - vec2(1.0);',
            'col = col * character(n, p);',

            'gl_FragColor = vec4(col, 1.0);',
        '}'
    ].join("\n");

    AsciiShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

}

// inherit
Util.inherit(AsciiShader, Shader);

/**
 * activate this shader
 **/
AsciiShader.prototype.activate = function(gl, width, height) {

    AsciiShader.superClass.activate.call(this, gl, width, height);

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
 * set texture size
 **/
AsciiShader.prototype.setTextureSize = function(gl, width, height) {
    // sync uniform
    var u_TextureSize = gl.getUniformLocation(this.program, "u_TextureSize");

    gl.uniform2f(u_TextureSize, width, height);
}

/**
 * set pixelSize
 **/
AsciiShader.prototype.setPixelSize = function(gl, size) {
    // sync uniform
    var u_pixelSize = gl.getUniformLocation(this.program, "pixelSize");

    gl.uniform1f(u_pixelSize, size);
}
