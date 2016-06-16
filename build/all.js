/*
 * render command
 */
var RENDER_CMD = {

    TEXTURE: 0,

    RECT: 1,

    BLEND: 2,

    FILTERS_PUSH: 3,

    FILTERS_POP: 4,

    MASK_PUSH: 5,

    MASK_POP: 6

}

/*
 * display object type
 */
var DISPLAY_TYPE = {

    CONTAINER: 0,

    RECT: 1,

    SPRITE: 2,

    TEXT: 3
}

/*
 * blend mode
 */
var BLEND_MODE = {

    SOURCE_OVER: ["ONE", "ONE_MINUS_SRC_ALPHA"],

    LIGHTER: ["SRC_ALPHA", "ONE"],

    DESTINATION_OUT: ["ZERO", "ONE_MINUS_SRC_ALPHA"],

    DESTINATION_IN: ["ZERO", "SRC_ALPHA"],

    ADD: ["ONE", "DST_ALPHA"],

    MULTIPLY: ["DST_COLOR", "ONE_MINUS_SRC_ALPHA"],

    SCREEN: ["ONE", "ONE_MINUS_SRC_COLOR"]
}

/*
 * resolution policy
 */
var RESOLUTION_POLICY = {

    EXACT_FIT: 0,

    SHOW_ALL: 1,

    NO_BORDER: 2,

    FIXED_WIDTH: 3,

    FIXED_HEIGHT: 4
}
var Util = {

    /**
     * Class inherit
     */

    emptyConstructor: function() {},

    inherit: function(subClass, superClass) {
        Util.emptyConstructor.prototype = superClass.prototype;
        subClass.superClass = superClass.prototype;
        subClass.prototype = new Util.emptyConstructor;
        subClass.prototype.constructor = subClass;
    },

    /**
     * is mobile
     */
    isMobile: function() {
        if (!window["navigator"]) {
            return true;
        }
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
    }

}


var PI = Math.PI;
var HalfPI = PI / 2;
var PacPI = PI + HalfPI;
var TwoPI = PI * 2;
var DEG_TO_RAD = PI / 180;

function cos(angle) {
    switch(angle) {
        case HalfPI:
        case -PacPI:
            return 0;
        case PI:
        case -PI:
            return -1;
        case PacPI:
        case -HalfPI:
            return 0;
        default:
            return Math.cos(angle);
    }
}

function sin(angle) {
    switch (angle) {
        case HalfPI:
        case -PacPI:
            return 1;
        case PI:
        case -PI:
            return 0;
        case PacPI:
        case -HalfPI:
            return -1;
        default:
            return Math.sin(angle);
    }
}

/**
 * Matrix Class
 * Creates a new Matrix object with the specified parameters.
 * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
 * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
 * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
 * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
 * @param tx The distance by which to translate each point along the x axis.
 * @param ty The distance by which to translate each point along the y axis.
 * | a | c | tx|
 * | b | d | ty|
 * | 0 | 0 | 1 |
 **/
var Matrix = function() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
}

Matrix._pool = [];

Matrix.create = function() {
    return matrix = Matrix._pool.pop() || new Matrix();
}

Matrix.release = function(matrix) {
    matrix.identify();
    Matrix._pool.push(matrix);
}

/**
 * identify matrix
 **/
Matrix.prototype.identify = function() {
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
}

/**
 * set the value of matrix
 **/
Matrix.prototype.set = function(a, b, c, d, tx, ty) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
}

/*
 * Applies a rotation transformation to the Matrix object.
 * The rotate() method alters the a, b, c, and d properties of the Matrix object.
 * @param angle The rotation angle in radians.
 */
Matrix.prototype.rotate = function(angle) {
    angle = +angle; // parseFloat
    if(angle !== 0) {
        var u = cos(angle);
        var v = sin(angle);
        var ta = this.a;
        var tb = this.b;
        var tc = this.c;
        var td = this.d;
        var ttx = this.tx;
        var tty = this.ty;
        this.a = ta  * u - tb  * v;
        this.b = ta  * v + tb  * u;
        this.c = tc  * u - td  * v;
        this.d = tc  * v + td  * u;
        this.tx = ttx * u - tty * v;
        this.ty = ttx * v + tty * u;
    }
}

/**
 * Applies a scaling transformation to the matrix. The x axis is multiplied by sx, and the y axis it is multiplied by sy.
 * The scale() method alters the a and d properties of the Matrix object.
 * @param sx A multiplier used to scale the object along the x axis.
 * @param sy A multiplier used to scale the object along the y axis.
 */
Matrix.prototype.scale = function(sx, sy) {
    if(sx !== 1) {
        this.a *= sx;
        this.c *= sx;
        this.tx *= sx;
    }
    if(sy !== 1) {
        this.b *= sy;
        this.d *= sy;
        this.ty *= sy;
    }
}

/**
 * Translates the matrix along the x and y axes, as specified by the dx and dy parameters.
 * @param dx The amount of movement along the x axis to the right, in pixels.
 * @param dy The amount of movement down along the y axis, in pixels.
 */
Matrix.prototype.translate = function(dx, dy) {
    this.tx += dx;
    this.ty += dy;
}

/**
 * append matrix
 **/
Matrix.prototype.append = function(matrix) {
    var ta = this.a;
    var tb = this.b;
    var tc = this.c;
    var td = this.d;
    var ttx = this.tx;
    var tty = this.ty;
    this.a = ta * matrix.a + tc * matrix.b;
    this.b = tb * matrix.a + td * matrix.b;
    this.c = ta * matrix.c + tc * matrix.d;
    this.d = tb * matrix.c + td * matrix.d;
    this.tx = ta * matrix.tx + tc * matrix.ty + ttx;
    this.ty = tb * matrix.tx + td * matrix.ty + tty;
}

/**
 * prepend matrix
 **/
Matrix.prototype.prepend = function(matrix) {
    var ta = this.a;
    var tb = this.b;
    var tc = this.c;
    var td = this.d;
    var ttx = this.tx;
    var tty = this.ty;
    this.a = matrix.a * ta+ matrix.c * tb;
    this.b = matrix.b * ta + matrix.d * tb;
    this.c = matrix.a * tc + matrix.c * td;
    this.d = matrix.b * tc + matrix.d * td;
    this.tx = matrix.a * ttx + matrix.c * tty + matrix.tx;
    this.ty = matrix.b * ttx + matrix.d * tty + matrix.ty;
}

/**
 * copy matrix
 **/
Matrix.prototype.copy = function(matrix) {
    this.a = matrix.a;
    this.b = matrix.b;
    this.c = matrix.c;
    this.d = matrix.d;
    this.tx = matrix.tx;
    this.ty = matrix.ty;
}

/**
 * invert matrix
 **/
Matrix.prototype.invert = function() {
    var a = this.a;
    var b  = this.b;
    var c  = this.c;
    var d = this.d;
    var tx = this.tx;
    var ty = this.ty;
    if (b == 0 && c == 0) {
        this.b = this.c = 0;
        if(a==0||d==0){
            this.a = this.d = this.tx = this.ty = 0;
        }
        else{
            a = this.a = 1 / a;
            d = this.d = 1 / d;
            this.tx = -a * tx;
            this.ty = -d * ty;
        }

        return;
    }
    var determinant = a * d - b * c;
    if (determinant == 0) {
        this.identity();
        return;
    }
    determinant = 1 / determinant;
    var k = this.a =  d * determinant;
    b = this.b = -b * determinant;
    c = this.c = -c * determinant;
    d = this.d =  a * determinant;
    this.tx = -(k * tx + c * ty);
    this.ty = -(b * tx + d * ty);
}

/**
 * Rectangle Class
 */
var Rectangle = function(x, y, width, height) {
    this.set(x, y, width, height);
}

/**
 * set values of this rectangle
 */
Rectangle.prototype.set = function(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
}

/**
 * copy values from other rectangle
 */
Rectangle.prototype.copy = function(rectangle) {
    this.x = rectangle.x;
    this.y = rectangle.y;
    this.width = rectangle.width;
    this.height = rectangle.height;
}

/**
 * is this rectangle contains a point
 */
Rectangle.prototype.contains = function(x, y) {
    return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
}

/**
 * Vec2 Class
 */
var Vec2 = function(x, y) {
    this.set(x, y);
}

/**
 * set values of this vec2
 */
Vec2.prototype.set = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

/**
 * identify matrix
 **/
Vec2.prototype.identify = function() {
    this.set(0, 0);
}

/**
 * copy values from other vec2
 */
