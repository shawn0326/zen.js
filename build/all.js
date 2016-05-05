/**
 * State Class
 * show state
 **/
var State = function() {
    this.startTime = Date.now();
    this.frameCount = 0;
    this.draw = "";
    this.fps = "";

    this.dom = document.createElement("div");
    this.dom.style.cssText = "background:rgba(0, 0, 0, 0.8);position:absolute;top:0;left:0;padding:10px;min-width:180px;height:80px;fontSize:26px;color:green";
}

State.prototype.update = function(draw) {
    var endTime = Date.now();
    if(endTime - this.startTime < 1000) {
        this.frameCount ++;
    } else {
        this.fps = Math.min(this.frameCount + 1, 60);
        this.startTime = endTime;
        frameCount = 0;

        if(draw) {
            this.draw = draw;
        }

        this.show();
    }
}

State.prototype.show = function() {
    this.dom.innerHTML = "FPS :" + this.fps + "</br>"
                     + "DRAW:" + this.draw;
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
var Matrix = function(a, b, c, d, tx, ty) {
    this.a = a || 1;
    this.b = b || 0;
    this.c = c || 0;
    this.d = d || 1;
    this.tx = tx || 0;
    this.ty = ty || 0;
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
     * If the image size is power of 2
     */
    isPowerOfTwo: function(n) {
        return (n & (n - 1)) === 0;
    },
    /**
     * Get a webGL texture
     * @param gl {Object} webGL context
     * @param src {String} image src
     * @param callback {Function} callback function
     */
    getWebGLTexture: function(gl, src, callback) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        var img = new Image();
        img.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            if (Util.isPowerOfTwo(img.width) && Util.isPowerOfTwo(img.height)) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            if(callback) {
                callback(texture);
            }
            // gl.bindTexture(gl.TEXTURE_2D, null);
        };
        img.src = src;

        texture.id = src;

        return texture;
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

     var gl = this.gl;
     renderTarget.activate(gl);
     this.currentRenderTarget = renderTarget;
 }

 /**
  * activate a renderBuffer
  **/
  Render.prototype.activateRenderBuffer = function(renderBuffer) {
      if(this.currentRenderBuffer == renderBuffer) {
          return;
      }

      var gl = this.gl;
      renderBuffer.activate(gl);
      this.currentRenderBuffer = renderBuffer;
  }

/**
 * not realy render, just cache draw data in this renderer
 **/
Render.prototype.render = function(displayObject) {

    if(this.currentRenderBuffer.reachedMaxSize()) {
        this.flush();
    }

    this.currentRenderBuffer.cache(displayObject);
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

/**
 * RenderTarget Class
 **/
var RenderTarget = function(gl, width, height, root) {
    // boolean type, if root is false, bind frame buffer
    this.root = root;
    // frame buffer
    this.frameBuffer = null;
    // the texture
    this.texture = null;

    if(!this.root) {

        this.frameBuffer = gl.createFramebuffer();

        /*
            A frame buffer needs a target to render to..
            create a texture and bind it attach it to the framebuffer..
         */

        this.texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D,  this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // set the scale properties of the texture..
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    }
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
RenderTarget.prototype.activate = function(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
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
    // upload vertices and indices, should set to gl.DINAMIC_DRAW and use bufferSubData function?
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
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
 * clear draw datas
 */
RenderBuffer.prototype.clear = function(gl) {
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
        'void main() {',
            'vec4 color = u_Matrix * texture2D(u_Sampler, v_TexCoord);',
            'gl_FragColor = vec4(color.rgb * color.a, color.a);',
        '}'
    ].join("\n");

    ColorTransformShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    this.transform = new Float32Array(4 * 4);
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

    for(var i = 0; i < array.length; i++) {
        this.transform[i] = array[i];
    }

    gl.uniformMatrix4fv(u_Matrix, false, this.transform);
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
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

}

Util.inherit(ColorTransformFilter, AbstractFilter);

ColorTransformFilter.prototype.reset = function() {
    for(var i = 0; i < this.matrix.length; i++) {
        this.matrix[i] = 0;
    }
    this.matrix[0] = this.matrix[5] =this.matrix[10] = this.matrix[15] = 1;
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

}

// TODO add some transform method

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
    this.transform.translate(-this.x - this.anchorX * this.width, -this.y - this.anchorY * this.height);
    this.transform.rotate(this.rotation);
    this.transform.scale(this.scaleX, this.scaleY);
    this.transform.translate(this.x + this.anchorX * this.width, this.y + this.anchorY * this.height);

    return this.transform;
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
Sprite.prototype.getVertices = function() {
    var t = this.getTransformMatrix();

    var vertices = [];

    var x = this.x;
    var y = this.y;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 0, 0);

    var x = this.x + this.width;
    var y = this.y;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 0);

    var x = this.x + this.width;
    var y = this.y + this.height;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 1);

    var x = this.x;
    var y = this.y + this.height;
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
Rect.prototype.getVertices = function() {
    var t = this.getTransformMatrix();

    var vertices = [];

    var x = this.x;
    var y = this.y;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 0, 0);

    var x = this.x + this.width;
    var y = this.y;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 0);

    var x = this.x + this.width;
    var y = this.y + this.height;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 1);

    var x = this.x;
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
