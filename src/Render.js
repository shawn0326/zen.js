/**
 * Render Class
 **/
var Render = function(gl, width, height) {
    // max num of pics the render can draw
    this.size = 2000;
    // width and height, same with the canvas
    this.width = width;
    this.height = height;
    // a array to save draw data, because we just draw once on webgl in the end of the frame
    this.drawData = [];
    // the num of current bitch pics
    this.currentBitch = 0;
    // create vertices buffer and indices buffer
    this._createBuffer(gl);
}

/**
 * @private
 **/
Render.prototype._createBuffer = function(gl) {
    this.vertices = new Float32Array(this.size * 4 * 4);
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    // should set to gl.DINAMIC_DRAW ?
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    // TODO is these indices can be static
    this.indices = new Uint16Array(this.size * 6);
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
}

/**
 * activate a shader
 **/
Render.prototype.activateShader = function(gl, shader) {
    gl.useProgram(shader.program);
    // TODO this shit maybe do in a shader
    var a_Position = gl.getAttribLocation(shader.program, "a_Position");
    var a_TexCoord = gl.getAttribLocation(shader.program, "a_TexCoord");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);
    var u_Sampler = gl.getUniformLocation(shader.program, "u_Sampler");
    gl.uniform1i(u_Sampler, 0);
    var u_projection = gl.getUniformLocation(shader.program, "u_projection");
    // TODO how to set a right matrix? origin point should be top left conner, but now bottom left
    gl.uniformMatrix3fv(u_projection, false, new Float32Array([2/this.width, 0, 0,
                                                            0, 2/this.height, 0,
                                                            -1, -1, 1]));
}

/**
 * not realy render, just cache draw data in this renderer
 **/
Render.prototype.render = function(sprite) {
    var vertices = sprite.getVertices();
    for(var i = 0; i < vertices.length; i++) {
        this.vertices[this.currentBitch * 4 * 4 + i] = vertices[i];
    }
    // this can be static if just draw sprites
    var indices = sprite.getIndices();
    for(var i = 0; i < indices.length; i++) {
        this.indices[this.currentBitch * 6 + i] = indices[i] + this.currentBitch * 4;
    }

    this.drawData[this.currentBitch] = sprite.texture;
    this.currentBitch++;
};

/**
 * flush the render buffer data, should do in the end of the frame
 **/
Render.prototype.flush = function() {
    this.drawData.length = 0;
    this.currentBitch = 0;
}

/**
 * draw into webGL context
 **/
Render.prototype.drawWebGL = function(gl) {
    // this should do just once
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.DEPTH_TEST);

    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    gl.activeTexture(gl.TEXTURE0);
    for(var i = 0; i < this.currentBitch; i++) {
        gl.bindTexture(gl.TEXTURE_2D, this.drawData[i]);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 6 * 2);
    }
}
