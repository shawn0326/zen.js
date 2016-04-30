/**
 * Render Class
 **/
var Render = function(view) {
    // max num of pics the render can draw
    this.size = 2000;
    // canvas
    this.view = view;
    // gl context
    this.gl = view.getContext("webgl", {
        antialias: false, // effect performance!! default false
        // alpha: false, // effect performance, default false
        // premultipliedAlpha: false, // effect performance, default false
        stencil: true
    });
    // width and height, same with the canvas
    this.width = view.clientWidth;
    this.height = view.clientHeight;
    // a array to save draw data, because we just draw once on webgl in the end of the frame
    this.drawData = [];
    // the num of current bitch pics
    this.currentBitch = 0;
    // the num of DrawData
    this.currentSize = 0;
    // create vertices buffer and indices buffer
    this._createBuffer();
    // root render target
    this.rootRenderTarget = new RenderTarget(this.gl, this.width, this.height, true);
    this.currentRenderTarget = null;
    this.activateRenderTarget(this.rootRenderTarget);

    // shader
    this.textureShader = new TextureShader(this.gl);
    this.primitiveShader = new PrimitiveShader(this.gl);
    this.colorTransformShader = new ColorTransformShader(this.gl);
    this.currentShader = null;

    // current state
    this.currentTexture = null;
    this.currentColor = null;

    // init webgl
    var gl = this.gl;
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // console.log(gl.ONE)
    // console.log(gl.SRC_ALPHA)
    // console.log(gl.ONE_MINUS_SRC_ALPHA)
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
    if(this.currentShader == shader) {
        return;
    }

    var gl = this.gl;
    // shader do activate
    shader.activate(gl, this.width, this.height);

    this.currentShader = shader;
}

/**
 * activate a renderTarget
 **/
 Render.prototype.activateRenderTarget = function(renderTarget) {
     var gl = this.gl;
     renderTarget.activate(gl);
     this.currentRenderTarget = renderTarget;
 }

/**
 * not realy render, just cache draw data in this renderer
 **/
Render.prototype.render = function(displayObject) {

    if(this.currentBitch >= this.size) {
        this.flush();
    }

    var vertices = displayObject.getVertices();
    for(var i = 0; i < vertices.length; i++) {
        this.vertices[this.currentBitch * 4 * 4 + i] = vertices[i];
    }

    var indices = displayObject.getIndices();
    for(var i = 0; i < indices.length; i++) {
        this.indices[this.currentBitch * 6 + i] = indices[i] + this.currentBitch * 4;
    }

    var renderType = displayObject.renderType;
    var data = null;
    switch (renderType) {
        case "sprite":
            if(displayObject.filters.length > 0 || displayObject.texture != this.currentTexture) {
                data = displayObject.getDrawData();
                this.currentTexture = displayObject.texture;

                data.renderType = displayObject.renderType;
                this.drawData[this.currentSize] = data;
                this.currentSize++;
            }
            break;

        case "rect":
            if(displayObject.filters.length > 0 || displayObject.color != this.currentColor) {
                data = displayObject.getDrawData();
                this.currentColor = displayObject.color;

                data.renderType = displayObject.renderType;
                this.drawData[this.currentSize] = data;
                this.currentSize++;
            }

            break;

        default:
            console.warn("no render type function");
            break;
    }

    this.currentBitch ++;

    this.drawData[this.currentSize - 1].count ++;

};

/**
 * flush the render buffer data, should do in the end of the frame
 **/
Render.prototype.flush = function() {

    this.drawWebGL();

    // return drawData object to pool
    for(var i = 0; i < this.drawData.length; i++) {
        DrawData.returnObject(this.drawData[i]);
    }

    this.drawData.length = 0;
    this.currentBitch = 0;
    this.currentSize = 0;
    this.currentTexture = null;
    this.currentColor = null;
}

/**
 * draw into webGL context
 **/
Render.prototype.drawWebGL = function() {
    var gl = this.gl;

    // update vertices and indices, should set to gl.DINAMIC_DRAW and use bufferSubData function?
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    var offset = 0;
    for(var i = 0; i < this.currentSize; i++) {
        var data = this.drawData[i];
        var size = data.count;

        switch (data.renderType) {
            case "sprite":
                if(data.filters.length > 0) {
                    // TODO now just last filter works
                    // render should have popFilter and pushFilter function
                    var len = data.filters.length;

                    for(var j = 0; j < len; j++) {
                        data.filters[j].applyFilter(render);
                    }

                } else {
                    this.activateShader(this.textureShader);
                }

                // TODO use more texture unit
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

        gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, offset * 2);

        offset += size * 6;

    }

    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * clear current renderTarget
 **/
Render.prototype.clear = function() {
    var gl = this.gl;
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
