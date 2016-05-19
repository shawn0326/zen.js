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

    // vertex array
    this.vertices = new Float32Array(this.size * 4 * 4);
    this.vertexBuffer = gl.createBuffer();
    this.indices = new Uint16Array(this.size * 6);
    this.indexBuffer = gl.createBuffer();

    // transform
    this.transform = new Matrix();
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
RenderBuffer.prototype.cache = function(displayObject) {
    var gl = this.gl;
    var transform = this.transform;

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
            if(displayObject.filters.length > 0 || this.currentSize == 0 || this.drawData[this.currentSize - 1].renderType != "sprite" || this.drawData[this.currentSize - 1].texture != displayObject.texture) {
                data = displayObject.getDrawData();

                data.renderType = displayObject.renderType;
                this.drawData[this.currentSize] = data;
                this.currentSize++;
            }
            break;

        case "rect":
            if(displayObject.filters.length > 0 || this.currentSize == 0 || this.drawData[this.currentSize - 1].renderType != "rect" || this.drawData[this.currentSize - 1].color != displayObject.color) {
                data = displayObject.getDrawData();

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
 * cache blend mode
 */
RenderBuffer.prototype.cacheBlendMode = function(blendMode) {
    if(this.currentSize > 0) {
        var drawState = false;
        for(var i = this.currentSize - 1; i > 0; i--) {
            var data = this.drawData[i];

            if(data.renderType != "blend") {
                drawState = true;// 存在有效的draw操作
            }

            // since last cache has no draw，delete last cache
            if(!drawState && data.renderType == "blend") {
                this.drawData.splice(i, 1);
                this.currentSize--;
                continue;
            }

            // same as last cache, return, nor break
            if(data.renderType == "blend") {
                if(data.blendMode == blendMode) {
                    return;
                } else {
                    break;
                }
            }
        }
    }

    var data = DrawData.getObject();
    data.renderType = "blend";
    data.blendMode = blendMode;

    this.drawData[this.currentSize] = data;
    this.currentSize++;
}

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
};
