/**
 * RenderBuffer Class
 * store draw data, vertex array...
 **/
var RenderBuffer = function(gl) {
    this.gl = gl;

    // current count of vertices
    this.verticesCount = 0;

    // max size of vertices array
    this.maxVerticesIndex = 2000 * 4 * 5;

    // max size of indices array
    this.maxIndicesIndex = 2000 * 6;

    // now index of vertices
    this.verticesIndex = 0;

    // now index of indices
    this.indicesIndex = 0;

    // a array to save draw data, because we just draw once on webgl in the end of the frame
    this.drawData = [];

    // vertex array
    this.vertices = new Float32Array(this.maxVerticesIndex);
    this.vertexBuffer = gl.createBuffer();
    this.indices = new Uint16Array(this.maxIndicesIndex);
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
    var vertices_view = this.vertices.subarray(0, this.verticesIndex);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_view, gl.STREAM_DRAW);
    // TODO indices should upload just once
    var indices_view = this.indices.subarray(0, this.indicesIndex);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices_view, gl.STATIC_DRAW);
};

/**
 * check is reached max size
 */
RenderBuffer.prototype.reachedMaxSize = function(verticesCount, indicesCount) {
    var _verticesCount = verticesCount || 4;
    var _indicesCount = indicesCount || 6;
    return (this.verticesIndex >= this.maxVerticesIndex - _verticesCount || this.indicesIndex >= this.maxIndicesIndex - _indicesCount);
};

/**
 * cache draw datas from a displayObject
 */
RenderBuffer.prototype.cache = function(render, displayObject) {
    var transform = this.transform;

    var coords = displayObject.getCoords();
    var props = displayObject.getProps();
    var indices = displayObject.getIndices();

    this.cacheVerticesAndIndices(render, coords, props, indices, transform);

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

        case DISPLAY_TYPE.TEXT:
            data = displayObject.getDrawData();

            data.cmd = RENDER_CMD.TEXTURE;
            this.drawData.push(data);

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
 * cache mask push
 */
RenderBuffer.prototype.cacheMaskPush = function(mask) {
    var data = DrawData.getObject();
    data.cmd = RENDER_CMD.MASK_PUSH;

    data.mask = mask;

    this.drawData.push(data);
}

/**
 * cache mask pop
 */
RenderBuffer.prototype.cacheMaskPop = function() {
    var data = DrawData.getObject();
    data.cmd = RENDER_CMD.MASK_POP;
    this.drawData.push(data);
}

/**
 * help function to cache quad vertices
 */
RenderBuffer.prototype.cacheQuad = function(render, x, y, width, height, transform) {
    var coords = [
        x        , y         ,
        x + width, y         ,
        x + width, y + height,
        x        , y + height
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

    this.cacheVerticesAndIndices(render, coords, props, indices, transform);
}

/**
 * cache vertices and indices data
 * @param render {Render} if overflow, flush this render
 * @param coords {number[]} coords array
 * @param props {number[]} props array
 * @param indices {number[]} indices array
 * @param transform {Matrix} global transform
 */
RenderBuffer.prototype.cacheVerticesAndIndices = function(render, coords, props, indices, transform) {

    var coordSize = 2,// the size of coord
    coordsLen = coords.length,
    propsLen = props.length,
    indicesLen = indices.length,
    vertCount = coordsLen / coordSize,// vertex count
    propSize = propsLen / vertCount,// the size of props
    vertSize = coordSize + propSize;// the size of one vert

    // check overflow
    if(this.reachedMaxSize(coordsLen + propsLen, indicesLen)) {
        render.flush();
    }

    var verticesCount = this.verticesCount;
    var verticesIndex = this.verticesIndex;
    var indicesIndex = this.indicesIndex;

    // set vertices
    var t = transform, x = 0, y = 0;
    var verticesArray = this.vertices;
    for(var i = 0; i < vertCount; i++) {
        // xy
        x = coords[i * coordSize + 0];
        y = coords[i * coordSize + 1];
        verticesArray[verticesIndex + i * vertSize + 0] = t.a * x + t.c * y + t.tx;
        verticesArray[verticesIndex + i * vertSize + 1] = t.b * x + t.d * y + t.ty;
        // props
        var vertIndex = verticesIndex + i * vertSize + coordSize;
        var propIndex = i * propSize;
        for(var j = 0; j < propSize; j++) {
            verticesArray[vertIndex + j] = props[propIndex + j];
        }
    }

    // set indices
    var indicesArray = this.indices;
    for(var i = 0, l = indicesLen; i < l; i++) {
        indicesArray[indicesIndex + i] = indices[i] + verticesCount;
    }

    // add count
    this.verticesCount += vertCount;
    this.verticesIndex += vertCount * vertSize;
    this.indicesIndex += indicesLen;
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
    this.verticesIndex = 0;
    this.indicesIndex = 0;
};