Vec2.prototype.copy = function(vec2) {
    this.x = vec2.x;
    this.y = vec2.y;
}

/**
 * transform
 */
Vec2.prototype.transform = function(matrix) {
    var x = this.x;
    var y = this.y;
    this.x = matrix.a * x + matrix.c * y + matrix.tx;
    this.y = matrix.b * x + matrix.d * y + matrix.ty;
}

Vec2._pool = [];

Vec2.create = function() {
    return Vec2._pool.pop() || new Vec2();
}

Vec2.release = function(vec2) {
    vec2.identify();
    vec2._pool.push(matrix);
}

// a temp vec2 used in this framework
Vec2.tempVec2 = new Vec2();

/**
 * If the image size is power of 2
 */
function isPowerOfTwo(n) {
    return (n & (n - 1)) === 0;
}

/**
 * Texture Class
 * webgl texture
 **/
var Texture = function(gl) {
    this.gl = gl;

    this.width = 0;
    this.height = 0;

    this.isInit = false;

    this.glTexture = gl.createTexture();

    // set webgl texture
    gl.bindTexture(gl.TEXTURE_2D, this.glTexture);

    // this can set just as a global props?
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    // set repeat
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // a mipmap optimize
    // if (isPowerOfTwo(this.glTexture.width) && isPowerOfTwo(this.glTexture.height)) {
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    //     gl.generateMipmap(gl.TEXTURE_2D);
    // } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // }
}

/**
 * uploadImage
 * upload a image for this texture
 */
Texture.prototype.uploadImage = function(image, bind) {
    var gl = this.gl;

    if(bind) {
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    this.width = image.width;
    this.height = image.height;

    this.isInit = true;
}

/**
 * get a texture from a image
 */
Texture.fromImage = function(gl, image) {
    var texture = new Texture(gl);
    texture.uploadImage(image);
    return texture;
}

/**
 * get texture from src
 * texture maybe not init util image is loaded
 */
Texture.fromSrc = function(gl, src) {
    var texture = new Texture(gl);

    var image = new Image();
    image.src = src;
    image.onload = function() {
        texture.uploadImage(image, true);
    }

    return texture;
}

/**
 * RenderTexture Class
 * for render target to draw into, can be render as a texture
 **/
var RenderTexture = function(gl, width, height) {

    RenderTexture.superClass.constructor.call(this, gl);

    if(width && height) {
        this.resize(width, height);
    }
}

// inherit
Util.inherit(RenderTexture, Texture);

/**
 * resize this render texture
 * this function will clear color of this texture
 */
RenderTexture.prototype.resize = function(width, height, bind) {
    var gl = this.gl;

    if(bind) {
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    this.width = width;
    this.height = height;

    this.isInit = true;
}

/**
 * DrawData Class
 * describ a draw data
 **/
var DrawData = function() {

    this.cmd = null;

    this.texture = null;

    this.color = 0x000000;

    this.transform = null;

    this.count = 0;

    this.blendMode = "";

    this.filter = null;

    this.mask = null;

};

// draw data object pool
DrawData.pool = [];

// create some draw data
for(var i = 0; i < 300; i++) {
    DrawData.pool.push(new DrawData());
}

DrawData.getObject = function() {
    return DrawData.pool.length > 0 ? DrawData.pool.pop() : new DrawData();
};

DrawData.returnObject = function(drawData) {

    drawData.cmd = null;
    drawData.texture = null;
    drawData.color = 0x000000;
    drawData.transform = null;
    drawData.count = 0;
    drawData.blendMode = "";
    drawData.filter = null;
    drawData.mask = null;

    DrawData.pool.push(drawData);

};
/**
 * Render Class
 **/
var Render = function(view) {
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

    // render target
    this.rootRenderTarget = new RenderTarget(this.gl, this.width, this.height, true);
    this.currentRenderTarget = null;
    this.activateRenderTarget(this.rootRenderTarget);

    // render buffer
    this.rootRenderBuffer = new RenderBuffer(this.gl);
    this.currentRenderBuffer = null;
    this.activateRenderBuffer(this.rootRenderBuffer);

    // shader
    this.textureShader = new TextureShader(this.gl);
    this.primitiveShader = new PrimitiveShader(this.gl);
    this.colorTransformShader = new ColorTransformShader(this.gl);
    this.currentShader = null;

    // draw call count
    this.drawCall = 0;

    this.defaultBlendMode = BLEND_MODE.SOURCE_OVER;

    // filter
    this.filtersStack = [];

    // draw mask count
    this.maskCount = 0;

    // init webgl
    var gl = this.gl;
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    this.setBlendMode(this.defaultBlendMode);
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
 * activate a shader
 **/
Render.prototype.activateShader = function(shader) {
    if(this.currentShader == shader) {
        return;
    }

    var gl = this.gl;
    shader.activate(gl, this.width, this.height);
    this.currentShader = shader;
}

/**
 * activate a renderTarget
 **/
 Render.prototype.activateRenderTarget = function(renderTarget) {
     if(this.currentRenderTarget == renderTarget) {
         return;
     }

     renderTarget.activate();
     this.currentRenderTarget = renderTarget;
 }

 /**
  * activate a renderBuffer
  **/
  Render.prototype.activateRenderBuffer = function(renderBuffer) {
      if(this.currentRenderBuffer == renderBuffer) {
          return;
      }

      renderBuffer.activate();
      this.currentRenderBuffer = renderBuffer;
  }

/**
 * render display object and flush
 **/
Render.prototype.render = function(displayObject) {

    this.drawCall = 0;

    this._render(displayObject);

    this.flush();

    return this.drawCall;

};

/**
 * render display object
 **/
Render.prototype._render = function(displayObject) {

    // if buffer count reached max size, auto flush
    if(this.currentRenderBuffer.reachedMaxSize()) {
        this.flush();
    }

    // save matrix
    var transform = this.currentRenderBuffer.transform;
    var matrix = Matrix.create();
    matrix.copy(transform);

    // transform, use append to add transform matrix
    transform.append(displayObject.getTransformMatrix());

    // if blend, cache blend mode
    if(displayObject.blend != this.defaultBlendMode) {
        this.currentRenderBuffer.cacheBlendMode(displayObject.blend);
    }

    // if filter, pushFilters, identify matrix
    var filterMatrix = null;
    if(displayObject.filters.length > 0) {

        filterMatrix = Matrix.create();
        filterMatrix.copy(transform);
        transform.identify();

        this.currentRenderBuffer.cacheFiltersPush(displayObject.filters, displayObject.width, displayObject.height);
    }

    // TODO if need filter mask, renderTarget should add stencil buffer
    // now use mask and filter at same time will cause bug

    // if mask, pushMask
    if(displayObject.mask) {
        // TODO handle mask
        var mask = displayObject.mask;

        if(this.currentRenderBuffer.reachedMaxSize()) {
            this.flush();
        }

        this.currentRenderBuffer.cacheQuad(mask.x, mask.y, mask.width, mask.height, transform);

        this.currentRenderBuffer.cacheMaskPush(displayObject.mask);
    }

    if(displayObject.type == DISPLAY_TYPE.CONTAINER) {// cache children

        // if cacheAsBitmap

        // if not init
        // change target, identify matrix

        var len = displayObject.children.length;
        for(var i = 0; i < len; i++) {
            var child = displayObject.children[i];
            this._render(child);
        }

        // render renderTexture

    } else {
        // cache display object
        this.currentRenderBuffer.cache(displayObject);
    }

    // if blend, reset blend mode
    if(displayObject.blend != this.defaultBlendMode) {
        this.currentRenderBuffer.cacheBlendMode(this.defaultBlendMode);
    }

    // if mask, popMask
    if(displayObject.mask) {
        // TODO handle mask
        var mask = displayObject.mask;

        if(this.currentRenderBuffer.reachedMaxSize()) {
            this.flush();
        }

        this.currentRenderBuffer.cacheQuad(mask.x, mask.y, mask.width, mask.height, transform);

        this.currentRenderBuffer.cacheMaskPop();
    }

    // if filter, popFilters, restoreMatrix
    if(displayObject.filters.length > 0) {

        for(var i = 0; i < displayObject.filters.length - 1; i++) {

            if(this.currentRenderBuffer.reachedMaxSize()) {
                this.flush();
            }

            this.currentRenderBuffer.cacheQuad(0, 0, displayObject.width, displayObject.height, transform);
        }

        transform.copy(filterMatrix);
        Matrix.release(filterMatrix);

        if(this.currentRenderBuffer.reachedMaxSize()) {
            this.flush();
        }

        // last time, push vertices by real transform
        this.currentRenderBuffer.cacheQuad(0, 0, displayObject.width, displayObject.height, transform);

        this.currentRenderBuffer.cacheFiltersPop();
    }

    // restore matrix
    transform.copy(matrix);
    Matrix.release(matrix);
};

/**
 * flush the render buffer data, should do in the end of the frame
 **/
Render.prototype.flush = function() {

    this.drawWebGL();

    this.currentRenderBuffer.clear();
}

/**
 * draw into webGL context
 **/
Render.prototype.drawWebGL = function() {
    var gl = this.gl;

    this.currentRenderBuffer.upload();

    var offset = 0;
    var drawData = this.currentRenderBuffer.drawData;
    var currentSize = drawData.length;
    for(var i = 0; i < currentSize; i++) {
        var data = drawData[i];

        switch (data.cmd) {
            case RENDER_CMD.TEXTURE:

                var size = data.count;
                // is texture not loaded skip render
                if(data.texture && data.texture.isInit) {

                    this.activateShader(this.textureShader);

                    // TODO use more texture unit
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, data.texture.glTexture);

                    gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, offset * 2);

                    // count draw call if texture not exist?
                    this.drawCall++;
                }

                offset += size * 6;

                break;

            case RENDER_CMD.RECT:

                var size = data.count;

                this.activateShader(this.primitiveShader);

                this.primitiveShader.fillColor(gl, data.color);

                gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, offset * 2);

                this.drawCall++;

                offset += size * 6;

                break;

            case RENDER_CMD.BLEND:

                var blendMode = data.blendMode;

                // set blendMode
                this.setBlendMode(blendMode);

                break;

            case RENDER_CMD.FILTERS_PUSH:

                // get filters
                var filters = data.filters;

                // the root of this stack
                // after all, we must draw to the stage
                if(this.filtersStack.length == 0) {
                    this.filtersStack.push({
                        filters: null,
                        renderTarget: this.currentRenderTarget
                    });
                }

                // create a render target for filters
                // this render target will store the render result of prev filters
                // and as a input of this filters
                var renderTarget = RenderTarget.create(this.gl, data.width, data.height);

                // push filters data
                this.filtersStack.push({
                    filters: filters,
                    renderTarget: renderTarget
                });

                // activate this render target, so the object will be rendered to this render target
                // TODO maybe this draw can apply a filter?
                this.activateRenderTarget(renderTarget);

                break;

            case RENDER_CMD.FILTERS_POP:

                var currentData = this.filtersStack.pop();
                var lastData = this.filtersStack[this.filtersStack.length - 1];

                var filters = currentData.filters;
                var len = filters.length;

                var flip = currentData.renderTarget;
                if(len > 1) {

                    for(var j = 0; j < len - 1; j++) {

                        var filter = filters[j];

                        // a temp render target
                        var flop = RenderTarget.create(gl, flip.width, flip.height);

                        offset = filter.applyFilter(this, flip, flop, offset);

                        RenderTarget.release(flip);

                        flip = flop;
                    }

                }

                var filter = filters[filters.length - 1];

                var renderTarget = lastData.renderTarget;

                offset = filter.applyFilter(this, flip, renderTarget, offset);

                // release the render target
                RenderTarget.release(flip);

                break;

            case RENDER_CMD.MASK_PUSH:

                // TODO handle mask push
                var size = 1;

                if(this.maskCount == 0) {
                    gl.enable(gl.STENCIL_TEST);
                    gl.clear(gl.STENCIL_BUFFER_BIT);
                }

                var level = this.maskCount;
                this.maskCount++;

                gl.colorMask(false, false, false, false);
                gl.stencilFunc(gl.EQUAL, level, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

                this.activateShader(this.primitiveShader);

                this.primitiveShader.fillColor(gl, 0x000000);

                gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, offset * 2);

                gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                gl.colorMask(true, true, true, true);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

                this.drawCall++;

                offset += size * 6;

                break;

            case RENDER_CMD.MASK_POP:

                // TODO handle mask pop
                var size = 1;

                var level = this.maskCount;
                this.maskCount--;

                gl.colorMask(false, false, false, false);
                gl.stencilFunc(gl.EQUAL, level, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);

                this.activateShader(this.primitiveShader);

                this.primitiveShader.fillColor(gl, 0x000000);

                gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, offset * 2);

                gl.stencilFunc(gl.EQUAL, level - 1, 0xFF);
                gl.colorMask(true, true, true, true);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

                if(this.maskCount == 0) {
                    gl.disable(gl.STENCIL_TEST);
                }

                this.drawCall++;

                offset += size * 6;

                break;

            default:
                console.warn("no render type function!");
                break;

        }

    }

    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * apply filter
 */
