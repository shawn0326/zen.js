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
    }

}

/**
 * DrawData Class
 * describ a draw data
 **/
var DrawData = function() {

    this.renderType = "";

    this.texture = null;

    this.color = 0x000000;

    this.transform = null;

    this.count = 0;

    this.blendMode = "";

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

    drawData.renderType = "";
    drawData.texture = null;
    drawData.color = 0x000000;
    drawData.transform = null;
    drawData.count = 0;
    drawData.blendMode = "";

    DrawData.pool.push(drawData);

};

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

    this.isInit = true;
}
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

    this.defaultBlendMode = "source-over";

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

    // if mask, pushMask

    if(displayObject.renderType == "container") {// cache children

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

    // if filter, popFilters, restoreMatrix

    // if mask, popMask

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
    var currentSize = this.currentRenderBuffer.currentSize;
    var drawData = this.currentRenderBuffer.drawData;
    for(var i = 0; i < currentSize; i++) {
        var data = drawData[i];

        switch (data.renderType) {
            case "sprite":

                var size = data.count;
                // is texture not loaded skip render
                if(data.texture && data.texture.isInit) {
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
                    gl.bindTexture(gl.TEXTURE_2D, data.texture.glTexture);

                    gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, offset * 2);

                    // count draw call if texture not exist?
                    this.drawCall++;
                }

                offset += size * 6;

                break;

            case "rect":

                var size = data.count;

                this.activateShader(this.primitiveShader);

                this.primitiveShader.fillColor(gl, data.color);

                gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, offset * 2);

                this.drawCall++;

                offset += size * 6;

                break;

            case "blend":

                var blendMode = data.blendMode;

                // set blendMode
                this.setBlendMode(blendMode);

                break;

            default:
                console.warn("no render type function");
                break;

        }

    }

    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * set blend mode
 */
Render.prototype.setBlendMode = function(blendMode) {
    var gl = this.gl;

    switch (blendMode) {
        case "source-over":
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            break;
        case "lighter":
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            break;
        case "destination-out":
            gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
            break;
        case "destination-in":
            gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
            break;
        default:
            // do nothing
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
            renderTarget.clear();// if size is right, just clear
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
 * abstract filter
 **/
var AbstractFilter = function(gl) {

    //  a shader to render this filter
    this.shader = null;

}

// render apply this filter
AbstractFilter.prototype.applyFilter = function(render) {

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

ColorTransformFilter.prototype.applyFilter = function(render) {
    render.activateShader(this.shader);
    this.shader.setMatrix(render.context, this.matrix);
}

/**
 * gray filter
 **/
var GrayFilter = function(gl) {

    this.shader = new GrayShader(gl);

}

Util.inherit(GrayFilter, AbstractFilter);

GrayFilter.prototype.applyFilter = function(render) {
    render.activateShader(this.shader);
}

/**
 * DisplayObject Class
 * base class of all display objects
 **/
var DisplayObject = function() {

    // render type of this display object
    // every type has it own render function
    this.renderType = "";

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

    this.blend = "source-over";

}

/**
 * get vertices data of this
 **/
DisplayObject.prototype.getVertices = function() {

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
 * DisplayObject Class
 * base class of all display objects
 **/
var DisplayObjectContainer = function() {

    DisplayObjectContainer.superClass.constructor.call(this);

    // render type of this display object
    // every type has it own render function
    this.renderType = "container";

    this.children = [];

}

// inherit
Util.inherit(DisplayObjectContainer, DisplayObject);

/**
 * add child
 **/
DisplayObject.prototype.addChild = function(displayObject) {
    this.children.push(displayObject);
}

/**
 * remove child
 **/
DisplayObject.prototype.removeChild = function(displayObject) {
    for(var i = 0; i < this.children.length;) {
        var child = this.children[i];
        if(child == displayObject) {
            this.children.splice(i, 1);
            break;
        }
        i++;
    }
}

/**
 * A Sample Sprite Class
 * in this demo, it just a picture -_-
 **/
var Sprite = function() {

    Sprite.superClass.constructor.call(this);

    this.renderType = "sprite";

    // webGL texture
    this.texture = null;

}

// inherit
Util.inherit(Sprite, DisplayObject);

/**
 * get vertices data of this
 **/
Sprite.prototype.getVertices = function(transform) {
    var t = transform;

    var vertices = [];

    var x = 0;
    var y = 0;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 0, 0);

    var x = 0 + this.width;
    var y = 0;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 0);

    var x = 0 + this.width;
    var y = 0 + this.height;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 1);

    var x = 0;
    var y = 0 + this.height;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 0, 1);

    return vertices;
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

    this.renderType = "rect";

    // color
    this.color = 0x000000;

}

// inherit
Util.inherit(Rect, DisplayObject);

/**
 * get vertices data of this
 **/
Rect.prototype.getVertices = function(transform) {
    var t = transform;

    var vertices = [];

    var x = 0;
    var y = 0;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 0, 0);

    var x = 0 + this.width;
    var y = 0;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 0);

    var x = 0 + this.width;
    var y = this.y + this.height;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 1);

    var x = 0;
    var y = this.y + this.height;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 0, 1);

    return vertices;
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
