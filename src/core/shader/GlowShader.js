/**
 * GlowShader Class
 **/
var GlowShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'attribute vec2 a_TexCoord;',
        'varying vec2 v_TexCoord;',
        'uniform mat3 u_Projection;',
        'void main() {',
            'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
            'v_TexCoord = a_TexCoord;',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        // 'varying vec2 v_TexCoord;',
        'varying vec2 v_TexCoord;',
        // 'varying vec4 vColor;',

        'uniform sampler2D u_Sampler;',

        'uniform float distance;',
        'uniform float outerStrength;',
        'uniform float innerStrength;',
        'uniform vec4 glowColor;',
        'uniform float pixelWidth;',
        'uniform float pixelHeight;',
        'vec2 px = vec2(1.0 / pixelWidth, 1.0 / pixelHeight);',

        'void main(void) {',
            'const float quality = 8.0;',
            'const float PI = 3.14159265358979323846264;',
            'vec4 ownColor = texture2D(u_Sampler, v_TexCoord);',
            'vec4 curColor;',
            'float totalAlpha = 0.0;',
            'float maxTotalAlpha = 0.0;',
            'float cosAngle;',
            'float sinAngle;',
            'float curDistance = 0.0;',
            'for (float angle = PI * 2.0 / quality; angle <= PI * 2.0; angle += PI * 2.0 / quality) {',
               'cosAngle = cos(angle);',
               'sinAngle = sin(angle);',
               'for (float d = 1.0; d <= quality; d++) {',
                   'curDistance = d * distance / quality;',
                   'curColor = texture2D(u_Sampler, vec2(v_TexCoord.x + cosAngle * curDistance * px.x, v_TexCoord.y + sinAngle * curDistance * px.y));',
                   'totalAlpha += (distance - curDistance) * curColor.a;',
                   'maxTotalAlpha += (distance - curDistance);',
               '}',
            '}',
            'maxTotalAlpha = max(maxTotalAlpha, 0.0001);',

            'ownColor.a = max(ownColor.a, 0.0001);',
            'ownColor.rgb = ownColor.rgb / ownColor.a;',
            'float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);',
            'float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;',
            'vec3 mix1 = mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));',
            'vec3 mix2 = mix(mix1, glowColor.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));',
            'float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);',
            'gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);',
        '}',
    ].join("\n");

    GlowShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

}

// inherit
Util.inherit(GlowShader, Shader);

/**
 * activate this shader
 **/
GlowShader.prototype.activate = function(gl, width, height) {

    GlowShader.superClass.activate.call(this, gl, width, height);

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
    var u_Distance = gl.getUniformLocation(this.program, "distance");

    gl.uniform1f(u_Distance, distance);
}

/**
 * setColor
 **/
GlowShader.prototype.setColor = function(gl, color) {
    // sync uniform
    var u_Color = gl.getUniformLocation(this.program, "glowColor");
    var num = parseInt(color, 10);
    var r = num / (16 * 16 * 16 * 16);
    var g = num % (16 * 16 * 16 * 16) / (16 * 16);
    var b = num % (16 * 16) / 1;
    gl.uniform4f(u_Color, r / 256, g / 256, b / 256, 1.0);
}

/**
 * setOuterStrength
 **/
GlowShader.prototype.setOuterStrength = function(gl, strength) {
    // sync uniform
    var u_Strength = gl.getUniformLocation(this.program, "outerStrength");

    gl.uniform1f(u_Strength, strength);
}

/**
 * setInnerStrength
 **/
GlowShader.prototype.setInnerStrength = function(gl, strength) {
    // sync uniform
    var u_Strength = gl.getUniformLocation(this.program, "innerStrength");

    gl.uniform1f(u_Strength, strength);
}

/**
 * setViewSize
 **/
GlowShader.prototype.setViewSize = function(gl, width, height) {
    // sync uniform
    var u_pixelWidth = gl.getUniformLocation(this.program, "pixelWidth");

    gl.uniform1f(u_pixelWidth, width);

    var u_pixelHeight = gl.getUniformLocation(this.program, "pixelHeight");

    gl.uniform1f(u_pixelHeight, height);
}