Render.prototype.applyFilter = function(filter, input, output, offset) {
    var gl = this.gl;

    this.activateRenderTarget(output);

    var size = 1;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, input.texture.glTexture);
    gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, offset * 2);
    this.drawCall++;

    offset += size * 6;

    return offset;
}

/**
 * set blend mode
 */
Render.prototype.setBlendMode = function(blendMode) {
    var gl = this.gl;

    if(blendMode && blendMode.length == 2) {
        gl.blendFunc(gl[blendMode[0]], gl[blendMode[1]]);
    } else {
        console.log("blend mode not found!");
    }
}

/**
 * clear current renderTarget
 **/
Render.prototype.clear = function() {
    this.currentRenderTarget.clear();
}

/**
 * RenderTarget Class
 **/
var RenderTarget = function(gl, width, height, root) {
    this.gl = gl;
    // boolean type, if root is false, bind frame buffer
    this.root = root;
    // frame buffer
    this.frameBuffer = null;
    // the texture
    this.texture = null;
    // size
    this.width = width;
    this.height = height;
    // clear color
    this.clearColor = [0.0, 0.0, 0.0, 0.0];

    if(!this.root) {

        this.frameBuffer = gl.createFramebuffer();

        /*
            A frame buffer needs a target to render to..
            create a texture and bind it attach it to the framebuffer..
         */

        this.texture = new RenderTexture(gl, width, height);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.glTexture, 0);
    }
}

RenderTarget._pool = [];

RenderTarget.create = function(gl, width, height) {
    var renderTarget = RenderTarget._pool.pop();
    if(renderTarget) {
        if(renderTarget.width == width && renderTarget.height == height) {
            renderTarget.clear(true);// if size is right, just clear
        } else {
            renderTarget.resize(width, height);
        }

        return renderTarget;
    } else {
        return new RenderTarget(gl, width, height);
    }
}

RenderTarget.release = function(renderTarget) {
    // should resize to save memory?
    // renderTarget.resize(3, 3);
    RenderTarget._pool.push(renderTarget);
}

// TODO clear function

/**
 * resize render target
 * so we can recycling a render buffer
 */
RenderTarget.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    // resize texture
    this.texture.resize(width, height, true);
}

/**
 * clear render target
 */
RenderTarget.prototype.clear = function(bind) {
    var gl = this.gl;

    if(bind) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    }

    gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

/**
 * TODO Binds the stencil buffer.
 *
 */
RenderTarget.prototype.attachStencilBuffer = function() {

}

/**
 * Binds the buffers
 *
 */
RenderTarget.prototype.activate = function() {
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
};

/**
 * destroy
 */
RenderTarget.prototype.destroy = function() {
    // TODO destroy
};

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
    return (this.verticesCount >= this.maxVertices - 4 || this.indicesCount >= this.maxIndices - 6);// TODO minus max num buffer can cache
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
RenderBuffer.prototype.cacheQuad = function(x, y, width, height, transform) {
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

    var verticesCount = this.verticesCount;
    var indicesCount = this.indicesCount;

    // set vertices
    var t = transform, x = 0, y = 0;
    var verticesArray = this.vertices;
    var vertSize = this.vertSize;
    for(var i = 0; i < vertCount; i++) {
        // xy
        x = coords[i * coordSize + 0];
        y = coords[i * coordSize + 1];
        verticesArray[(verticesCount + i) * vertSize + 0] = t.a * x + t.c * y + t.tx;
        verticesArray[(verticesCount + i) * vertSize + 1] = t.b * x + t.d * y + t.ty;
        // props
        var vertIndex = (verticesCount + i) * vertSize + coordSize;
        var propIndex = i * propSize;
        for(var j = 0; j < propSize; j++) {
            verticesArray[vertIndex + j] = props[propIndex + j];
        }
    }

    // set indices
    var indicesArray = this.indices;
    for(var i = 0, l = indices.length; i < l; i++) {
        indicesArray[indicesCount + i] = indices[i] + verticesCount;
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

/**
 * Shader Class
 **/
var Shader = function(gl, vshader, fshader) {

    // shader source, diffrent shader has diffrent shader source
    // vshader and fshader source should passed by subclass

    this.vshaderSource = vshader;

    this.fshaderSource = fshader;

    // create program

    this.vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);
    this.fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);
    this.program = this._createProgram(gl);
}

