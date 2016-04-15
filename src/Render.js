var Render = function(gl) {
    this.size = 2000;
    this.vertices = new Float32Array(this.size * 4 * 4);
    this.indices = new Uint16Array(this.size * 6);
    this.drawData = [];
    this.currentBitch = 0;
    // create buffer
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
}
Render.prototype.activateShader = function(gl, shader) {
    gl.useProgram(shader.program);
    var a_Position = gl.getAttribLocation(shader.program, "a_Position");
    var a_TexCoord = gl.getAttribLocation(shader.program, "a_TexCoord");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);
    var u_Sampler = gl.getUniformLocation(shader.program, "u_Sampler");
    gl.uniform1i(u_Sampler, 0);
}
Render.prototype.render = function(sprite) {
    var vertices = sprite.getVertices();
    for(var i = 0; i < vertices.length; i++) {
        this.vertices[this.currentBitch * 4 * 4 + i] = vertices[i];
    }

    var indices = sprite.getIndices();
    for(var i = 0; i < indices.length; i++) {
        this.indices[this.currentBitch * 6 + i] = indices[i] + this.currentBitch * 4 * 4;
    }

    this.drawData[this.currentBitch] = sprite.texture;
    this.currentBitch++;
};
Render.prototype.flush = function() {
    this.drawData.length = 0;
    this.currentBitch = 0;
}
Render.prototype.drawWebGL = function(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    gl.activeTexture(gl.TEXTURE0);
    for(var i = 0; i < this.currentBitch; i++) {
        gl.bindTexture(gl.TEXTURE_2D, this.drawData[i]);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 6);
    }
}
