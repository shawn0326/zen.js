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

    // shader
    this.textureShader = new TextureShader(this.gl);
    this.primitiveShader = new PrimitiveShader(this.gl);
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
    // shader do activate
    shader.activate(gl, this.width, this.height);
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
Render.prototype.render = function(displayObject) {

    var vertices = displayObject.getVertices();
    for(var i = 0; i < vertices.length; i++) {
        this.vertices[this.currentBitch * 4 * 4 + i] = vertices[i];
    }

    var indices = displayObject.getIndices();
    for(var i = 0; i < indices.length; i++) {
        this.indices[this.currentBitch * 6 + i] = indices[i] + this.currentBitch * 4;
    }

    // get a drawData from displayObject
    var data = displayObject.getDrawData();

    if(data) {
        // set render type
        data.renderType = displayObject.renderType;

        this.drawData[this.currentBitch] = data;

        this.currentBitch++;

    }

};

/**
 * flush the render buffer data, should do in the end of the frame
 **/
Render.prototype.flush = function() {

    // return drawData object to pool
    for(var i = 0; i < this.drawData.length; i++) {
        DrawData.returnObject(this.drawData[i]);
    }

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

    for(var i = 0; i < this.currentBitch; i++) {
        var data = this.drawData[i];

        switch (data.renderType) {
            case "sprite":

                this.activateShader(this.textureShader);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, data.texture);

                break;

            case "rect":

                this.activateShader(this.primitiveShader);

                this.primitiveShader.fillColor(gl, data.color);

                break;

            default:
                console.warn("no render type function");
                break;

        }

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