/**
 * activate this shader
 * TODO create a VAO object
 **/
Shader.prototype.activate = function(gl, width, height) {
    gl.useProgram(this.program);

    // set projection
    // we should let every shader has a u_Projection uniform
    var u_Projection = gl.getUniformLocation(this.program, "u_Projection");
    // TODO how to set a right matrix? origin point should be top left conner, but now bottom left
    gl.uniform2f(u_Projection, width / 2, height / 2);
}

/**
 * set transform
 **/
// Shader.prototype.setTransform = function(gl, array) {
//     // set transform
//     var u_Transform = gl.getUniformLocation(this.program, "u_Transform");
//     gl.uniformMatrix3fv(u_Transform, false, array);
// }

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

/**
 * PrimitiveShader Class
 **/
var PrimitiveShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'uniform vec2 u_Projection;',
        "const vec2 center = vec2(1.0, 1.0);",
        'void main() {',
            'gl_Position = vec4(a_Position / u_Projection - center, 0.0, 1.0);',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        "uniform vec4 u_Color;",
        'void main() {',
            'gl_FragColor = u_Color;',
        '}'
    ].join("\n");

    PrimitiveShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);
}

// inherit
Util.inherit(PrimitiveShader, Shader);

/**
 * activate this shader
 **/
PrimitiveShader.prototype.activate = function(gl, width, height) {

    PrimitiveShader.superClass.activate.call(this, gl, width, height);

    // set attributes
    var a_Position = gl.getAttribLocation(this.program, "a_Position");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    this.fillColor(gl, 0xFFFF00);
}

/**
 * TODO this should pass by vertices array, delete this function
 * set color
 **/
PrimitiveShader.prototype.fillColor = function(gl, color) {
    // sync uniform
    var u_Color = gl.getUniformLocation(this.program, "u_Color");
    var num = parseInt(color, 10);
    var r = num / (16 * 16 * 16 * 16);
    var g = num % (16 * 16 * 16 * 16) / (16 * 16);
    var b = num % (16 * 16) / 1;
    gl.uniform4f(u_Color, r / 256, g / 256, b / 256, 1.0);
}

/**
 * TextureShader Class
 **/
var TextureShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'attribute vec2 a_TexCoord;',
        'varying vec2 v_TexCoord;',
        'uniform vec2 u_Projection;',
        "const vec2 center = vec2(1.0, 1.0);",
        'void main() {',
            'gl_Position = vec4(a_Position / u_Projection - center, 0.0, 1.0);',
            'v_TexCoord = a_TexCoord;',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        'uniform sampler2D u_Sampler;',
        'varying vec2 v_TexCoord;',
        'void main() {',
            'gl_FragColor = texture2D(u_Sampler, v_TexCoord);',
        '}'
    ].join("\n");

    TextureShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);
}

// inherit
Util.inherit(TextureShader, Shader);

/**
 * activate this shader
 **/
TextureShader.prototype.activate = function(gl, width, height) {

    TextureShader.superClass.activate.call(this, gl, width, height);

    // set attributes
    var a_Position = gl.getAttribLocation(this.program, "a_Position");
    var a_TexCoord = gl.getAttribLocation(this.program, "a_TexCoord");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    // sync uniform
    var u_Sampler = gl.getUniformLocation(this.program, "u_Sampler");
    gl.uniform1i(u_Sampler, 0);

}

/**
 * ColorTransformShader Class
 **/
var ColorTransformShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'attribute vec2 a_TexCoord;',
        'varying vec2 v_TexCoord;',
        'uniform vec2 u_Projection;',
        "const vec2 center = vec2(1.0, 1.0);",
        'void main() {',
            'gl_Position = vec4(a_Position / u_Projection - center, 0.0, 1.0);',
            'v_TexCoord = a_TexCoord;',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        'uniform sampler2D u_Sampler;',
        'varying vec2 v_TexCoord;',
        'uniform mat4 u_Matrix;',
        'uniform vec4 u_ColorAdd;',
        'void main() {',
            'vec4 texColor = texture2D(u_Sampler, v_TexCoord);',
            'vec4 locColor = texColor * u_Matrix;',
            'if (locColor.a != 0.0) {',
                'locColor += u_ColorAdd * locColor.a;',
            '}',
            'gl_FragColor = locColor;',
        '}'
    ].join("\n");

    ColorTransformShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    this.transform = new Float32Array(4 * 4);

    this.colorAdd = new Float32Array(4);
}

// inherit
Util.inherit(ColorTransformShader, Shader);

/**
 * activate this shader
 **/
ColorTransformShader.prototype.activate = function(gl, width, height) {

    ColorTransformShader.superClass.activate.call(this, gl, width, height);

    // set attributes
    var a_Position = gl.getAttribLocation(this.program, "a_Position");
    var a_TexCoord = gl.getAttribLocation(this.program, "a_TexCoord");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    // sync uniform
    var u_Sampler = gl.getUniformLocation(this.program, "u_Sampler");
    gl.uniform1i(u_Sampler, 0);

}

/**
 * set color
 **/
ColorTransformShader.prototype.setMatrix = function(gl, array) {
    // sync uniform
    var u_Matrix = gl.getUniformLocation(this.program, "u_Matrix");
    var u_ColorAdd = gl.getUniformLocation(this.program, "u_ColorAdd");

    // matrix
    this.transform[0] = array[0];
    this.transform[1] = array[1];
    this.transform[2] = array[2];
    this.transform[3] = array[3];

    this.transform[4] = array[5];
    this.transform[5] = array[6];
    this.transform[6] = array[7];
    this.transform[7] = array[8];

    this.transform[8] = array[10];
    this.transform[9] = array[11];
    this.transform[10] = array[12];
    this.transform[11] = array[13];

    this.transform[12] = array[15];
    this.transform[13] = array[16];
    this.transform[14] = array[17];
    this.transform[15] = array[18];

    // color add
    this.colorAdd[0] = array[4] / 255;
    this.colorAdd[1] = array[9] / 255;
    this.colorAdd[2] = array[14] / 255;
    this.colorAdd[3] = array[19] / 255;

    gl.uniformMatrix4fv(u_Matrix, false, this.transform);
    gl.uniform4fv(u_ColorAdd, this.colorAdd);
}

/**
 * GrayShader Class
 **/
var GrayShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'attribute vec2 a_TexCoord;',
        'varying vec2 v_TexCoord;',
        'uniform vec2 u_Projection;',
        "const vec2 center = vec2(1.0, 1.0);",
        'void main() {',
            'gl_Position = vec4(a_Position / u_Projection - center, 0.0, 1.0);',
            'v_TexCoord = a_TexCoord;',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        'uniform sampler2D u_Sampler;',
        'varying vec2 v_TexCoord;',
        'void main() {',
            'vec4 color = texture2D(u_Sampler, v_TexCoord);',
            'float gray = (color.r + color.g + color.b) / 3.0;',
            'gl_FragColor = vec4(gray, gray, gray, color.a);',
        '}'
    ].join("\n");

    GrayShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

}

// inherit
Util.inherit(GrayShader, Shader);

/**
 * activate this shader
 **/
GrayShader.prototype.activate = function(gl, width, height) {

    GrayShader.superClass.activate.call(this, gl, width, height);

    // set attributes
    var a_Position = gl.getAttribLocation(this.program, "a_Position");
    var a_TexCoord = gl.getAttribLocation(this.program, "a_TexCoord");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    // sync uniform
    var u_Sampler = gl.getUniformLocation(this.program, "u_Sampler");
    gl.uniform1i(u_Sampler, 0);

}

/**
 * BlurXShader Class
 **/
var BlurXShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'attribute vec2 a_TexCoord;',
        'varying vec2 v_TexCoord;',
        'uniform vec2 u_Projection;',
        "const vec2 center = vec2(1.0, 1.0);",
        'void main() {',
            'gl_Position = vec4(a_Position / u_Projection - center, 0.0, 1.0);',
            'v_TexCoord = a_TexCoord;',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        'uniform sampler2D u_Sampler;',
        'varying vec2 v_TexCoord;',
        'uniform float u_Blur;',
        'uniform vec2 u_TextureSize;',
        'void main() {',
            'const int sampleRadius = 5;',
            'const int samples = sampleRadius * 2 + 1;',
            'vec4 color = vec4(0, 0, 0, 0);',
            'for (int i = -sampleRadius; i <= sampleRadius; i++) {',
                'color += texture2D(u_Sampler, v_TexCoord + vec2(float(i) * u_Blur / float(sampleRadius) / u_TextureSize.x, 0));',
            '}',
            'color /= float(samples);',
            'gl_FragColor = color;',
        '}'
    ].join("\n");

    BlurXShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

}

// inherit
Util.inherit(BlurXShader, Shader);

/**
 * activate this shader
 **/
BlurXShader.prototype.activate = function(gl, width, height) {

    BlurXShader.superClass.activate.call(this, gl, width, height);

    // set attributes
    var a_Position = gl.getAttribLocation(this.program, "a_Position");
    var a_TexCoord = gl.getAttribLocation(this.program, "a_TexCoord");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    // sync uniform
    var u_Sampler = gl.getUniformLocation(this.program, "u_Sampler");
    gl.uniform1i(u_Sampler, 0);

}

/**
 * setBlurX
 **/
BlurXShader.prototype.setBlurX = function(gl, blur) {
    // sync uniform
    var u_Blur = gl.getUniformLocation(this.program, "u_Blur");

    gl.uniform1f(u_Blur, blur);
}

/**
 * set texture size
 **/
BlurXShader.prototype.setTextureSize = function(gl, width, height) {
    // sync uniform
    var u_TextureSize = gl.getUniformLocation(this.program, "u_TextureSize");

    gl.uniform2f(u_TextureSize, width, height);
}

/**
 * BlurYShader Class
 **/
var BlurYShader = function(gl) {

    var vshaderSource = [
        'attribute vec2 a_Position;',
        'attribute vec2 a_TexCoord;',
        'varying vec2 v_TexCoord;',
        'uniform vec2 u_Projection;',
        "const vec2 center = vec2(1.0, 1.0);",
        'void main() {',
            'gl_Position = vec4(a_Position / u_Projection - center, 0.0, 1.0);',
            'v_TexCoord = a_TexCoord;',
        '}'
    ].join("\n");

    var fshaderSource = [
        'precision mediump float;',
        'uniform sampler2D u_Sampler;',
        'varying vec2 v_TexCoord;',
        'uniform float u_Blur;',
        'uniform vec2 u_TextureSize;',
        'void main() {',
            'const int sampleRadius = 5;',
            'const int samples = sampleRadius * 2 + 1;',
            'vec4 color = vec4(0, 0, 0, 0);',
            'for (int i = -sampleRadius; i <= sampleRadius; i++) {',
                'color += texture2D(u_Sampler, v_TexCoord + vec2(0, float(i) * u_Blur / float(sampleRadius) / u_TextureSize.y));',
            '}',
            'color /= float(samples);',
            'gl_FragColor = color;',
        '}'
    ].join("\n");

    BlurYShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

}

// inherit
Util.inherit(BlurYShader, Shader);

/**
 * activate this shader
 **/
BlurYShader.prototype.activate = function(gl, width, height) {

    BlurYShader.superClass.activate.call(this, gl, width, height);

    // set attributes
    var a_Position = gl.getAttribLocation(this.program, "a_Position");
    var a_TexCoord = gl.getAttribLocation(this.program, "a_TexCoord");
    var FSIZE = 4;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    // sync uniform
    var u_Sampler = gl.getUniformLocation(this.program, "u_Sampler");
    gl.uniform1i(u_Sampler, 0);

}

/**
 * setBlurY
 **/
BlurYShader.prototype.setBlurY = function(gl, blur) {
    // sync uniform
    var u_Blur = gl.getUniformLocation(this.program, "u_Blur");

    gl.uniform1f(u_Blur, blur);
}

/**
 * set texture size
 **/
BlurYShader.prototype.setTextureSize = function(gl, width, height) {
    // sync uniform
    var u_TextureSize = gl.getUniformLocation(this.program, "u_TextureSize");

    gl.uniform2f(u_TextureSize, width, height);
}

/**
 * abstract filter
 **/
var AbstractFilter = function(gl) {

    //  a shader to render this filter
    this.shader = null;

}

// render apply this filter
AbstractFilter.prototype.applyFilter = function(render, input, output, offset) {

    // use shader

    // apply filter
    offset = render.applyFilter(this, input, output, offset);

    // return draw offset
    return offset;

}

/**
 * color transform filter
 **/
var ColorTransformFilter = function(gl) {

    this.shader = new ColorTransformShader(gl);

    // color transform matrix
    this.matrix = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ];

}

Util.inherit(ColorTransformFilter, AbstractFilter);

