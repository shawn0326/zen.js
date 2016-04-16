/**
 * Shader Class
 **/
var Shader = function(gl, vshader, fshader) {
    this.vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, vshader);
    this.fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    this.program = this._createProgram(gl);
}

/**
 * activate this shader
 **/
Shader.prototype.activate = function(gl) {
    gl.useProgram(this.program);
}

/**
 * @private
 * create a shader program
 **/
Shader.prototype._createProgram = function(gl) {
    // create a program object
    var program = gl.createProgram();
    // attach shaders to program
    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    // link vertex shader and fragment shader
    gl.linkProgram(program);

    return program;
}

/**
 * @private
 * create a shader
 **/
Shader.prototype._loadShader = function(gl, type, source) {
    // create a shader object
    var shader = gl.createShader(type);
    // bind the shader source, source must be string type?
    gl.shaderSource(shader, source);
    // compile shader
    gl.compileShader(shader);
    // if compile failed, log error
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!compiled) {
        console.log("shader not compiled!")
        console.log(gl.getShaderInfoLog(shader))
    }

    return shader;
}
