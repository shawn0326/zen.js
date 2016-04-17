/**
 * Render Class
 **/
var Render = function(view) {
    // max num of pics the render can draw
    this.size = 2000;
    // canvas
    this.view = view;
    // gl context
    this.gl = view.getContext("webgl");
    // width and height, same with the canvas
    this.width = view.clientWidth;
    this.height = view.clientHeight;
    // a array to save draw data, because we just draw once on webgl in the end of the frame
    this.drawData = [];
    // the num of current bitch pics
    this.currentBitch = 0;
    // create vertices buffer and indices buffer
    this._createBuffer();
    // root render target
    this.rootRenderTarget = new RenderTarget(this.gl, this.width, this.height, true);
    this.activateRenderTarget(this.rootRenderTarget);
}

Object.defineProperties(Render.prototype, {
    /**
     * webgl context
     **/
    context:
    {
        get: function ()
        {
            return this.gl;
        }
    }
});

/**
 * @private
 **/
Render.prototype._createBuffer = function() {
    var gl = this.gl;
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
Render.prototype.activateShader = function(shader) {
    var gl = this.gl;
    gl.useProgram(shader.program);
    // TODO this shit maybe do in a shader or object renderer?
    var a_Position = gl.getAttribLocation(shader.program, "a_Position");
    var a_TexCoord = gl.getAttribLocation(shader.program, "a_TexCoord");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);
    // sync uniform
    shader.syncUniforms(gl, {
        "projection": [this.width / 2, this.height / 2]
    });
}

/**
 * activate a renderTarget
 **/
 Render.prototype.activateRenderTarget = function(renderTarget) {
     var gl = this.gl;
     renderTarget.activate(gl);
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
Render.prototype.drawWebGL = function() {
    var gl = this.gl;
    // this should do just once
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.DEPTH_TEST);
    // update vertices and indices, should set to gl.DINAMIC_DRAW and use bufferSubData function?
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    gl.activeTexture(gl.TEXTURE0);
    for(var i = 0; i < this.currentBitch; i++) {
        gl.bindTexture(gl.TEXTURE_2D, this.drawData[i]);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 6 * 2);
    }
}

/**
 * clear current renderTarget
 **/
Render.prototype.clear = function() {
    var gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
