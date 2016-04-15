/**
 * Shader Class
 **/
var Shader = function(gl, vshader, fshader) {
    this.vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, vshader);
    this.fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    this.program = this._createProgram(gl);
}

Shader.prototype.activate = function(gl) {
    gl.useProgram(this.program);
}

Shader.prototype._createProgram = function(gl) {
    var program = gl.createProgram();
    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    gl.linkProgram(program);
    return program;
}

Shader.prototype._loadShader = function(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!compiled) {
        console.log("shader not compiled!")
        console.log(gl.getShaderInfoLog(shader))
    }
    return shader;
}