ColorTransformFilter.prototype.reset = function() {
    this.matrix = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Adjusts brightness
 *
 * @param b {number} value of the brigthness (0 is black)
 */
ColorTransformFilter.prototype.brightness = function(b) {
    this.matrix = [
        b, 0, 0, 0, 0,
        0, b, 0, 0, 0,
        0, 0, b, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Set the matrices in grey scales
 *
 * @param scale {number} value of the grey (0 is black)
 */
ColorTransformFilter.prototype.grayScale = function(scale) {
    this.matrix = [
        scale, scale, scale, 0, 0,
        scale, scale, scale, 0, 0,
        scale, scale, scale, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Set the black and white matrice
 * Multiply the current matrix
 *
 * @param multiply {boolean} refer to ._loadMatrix() method
 */
ColorTransformFilter.prototype.blackAndWhite = function(b) {
    this.matrix = [
        0.3, 0.6, 0.1, 0, 0,
        0.3, 0.6, 0.1, 0, 0,
        0.3, 0.6, 0.1, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Set the hue property of the color
 *
 * @param rotation {number} in degrees
 */
ColorTransformFilter.prototype.hue = function(rotation) {
    rotation = (rotation || 0) / 180 * Math.PI;
    var cos = Math.cos(rotation),
        sin = Math.sin(rotation);

    // luminanceRed, luminanceGreen, luminanceBlue
    var lumR = 0.213, // or 0.3086
        lumG = 0.715, // or 0.6094
        lumB = 0.072; // or 0.0820

    this.matrix = [
        lumR + cos * (1 - lumR) + sin * (-lumR), lumG + cos * (-lumG) + sin * (-lumG), lumB + cos * (-lumB) + sin * (1 - lumB), 0, 0,
        lumR + cos * (-lumR) + sin * (0.143), lumG + cos * (1 - lumG) + sin * (0.140), lumB + cos * (-lumB) + sin * (-0.283), 0, 0,
        lumR + cos * (-lumR) + sin * (-(1 - lumR)), lumG + cos * (-lumG) + sin * (lumG), lumB + cos * (1 - lumB) + sin * (lumB), 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Set the contrast matrix, increase the separation between dark and bright
 * Increase contrast : shadows darker and highlights brighter
 * Decrease contrast : bring the shadows up and the highlights down
 *
 * @param amount {number} value of the contrast
 */
ColorTransformFilter.prototype.contrast = function(amount) {
    var v = (amount || 0) + 1;
    var o = -128 * (v - 1);

    this.matrix = [
        v, 0, 0, 0, o,
        0, v, 0, 0, o,
        0, 0, v, 0, o,
        0, 0, 0, 1, 0
    ];
}

/**
 * Set the saturation matrix, increase the separation between colors
 * Increase saturation : increase contrast, brightness, and sharpness
 *
 * @param [amount=0] {number}
 */
ColorTransformFilter.prototype.saturate = function(amount) {
    var x = (amount || 0) * 2 / 3 + 1;
    var y = ((x - 1) * -0.5);

    this.matrix = [
        x, y, y, 0, 0,
        y, x, y, 0, 0,
        y, y, x, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Desaturate image (remove color)
 *
 * Call the saturate function
 *
 */
ColorTransformFilter.prototype.desaturate = function(amount) {
    this.saturate(-1);
}

/**
 * Negative image (inverse of classic rgb matrix)
 *
 */
ColorTransformFilter.prototype.negative = function() {
    this.matrix = [
        0, 1, 1, 0, 0,
        1, 0, 1, 0, 0,
        1, 1, 0, 0, 0,
        0, 0, 0, 1, 0
    ];
}

ColorTransformFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);
    this.shader.setMatrix(render.gl, this.matrix);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}

/**
 * gray filter
 **/
var GrayFilter = function(gl) {

    this.shader = new GrayShader(gl);

}

Util.inherit(GrayFilter, AbstractFilter);

GrayFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}

/**
 * blurX filter
 **/
var BlurXFilter = function(gl) {

    this.shader = new BlurXShader(gl);

    this.blurX = 1;

}

Util.inherit(BlurXFilter, AbstractFilter);

BlurXFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);
    this.shader.setBlurX(render.gl, this.blurX);
    this.shader.setTextureSize(render.gl, input.width, input.height);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}

/**
 * blurY filter
 **/
var BlurYFilter = function(gl) {

    this.shader = new BlurYShader(gl);

    this.blurY = 1;

}

Util.inherit(BlurYFilter, AbstractFilter);

BlurYFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);
    this.shader.setBlurY(render.gl, this.blurY);
    this.shader.setTextureSize(render.gl, input.width, input.height);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}

/**
 * EventDispatcher Class
 **/
var EventDispatcher = function() {
    this.eventMap = {};
}

/**
 * add a event listener
 **/
EventDispatcher.prototype.addEventListener = function(type, listener, thisObject) {
    var list = this.eventMap[type];

    if(!list) {
        list = this.eventMap[type] = [];
    }

    list.push({listener: listener, thisObject: thisObject});
}

/**
 * remove a event listener
 **/
EventDispatcher.prototype.removeEventListener = function(type, listener, thisObject) {
    var list = this.eventMap[type];

    if(!list) {
        return;
    }

    for(var i = 0, len = list.length; i < len; i++) {
        var bin = list[i];
        if(bin.listener == listener && bin.thisObject == thisObject) {
            list.splice(i, 1);
            break;
        }
    }
}

/**
 * dispatch a event
 **/
EventDispatcher.prototype.dispatchEvent = function(event) {
    this.notifyListener(event);
}

/**
 * notify listener
 **/
EventDispatcher.prototype.notifyListener = function(event) {
    var list = this.eventMap[event.type];

    if(!list) {
        return;
    }

    for(var i = 0, len = list.length; i < len; i++) {
        var bin = list[i];
        bin.listener.call(bin.thisObject, event);
    }
}

/**
 * Event Class
 **/
var Event = function() {
    // event type
    this.type = "";
    // event target
    this.target = null;
}

/**
 * create and dispatch event
 **/
Event.dispatchEvent = function(target, type) {
    var event = new Event();
    event.type = type;
    event.target = target;
    target.dispatchEvent(event);
}

/**
 * TouchEvent Class
 **/
var TouchEvent = function() {
    TouchEvent.superClass.constructor.call(this);
    // page position
    this.pageX = 0;
    this.pageY = 0;
    // local position
    this.localX = 0;
    this.localY = 0;
}

// inherit
Util.inherit(TouchEvent, Event);

/**
 * create and dispatch event
 **/
TouchEvent.dispatchEvent = function(target, type, pageX, pageY) {
    var event = new TouchEvent();
    event.type = type;
    event.target = target;
    event.pageX = pageX;
    event.pageY = pageY;
    var matrix = target.getInvertedConcatenatedMatrix();
    var localX = matrix.a * pageX + matrix.c * pageY + matrix.tx;
    var localY = matrix.b * pageX + matrix.d * pageY + matrix.ty;
    event.localX = localX;
    event.localY = localY;
    target.dispatchEvent(event);
}

/**
 * touch tap event
 **/
TouchEvent.TOUCH_TAP = "touch_tap";

/**
 * touch begin event
 **/
TouchEvent.TOUCH_BEGIN = "touch_begin";

/**
 * touch move event
 **/
TouchEvent.TOUCH_MOVE = "touch_move";

/**
 * touch end event
 **/
TouchEvent.TOUCH_END = "touch_end";

/**
 * touch release outside event
 **/
TouchEvent.TOUCH_RELEASE_OUTSIDE = "touch_release_outside";

/**
 * DisplayObject Class
 * base class of all display objects
 * inherit from EventDispatcher, so display object can dispatcher event
 **/
var DisplayObject = function() {

    DisplayObject.superClass.constructor.call(this);

    // type of this display object
    // typeof DISPLAY_TYPE
    this.type = null;

    // bla bla ...
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.anchorX = 0;
    this.anchorY = 0;

    // a 4x4 transform matrix
    this.transform = new Matrix();

    this.width = 0;
    this.height = 0;

    this.filters = [];

    this.blend = BLEND_MODE.SOURCE_OVER;

    this.mask = null;

    this._contentBounds = new Rectangle();

    this.parent = null;

    this.concatenatedMatrix = new Matrix();

    this.invertConcatenatedMatrix = new Matrix();

}

// inherit
Util.inherit(DisplayObject, EventDispatcher);

/**
 * get coords data of this
 **/
DisplayObject.prototype.getCoords = function() {

}

/**
 * get props data of this
 **/
DisplayObject.prototype.getProps = function() {

}

/**
 * get indices data of this
 **/
DisplayObject.prototype.getIndices = function() {

};

/**
 * get draw data of this
 **/
DisplayObject.prototype.getDrawData = function(render) {

};

/**
 * prepare draw for a render
 **/
// DisplayObject.prototype.prepareDraw = function(render) {
//
// };

/**
 * get the transform matrix
 **/
DisplayObject.prototype.getTransformMatrix = function() {

    this.transform.identify();
    this.transform.translate(-this.anchorX * this.width, -this.anchorY * this.height);
    this.transform.scale(this.scaleX, this.scaleY);
    this.transform.rotate(this.rotation);
    this.transform.translate(this.x, this.y);

    return this.transform;
}

/**
 * get content bounds
 **/
DisplayObject.prototype.getContentBounds = function() {
    var bounds = this._contentBounds;

    bounds.x = 0;
    bounds.y = 0;
    bounds.width = this.width;
    bounds.height = this.height;

    return this._contentBounds;
}

/**
 * hit test
 **/
DisplayObject.prototype.hitTest = function(x, y) {
    var bounds = this.getContentBounds();

    var matrix = this.getInvertedConcatenatedMatrix();

    // change global position to local
    var localX = matrix.a * x + matrix.c * y + matrix.tx;
    var localY = matrix.b * x + matrix.d * y + matrix.ty;

    if(bounds.contains(localX, localY)) {
        return this;
    } else {
        return null;
    }
}

/**
 * dispatch a event (rewrite)
 **/
DisplayObject.prototype.dispatchEvent = function(event) {
    var list = this.getPropagationList();
    for(var i = 0; i < list.length; i++) {
        var object = list[i];
        object.notifyListener(event);
    }
}

/**
 * get event propagation list
 **/
DisplayObject.prototype.getPropagationList = function() {
    var list = [];
    var target = this;
    while (target) {
        list.push(target);
        target = target.parent;
    }
    return list;
}

/**
 * get concatenated matrix
 */
DisplayObject.prototype.getConcatenatedMatrix = function() {
    this.concatenatedMatrix.copy(this.getTransformMatrix());

    if(this.parent) {
        this.concatenatedMatrix.prepend(this.parent.getConcatenatedMatrix());
    }

    return this.concatenatedMatrix;
}

/**
 * get inverted concatenated matrix
 */
DisplayObject.prototype.getInvertedConcatenatedMatrix = function() {
    this.invertConcatenatedMatrix.copy(this.getConcatenatedMatrix());

    this.invertConcatenatedMatrix.invert();

    return this.invertConcatenatedMatrix;
}

/**
 * DisplayObject Class
 * base class of all display objects
 **/
var DisplayObjectContainer = function() {

    DisplayObjectContainer.superClass.constructor.call(this);

    this.type = DISPLAY_TYPE.CONTAINER;

    this.children = [];

}

// inherit
Util.inherit(DisplayObjectContainer, DisplayObject);

/**
 * add child
 **/
DisplayObjectContainer.prototype.addChild = function(displayObject) {
    this.children.push(displayObject);
    displayObject.parent = this;
}

/**
 * remove child
 **/
DisplayObjectContainer.prototype.removeChild = function(displayObject) {
    for(var i = 0; i < this.children.length;) {
        var child = this.children[i];
        if(child == displayObject) {
            this.children.splice(i, 1);
            child.parent = null;
            break;
        }
        i++;
    }
}

/**
 * hit test(rewrite)
 **/
DisplayObjectContainer.prototype.hitTest = function(x, y) {
    var target = null;

    for(var i = this.children.length - 1; i >= 0; i--) {
        var child = this.children[i];
        target = child.hitTest(x, y);
        if(target) {
            break;
        }
    }

    return target || DisplayObjectContainer.superClass.hitTest.call(this);
}

/**
 * Sprite Class
 * sprite to show picture
 **/
var Sprite = function() {

    Sprite.superClass.constructor.call(this);

    this.type = DISPLAY_TYPE.SPRITE;

    // webGL texture
    this.texture = null;

    // is source frame default
    // if is default source frame, skip calculate uv
    this.defaultSourceFrame = true;
    // source frame
    this.sourceFrame = new Rectangle();

}

// inherit
Util.inherit(Sprite, DisplayObject);

/**
 * set source frame of this
 */
Sprite.prototype.setSourceFrame = function(x, y, width, height) {
    var sourceFrame = this.sourceFrame;

    if(arguments.length == 1) {
        // if argument is a rectangle
        sourceFrame.copy(x);
    } else {
        sourceFrame.set(x, y, width, height);
    }

    this.defaultSourceFrame = false;
}

/**
 * get coords data of this
 **/
Sprite.prototype.getCoords = function() {
    var coords = [
        0             , 0              ,
        0 + this.width, 0              ,
        0 + this.width, 0 + this.height,
        0             , 0 + this.height
    ];

    return coords;
}

/**
 * get props data of this
 * uv datas
 **/
Sprite.prototype.getProps = function() {
    var props;

    if(this.defaultSourceFrame) {
        props = [
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ];
    } else {
        var texture = this.texture;

        if(texture && texture.isInit) {
            textureWidth = texture.width;
            textureHeight = texture.height;

            var sourceFrame = this.sourceFrame;
            var uvx = sourceFrame.x / textureWidth;
            var uvy = sourceFrame.y / textureHeight;
            var uvw = sourceFrame.width / textureWidth;
            var uvh = sourceFrame.height / textureHeight;

            props = [
                uvx      , uvy      ,
                uvx + uvw, uvy      ,
                uvx + uvw, uvy + uvh,
                uvx      , uvy + uvh
            ];
        } else {
            props = [
                0, 0,
                0, 0,
                0, 0,
                0, 0
            ];
        }
    }

    return props;

}

/**
 * get indices data of this
 **/
Sprite.prototype.getIndices = function() {
    return [
        0, 1, 2,
        2, 3, 0
    ];
};

/**
 * get draw data of this
 **/
Sprite.prototype.getDrawData = function() {
    var data = DrawData.getObject();
    data.texture = this.texture;
    data.filters = this.filters;
    return data;
};

/**
 * prepare draw for a render
 **/
// Sprite.prototype.prepareDraw = function(render, data) {
//     var gl = render.context;
//
//     render.activateShader(render.textureShader);
//
//     gl.activeTexture(gl.TEXTURE0);
//
//     gl.bindTexture(gl.TEXTURE_2D, data.texture);
// };

/**
 * A Sample Rect Class
 * you can give it a color
 **/
var Rect = function() {

    Rect.superClass.constructor.call(this);

    this.type = DISPLAY_TYPE.RECT;

    // color
    this.color = 0x000000;

}

// inherit
Util.inherit(Rect, DisplayObject);

/**
 * get coords data of this
 **/
Rect.prototype.getCoords = function() {
    var coords = [
        0             , 0              ,
        0 + this.width, 0              ,
        0 + this.width, 0 + this.height,
        0             , 0 + this.height
    ];

    return coords;
}

/**
 * get props data of this
 **/
Rect.prototype.getProps = function() {
    // no use
    var props = [
        0, 0,
        0, 0,
        0, 0,
        0, 0
    ];

    return props;
}

/**
 * get indices data of this
 **/
Rect.prototype.getIndices = function() {
    return [
        0, 1, 2,
        2, 3, 0
    ];
};

/**
 * get draw data of this
 **/
Rect.prototype.getDrawData = function() {
    var data = DrawData.getObject();
    data.color = this.color;
    return data;
};

/**
 * prepare draw for a render
 **/
// Rect.prototype.prepareDraw = function(render, data) {
//     var gl = render.context;
//
//     render.activateShader(render.primitiveShader);
//
//     render.primitiveShader.fillColor(gl, data.color);
// };

var textCanvas = document.createElement("canvas");

var textContext = textCanvas.getContext("2d");

/**
 * Text Class
 * sprite to show text
 **/
var Text = function(gl) {

    Text.superClass.constructor.call(this);

    this.type = DISPLAY_TYPE.TEXT;

    // we render text on a 2D context, and then
    // store canvas to this texture
    this.texture = new Texture(gl);

    // text
    this.$text = "";

    // font color
    this.$fontColor = 0xff0000;

    // font size
    this.$fontSize = 24;

    // font family
    this.$fontFamily = "Arial";

    // dirty flag
    this.dirty = true;

    // TODO width and height is not used in this DisplayObject

}

// inherit
Util.inherit(Text, DisplayObject);

Object.defineProperties(Text.prototype, {

    text:
    {
        get: function ()
        {
            return this.$text;
        },
        set: function(value)
        {
            this.$text = value;
            this.dirty = true;
        }
    },

    fontColor:
    {
        get: function ()
        {
            return this.$fontColor;
        },
        set: function(value)
        {
            this.$fontColor = value;
            this.dirty = true;
        }
    },

    fontSize:
    {
        get: function ()
        {
            return this.$fontSize;
        },
        set: function(value)
        {
            this.$fontSize = value;
            this.dirty = true;
        }
    },

    fontFamily:
    {
        get: function ()
        {
            return this.$fontFamily;
        },
        set: function(value)
        {
            this.$fontFamily = value;
            this.dirty = true;
        }
    }

});

/**
 * get coords data of this
 **/
Text.prototype.getCoords = function() {

    if(this.dirty) {
        var canvas = textCanvas;
        var context = textContext;
        context.font = this.$fontSize + "px " + this.$fontFamily;
        this.width = context.measureText(this.$text).width;
        this.height = this.$fontSize * 1.4;
    }

    var coords = [
        0             , 0              ,
        0 + this.width, 0              ,
        0 + this.width, 0 + this.height,
        0             , 0 + this.height
    ];

    return coords;
}

/**
 * get props data of this
 * uv datas
 **/
Text.prototype.getProps = function() {
    var props = [
        0    , 0    ,
        0 + 1, 0    ,
        0 + 1, 0 + 1,
        0    , 0 + 1
    ];

    return props;
}

/**
 * get indices data of this
 **/
Text.prototype.getIndices = function() {
    return [
        0, 1, 2,
        2, 3, 0
    ];
};

/**
 * get draw data of this
 **/
Text.prototype.getDrawData = function() {
    var data = DrawData.getObject();

    // if dirty, update texture
    if(this.dirty) {
        this.updateTexture();
        this.dirty = false;
    }

    data.texture = this.texture;
    data.filters = this.filters;
    return data;
};

/**
 * update texture
 */
Text.prototype.updateTexture = function() {
    var canvas = textCanvas;
    var context = textContext;

    context.font = this.$fontSize + "px " + this.$fontFamily;

    // canvas can not be size 0
    var width = context.measureText(this.$text).width || 1;
    var height = this.$fontSize * 1.4 || 1;

    canvas.width = width;
    canvas.height = height;

    context.clearRect(0, 0, width, height);

    context.font = this.$fontSize + "px " + this.$fontFamily;
    context.fillStyle = "#" + this.$fontColor.toString(16);
    context.fillText(this.$text, 0, this.$fontSize);

    this.texture.uploadImage(canvas, true);
}

/**
 * State Class
 * show state
 **/
var State = function() {
    this.startTime = Date.now();
    this.frameCount = 0;

    this.dom = document.createElement("div");
    this.dom.style.cssText = "background:rgba(0, 0, 0, 0.8);position:absolute;top:0;left:0;padding:10px;min-width:180px;height:80px;fontSize:26px;color:green";
}

State.prototype.update = function(draw) {
    var endTime = Date.now();
    if(endTime - this.startTime < 1000) {
        this.frameCount ++;
    } else {
        var fps = Math.min(this.frameCount + 1, 60);
        this.show(fps, draw || "[not input!]");

        this.startTime = endTime;
        this.frameCount = 0;
    }
}

State.prototype.show = function(fps, draw) {
    this.dom.innerHTML = "FPS :" + fps + "</br>"
                     + "DRAW:" + draw;
}

State.prototype.getDom = function() {
    return this.dom;
}

/**
 * TouchHandler Class
 * handle touch event
 **/
var TouchHandler = function(canvas, rootTarget) {

    this.canvas = canvas;

    this.rootTarget = rootTarget;

    this.touchDownTarget = {};

    this.useTouchesCount = 0;

    this.maxTouches = 6;

    // scale rate will change touch position mapping
    this.scaleX = 1;
    this.scaleY = 1;
}

/**
 * add listeners
 * need call by user
 **/
TouchHandler.prototype.addListeners = function () {
    if (window.navigator.msPointerEnabled) {
        this.addMSPointerListener();
    } else {
        if(Util.isMobile()) {
            this.addTouchListener();
        } else {
            this.addMouseListener();
        }
    }
}

/**
 * add MSPointer listeners
 * for microsoft
 **/
TouchHandler.prototype.addMSPointerListener = function () {
    var _this = this;
    this.canvas.addEventListener("MSPointerDown", function (event) {
        event.identifier = event.pointerId;
        _this.onTouchBegin(event);
        _this.prevent(event);
    }, false);
    this.canvas.addEventListener("MSPointerMove", function (event) {
        event.identifier = event.pointerId;
        _this.onTouchMove(event);
        _this.prevent(event);
    }, false);
    this.canvas.addEventListener("MSPointerUp", function (event) {
        event.identifier = event.pointerId;
        _this.onTouchEnd(event);
        _this.prevent(event);
    }, false);
}

/**
 * add Mouse listeners
 * for desktop
 **/
TouchHandler.prototype.addMouseListener = function () {
    this.canvas.addEventListener("mousedown", this.onTouchBegin.bind(this));
    this.canvas.addEventListener("mousemove", this.onTouchMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onTouchEnd.bind(this));
}

/**
 * add touch listeners
 * for mobile device
 **/
TouchHandler.prototype.addTouchListener = function () {
    var _this = this;
    this.canvas.addEventListener("touchstart", function (event) {
        var l = event.changedTouches.length;
        for (var i = 0; i < l; i++) {
            _this.onTouchBegin(event.changedTouches[i]);
        }
        _this.prevent(event);
    }, false);
    this.canvas.addEventListener("touchmove", function (event) {
        var l = event.changedTouches.length;
        for (var i = 0; i < l; i++) {
            _this.onTouchMove(event.changedTouches[i]);
        }
        _this.prevent(event);
    }, false);
    this.canvas.addEventListener("touchend", function (event) {
        var l = event.changedTouches.length;
        for (var i = 0; i < l; i++) {
            _this.onTouchEnd(event.changedTouches[i]);
        }
        _this.prevent(event);
    }, false);
    this.canvas.addEventListener("touchcancel", function (event) {
        var l = event.changedTouches.length;
        for (var i = 0; i < l; i++) {
            _this.onTouchEnd(event.changedTouches[i]);
        }
        _this.prevent(event);
    }, false);
}

/**
 * prevent default event
 **/
TouchHandler.prototype.prevent = function (event) {
    event.stopPropagation();
    if (event["isScroll"] != true && !this.canvas['userTyping']) {
        event.preventDefault();
    }
};

/**
 * touch begin
 **/
TouchHandler.prototype.onTouchBegin = function(event) {
    if (this.useTouchesCount >= this.maxTouches) {
        return;
    }

    var identifier = +event.identifier || 0;

    var touchPoint =this.getLocation(event, Vec2.tempVec2);
    var x = Vec2.tempVec2.x;
    var y = Vec2.tempVec2.y;

    var target = this.rootTarget.hitTest(x, y);

    if(!target) {
        return;
    }

    if(this.touchDownTarget[identifier] == null) {
        this.touchDownTarget[identifier] = target;
        this.useTouchesCount++;
    }

    TouchEvent.dispatchEvent(target, TouchEvent.TOUCH_BEGIN, x, y);
}

/**
 * touch move
 **/
TouchHandler.prototype.onTouchMove = function(event) {
    // console.log("touch move")
    var identifier = +event.identifier || 0;

    if (this.touchDownTarget[identifier] == null) {
        return;
    }

    var touchPoint =this.getLocation(event, Vec2.tempVec2);
    var x = Vec2.tempVec2.x;
    var y = Vec2.tempVec2.y;

    var target = this.rootTarget.hitTest(x, y);

    if(!target) {
        return;
    }

    TouchEvent.dispatchEvent(target, TouchEvent.TOUCH_MOVE, x, y);
}

/**
 * touch end
 **/
TouchHandler.prototype.onTouchEnd = function(event) {
    // console.log("touch end")
    var identifier = +event.identifier || 0;

    if (this.touchDownTarget[identifier] == null) {
        return;
    }

    var touchPoint =this.getLocation(event, Vec2.tempVec2);
    var x = Vec2.tempVec2.x;
    var y = Vec2.tempVec2.y;

    var target = this.rootTarget.hitTest(x, y);
    var oldTarget = this.touchDownTarget[identifier];
    delete this.touchDownTarget[identifier];
    this.useTouchesCount--;

    if(target) {
        TouchEvent.dispatchEvent(target, TouchEvent.TOUCH_END, x, y);
    }

    if(target == oldTarget) {
        TouchEvent.dispatchEvent(target, TouchEvent.TOUCH_TAP, x, y);
    } else {
        TouchEvent.dispatchEvent(oldTarget, TouchEvent.TOUCH_RELEASE_OUTSIDE, x, y);
    }
}

/**
 * update scale
 **/
TouchHandler.prototype.updateScale = function(scaleX, scaleY) {
    this.scaleX = scaleX;
    this.scaleY = scaleY;
}

/**
 * touch end
 **/
TouchHandler.prototype.getLocation = function(event, point) {
    var box = this.canvas.getBoundingClientRect();
    point.x = (event.pageX - box.left) / this.scaleX;
    point.y = (box.height - (event.pageY - box.top)) / this.scaleY;
    return point;
}


/**
 * ScreenAdapter Class
 * adapte canvas to screen
 **/
var ScreenAdapter = function(canvas, policy) {

    this.canvas = canvas;

    this.resolutionPolicy = policy || RESOLUTION_POLICY.EXACT_FIT;
}

/**
 * resize canvas
 */
ScreenAdapter.prototype.fullScreen = function() {
    var canvas = this.canvas;

    var sizeData = this.calculateStageSize(this.resolutionPolicy, window.innerWidth, window.innerHeight, canvas.width, canvas.height);

    canvas.width = sizeData.stageWidth;
    canvas.height = sizeData.stageHeight;
    canvas.style.left = sizeData.displayLeft + "px";
    canvas.style.top = sizeData.displayTop + "px";
    canvas.style.width = sizeData.displayWidth + "px";
    canvas.style.height = sizeData.displayHeight + "px";

    return {
        scaleX: sizeData.displayWidth / sizeData.stageWidth,
        scaleY: sizeData.displayHeight / sizeData.stageHeight
    };
}

/**
 * calculateStageSize
 */
ScreenAdapter.prototype.calculateStageSize = function(policy, screenWidth, screenHeight, contentWidth, contentHeight) {
    var stageWidth = contentWidth;
    var stageHeight = contentHeight;

    var displayLeft = 0;
    var displayTop = 0;
    var displayWidth = screenWidth;
    var displayHeight = screenHeight;

    var scaleX = displayWidth / stageWidth;
    var scaleY = displayHeight / stageHeight;

    switch (policy) {
        case RESOLUTION_POLICY.EXACT_FIT:

            break;
        case RESOLUTION_POLICY.SHOW_ALL:
            if(scaleX > scaleY) {
                displayWidth = Math.round(stageWidth * scaleY);
                displayLeft = Math.round((screenWidth - displayWidth) / 2);
            } else {
                displayHeight = Math.round(stageHeight * scaleX);
                displayTop = Math.round((screenHeight - displayHeight) / 2);
            }
            break;
        case RESOLUTION_POLICY.NO_BORDER:
            if (scaleX > scaleY) {
                displayHeight = Math.round(stageHeight * scaleX);
                // fixed left bottom
                displayTop = Math.round(screenHeight - displayHeight);
            }
            else {
                displayWidth = Math.round(stageWidth * scaleY);
            }
            break;
        case RESOLUTION_POLICY.FIXED_WIDTH:
            stageHeight = Math.round(screenHeight / scaleX);
            break;
        case RESOLUTION_POLICY.FIXED_HEIGHT:
            stageWidth = Math.round(screenWidth / scaleY);
            break;
        default:

    }

    return {
        stageWidth: stageWidth,
        stageHeight: stageHeight,
        displayLeft: displayLeft,
        displayTop: displayTop,
        displayWidth: displayWidth,
        displayHeight: displayHeight
    };
}