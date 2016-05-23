/**
 * RenderBuffer Class
 * store draw data, vertex array...
 **/
var RenderBuffer = function(gl) {
    this.gl = gl;

    // max size of vertices
    this.maxVertices = 2000 * 4;
    // max size of indices
    this.maxIndices = 2000 * 6;
    // vertex size
    this.vertSize = 4;

    // current count of vertices
    this.verticesCount = 0;
    // current count of Indices
    this.indicesCount = 0;

    // a array to save draw data, because we just draw once on webgl in the end of the frame
    this.drawData = [];

    // vertex array
    this.vertices = new Float32Array(this.maxVertices * this.vertSize);
    this.vertexBuffer = gl.createBuffer();
    this.indices = new Uint16Array(this.maxIndices);
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
    var vertices_view = this.vertices.subarray(0, this.verticesCount * this.vertSize);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_view, gl.STREAM_DRAW);
    // TODO indices should upload just once
    var indices_view = this.indices.subarray(0, this.indicesCount);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices_view, gl.STATIC_DRAW);
};

/**
 * check is reached max size
 */
RenderBuffer.prototype.reachedMaxSize = function() {
    return (this.verticesCount >= this.maxVertices || this.indicesCount >= this.maxIndices);
};

/**
 * cache draw datas from a displayObject
 */
RenderBuffer.prototype.cache = function(displayObject) {
    var transform = this.transform;

    var coords = displayObject.getCoords();
    var props = displayObject.getProps();
    var indices = displayObject.getIndices();

    this.cacheVerticesAndIndices(coords, props, indices, transform);

    var type = displayObject.type;
    var data = null;
    switch (type) {
        case DISPLAY_TYPE.SPRITE:
            if(displayObject.filters.length > 0 || this.drawData.length == 0 || this.drawData[this.drawData.length - 1].cmd != RENDER_CMD.TEXTURE || this.drawData[this.drawData.length - 1].texture != displayObject.texture) {
                data = displayObject.getDrawData();

                data.cmd = RENDER_CMD.TEXTURE;
                this.drawData.push(data);
            }

            this.drawData[this.drawData.length - 1].count++;

            break;

        case DISPLAY_TYPE.RECT:
            if(displayObject.filters.length > 0 || this.drawData.length == 0 || this.drawData[this.drawData.length - 1].cmd != RENDER_CMD.RECT || this.drawData[this.drawData.length - 1].color != displayObject.color) {
                data = displayObject.getDrawData();

                data.cmd = RENDER_CMD.RECT;
                this.drawData.push(data);
            }

            this.drawData[this.drawData.length - 1].count++;

            break;

        default:
            console.warn("no render type function");
            break;
    }

};

/**
 * cache blend mode
 */
RenderBuffer.prototype.cacheBlendMode = function(blendMode) {
    if(this.drawData.length > 0) {
        var drawState = false;
        for(var i = this.drawData.length - 1; i >= 0; i--) {
            var data = this.drawData[i];

            if(data.cmd != RENDER_CMD.BLEND) {
                drawState = true;// a real draw
            }

            // since last cache has no draw，delete last cache
            if(!drawState && data.cmd == RENDER_CMD.BLEND) {
                this.drawData.splice(i, 1);
                continue;
            }

            // same as last cache, return, nor break
            if(data.cmd == RENDER_CMD.BLEND) {
                if(data.blendMode == blendMode) {
                    return;
                } else {
                    break;
                }
            }
        }
    }

    var data = DrawData.getObject();
    data.cmd = RENDER_CMD.BLEND;
    data.blendMode = blendMode;

    this.drawData.push(data);
}

/**
 * cache filters push
 */
RenderBuffer.prototype.cacheFiltersPush = function(filters, width, height) {
    var data = DrawData.getObject();
    data.cmd = RENDER_CMD.FILTERS_PUSH;

    data.filters = filters;
    data.width = width;
    data.height = height;

    this.drawData.push(data);
}

/**
 * cache filters pop
 */
RenderBuffer.prototype.cacheFiltersPop = function() {
    var data = DrawData.getObject();
    data.cmd = RENDER_CMD.FILTERS_POP;
    this.drawData.push(data);
}

/**
 * help function to cache quad vertices
 */
RenderBuffer.prototype.cacheQuad = function(width, height, transform) {
    var coords = [
        0        , 0         ,
        0 + width, 0         ,
        0 + width, 0 + height,
        0        , 0 + height
    ];
    var props = [
        0, 0,
        1, 0,
        1, 1,
        0, 1
    ];
    var indices = [
        0, 1, 2,
        2, 3, 0
    ];

    this.cacheVerticesAndIndices(coords, props, indices, transform);
}

/**
 * cache vertices and indices data
 * @param coords {number[]} coords array
 * @param props {number[]} props array
 * @param indices {number[]} indices array
 * @param transform {Matrix} global transform
 */
RenderBuffer.prototype.cacheVerticesAndIndices = function(coords, props, indices, transform) {

    // the size of coord
    var coordSize = 2;

    // the size of props
    var propSize = this.vertSize - coordSize;

    // vertex count
    var vertCount = coords.length / coordSize;

    // check size match
    if(vertCount != props.length / propSize) {
        console.log("coords size and props size cannot match!");
        return;
    }

    // set vertices
    var t = transform, x = 0, y = 0;
    for(var i = 0; i < vertCount; i++) {
        // xy
        x = coords[i * coordSize + 0];
        y = coords[i * coordSize + 1];
        this.vertices[(this.verticesCount + i) * this.vertSize + 0] = t.a * x + t.c * y + t.tx;
        this.vertices[(this.verticesCount + i) * this.vertSize + 1] = t.b * x + t.d * y + t.ty;
        // props
        for(var j = 0; j < propSize; j++) {
            this.vertices[(this.verticesCount + i) * this.vertSize + coordSize + j] = props[i * propSize + j];
        }
    }

    // set indices
    for(var i = 0; i < indices.length; i++) {
        this.indices[this.indicesCount + i] = indices[i] + this.verticesCount;
    }

    // add count
    this.verticesCount += vertCount;
    this.indicesCount += indices.length;
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

    this.verticesCount = 0;
    this.indicesCount = 0;
};
