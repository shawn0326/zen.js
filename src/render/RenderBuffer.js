/**
 * RenderBuffer Class
 * store draw data, vertex array...
 **/
var RenderBuffer = function(gl) {
    this.gl = gl;
    // max num of pics the render can draw
    this.size = 2000;
    // a array to save draw data, because we just draw once on webgl in the end of the frame
    this.drawData = [];
    // the num of current bitch pics
    this.currentBitch = 0;
    // the num of DrawData
    this.currentSize = 0;

    // current state
    this.currentTexture = null;
    this.currentColor = null;

    // vertex array
    this.vertices = new Float32Array(this.size * 4 * 4);
    this.vertexBuffer = gl.createBuffer();
    this.indices = new Uint16Array(this.size * 6);
    this.indexBuffer = gl.createBuffer();
}

/**
 * activate this buffer
 */
RenderBuffer.prototype.activate = function() {
    var gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
};

/**
 * upload vertex data
 */
RenderBuffer.prototype.upload = function() {
    var gl = this.gl;
    // upload vertices and indices, i found that bufferSubData performance bad than bufferData, is that right?
    var vertices_view = this.vertices.subarray(0, this.currentBitch * 4 * 4);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_view, gl.STREAM_DRAW);
    // TODO indices should upload just once
    var indices_view = this.indices.subarray(0, this.currentBitch * 6);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices_view, gl.STATIC_DRAW);
};

/**
 * check is reached max size
 */
RenderBuffer.prototype.reachedMaxSize = function() {
    return this.currentBitch >= this.size;
};

/**
 * cache draw datas from a displayObject
 */
RenderBuffer.prototype.cache = function(displayObject, transform) {
    var gl = this.gl;

    var vertices = displayObject.getVertices(transform);
    for(var i = 0; i < vertices.length; i++) {
        this.vertices[this.currentBitch * 4 * 4 + i] = vertices[i];
    }

    var indices = displayObject.getIndices(transform);
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
 * clear draw datas
 */
RenderBuffer.prototype.clear = function() {
    // return drawData object to pool
    for(var i = 0; i < this.drawData.length; i++) {
        DrawData.returnObject(this.drawData[i]);
    }

    this.drawData.length = 0;
    this.currentBitch = 0;
    this.currentSize = 0;
    this.currentTexture = null;
    this.currentColor = null;
};
