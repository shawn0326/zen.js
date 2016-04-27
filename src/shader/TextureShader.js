/**
 * TextureShader Class
 **/
var TextureShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'attribute vec2 a_TexCoord;',
        'varying vec2 v_TexCoord;',
        'uniform vec2 u_Projection;',
        'uniform mat3 u_Transform;',
        "const vec2 center = vec2(1.0, 1.0);",
        'void main() {',
            'gl_Position = vec4( (u_Transform * vec3(a_Position, 1.0)).xy / u_Projection - center, 0.0, 1.0);',
            'v_TexCoord = a_TexCoord;',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        'uniform sampler2D u_Sampler;',
        'varying  vec2 v_TexCoord;',
        'void main() {',
            'gl_FragColor = texture2D(u_Sampler, v_TexCoord);',
        '}'
    ].join("\n");

    TextureShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);
}

// inherit
Util.inherit(TextureShader, Shader);

/**
 * activate this shader
 **/
TextureShader.prototype.activate = function(gl, width, height) {

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
