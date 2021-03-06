(function(win) {

    /*
     * zen
     * @namespace
     */
    var zen = win.zen = win.zen || {
        global: win
    };

    /**
     * Class inherit
     */
    var emptyConstructor = function() {};

    var inherit = function(subClass, superClass) {
        emptyConstructor.prototype = superClass.prototype;
        subClass.superClass = superClass.prototype;
        subClass.prototype = new emptyConstructor;
        subClass.prototype.constructor = subClass;
    }

    zen.inherit = inherit;

    /**
     * is mobile
     */
    var isMobile = function() {
        if (!win["navigator"]) {
            return true;
        }
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
    }

    zen.isMobile = isMobile;

    /**
     * webgl get extension
     */
    var getExtension = function(gl, name) {
        var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
        var ext = null;
        for (var i in vendorPrefixes) {
            ext = gl.getExtension(vendorPrefixes[i] + name);
            if (ext) { break; }
        }
        return ext;
    }

    zen.getExtension = getExtension;

})(window);

(function() {

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

    zen.RENDER_CMD = RENDER_CMD;

    /*
     * display object type
     */
    var DISPLAY_TYPE = {

        CONTAINER: 0,

        RECT: 1,

        SPRITE: 2,

        TEXT: 3
    }

    zen.DISPLAY_TYPE = DISPLAY_TYPE;

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

    zen.BLEND_MODE = BLEND_MODE;

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

    zen.RESOLUTION_POLICY = RESOLUTION_POLICY;

})();

(function() {
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
            var u = Math.cos(angle);
            var v = Math.sin(angle);
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
        if(ta != 1 || tb != 0 || tc != 0 || td != 1) {
            this.a = ta * matrix.a + tc * matrix.b;
            this.b = tb * matrix.a + td * matrix.b;
            this.c = ta * matrix.c + tc * matrix.d;
            this.d = tb * matrix.c + td * matrix.d;
            this.tx = ta * matrix.tx + tc * matrix.ty + ttx;
            this.ty = tb * matrix.tx + td * matrix.ty + tty;
        } else {
            this.a = matrix.a;
            this.b = matrix.b;
            this.c = matrix.c;
            this.d = matrix.d;
            this.tx = matrix.tx + ttx;
            this.ty = matrix.ty + tty;
        }

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
     * set transform
     **/
    Matrix.prototype.setTransform = function(x, y, scaleX, scaleY, rotation, anchorX, anchorY) {
        var cr = 1;
        var sr = 0;
        if (rotation % 360) {
            var r = rotation;
            cr = Math.cos(r);
            sr = Math.sin(r);
        }

        this.a = cr * scaleX;
        this.b = sr * scaleX;
        this.c = -sr * scaleY;
        this.d = cr * scaleY;
        this.tx = x;
        this.ty = y;

        if (anchorX || anchorY) {
            // prepend the anchor offset:
            this.tx -= anchorX * this.a + anchorY * this.c;
            this.ty -= anchorX * this.b + anchorY * this.d;
        }
    }

    zen.Matrix = Matrix;
})();

(function() {
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

    zen.Rectangle = Rectangle;
})();

(function() {
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

    zen.Vec2 = Vec2;
})();

(function() {
    /**
     * PVRParser Class
     * parse pvr texture
     * PVR formats, from:
     * http://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_pvrtc/
     **/
    var PVRParser = {};

    PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG  = 0x8C00;
    PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG  = 0x8C01;
    PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
    PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

    /*
     * parse
     */
    PVRParser.parse = function(arrayBuffer, callback, errorCallback) {
        // the header length of int32
        var headerIntLength = 13;
        // get header part of arrayBuffer
        var header = new Uint32Array(arrayBuffer, 0, headerIntLength);

        // separate buffer and header
        var pvrDatas = {
            buffer: arrayBuffer,
            header: header
        };

        // PVR v3
        if (header[0] === 0x03525650) {
            PVRParser._parseV3(pvrDatas, callback, errorCallback);
        }
        // PVR v2
        else if (header[11] === 0x21525650) {
            PVRParser._parseV2(pvrDatas, callback, errorCallback);
        }
        // error
        else {
            errorCallback(pvrDatas, "pvr parse error!");
        }
    }

    /*
     * parse v2
     */
    PVRParser._parseV2 = function(pvrDatas, callback, errorCallback) {
        var header = pvrDatas.header;

        var headerLength = header[0],
            height = header[1],
            width = header[2],
            numMipmaps = header[3],
            flags = header[4],
            dataLength = header[5],
            bpp = header[6],
            bitmaskRed = header[7],
            bitmaskGreen = header[8],
            bitmaskBlue = header[9],
            bitmaskAlpha = header[10],
            pvrTag = header[11],
            numSurfs = header[12];

        var TYPE_MASK = 0xff;
        var PVRTC_2 = 24,
            PVRTC_4 = 25;

        var formatFlags = flags & TYPE_MASK;

        var bpp, format;
        var _hasAlpha = bitmaskAlpha > 0;

        if (formatFlags === PVRTC_4) {
            format = _hasAlpha ? PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG : PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
            bpp = 4;
        } else if (formatFlags === PVRTC_2) {
            format = _hasAlpha ? PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG : PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
            bpp = 2;
        } else {
            errorCallback(pvrDatas, "pvr v2 parse error");
            console.log("unknow format flags::" + formatFlags);
        }

        var dataOffset = headerLength;
        pvrDatas.pvrtcData = new Uint8Array(pvrDatas.buffer, dataOffset);
        pvrDatas.bpp = bpp;
        pvrDatas.format = format;
        pvrDatas.width = width;
        pvrDatas.height = height;
        pvrDatas.surfacesCount = numSurfs;
        pvrDatas.mipmapsCount = numMipmaps + 1;

        // guess cubemap type seems tricky in v2
        // it juste a pvr containing 6 surface (no explicit cubemap type)
        pvrDatas.isCubemap = ( pvrDatas.surfacesCount === 6 );

        callback(pvrDatas);
    }

    /*
     * parse v3
     */
    PVRParser._parseV3 = function(pvrDatas, callback, errorCallback) {
        var header = pvrDatas.header;
        var bpp, format;

        var pixelFormat = header[2];

        switch (pixelFormat) {
            case 0 : // PVRTC 2bpp RGB
                bpp = 2;
                format = PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                break;
            case 1 : // PVRTC 2bpp RGBA
                bpp = 2;
                format = PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                break;
            case 2 : // PVRTC 4bpp RGB
                bpp = 4;
                format = PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                break;
            case 3 : // PVRTC 4bpp RGBA
                bpp = 4;
                format = PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                break;
            default :
                errorCallback(pvrDatas, "pvr v3 parse error");
                console.log("unknow pixel format::" + pixelFormat)
        }

        var dataOffset = 52 + header[12];
        pvrDatas.pvrtcData = new Uint8Array(pvrDatas.buffer, dataOffset);
        pvrDatas.bpp = bpp;
        pvrDatas.format = format;
        pvrDatas.width = header[7];
        pvrDatas.height = header[6];
        pvrDatas.surfacesCount = header[10];
        pvrDatas.mipmapsCount = header[11];

        pvrDatas.isCubemap = ( pvrDatas.surfacesCount === 6 );

        callback(pvrDatas);
    }

    zen.PVRParser = PVRParser;
})();

(function() {

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
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
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
     * uploadCompressedData
     * Uploads compressed texture data to the GPU.
     * pixelStorei is not work for compressedTexImage2D!!!
     * so we need a flipY and premultipliedAlpha data!!!
     */
    Texture.prototype.uploadCompressedData = function(data, width, height, levels, internalFormat, bind) {
        var gl = this.gl;

        if(!Texture.pvrtcExt) {
            var ext = zen.getExtension(gl, "WEBGL_compressed_texture_pvrtc");
            if(ext) {
                Texture.pvrtcExt = ext;
            } else {
                console.log("WEBGL_compressed_texture_pvrtc is not supported!");
                return;
            }
        }

        if(bind) {
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
        }

        this.width = width;
        this.height = height;

        var offset = 0;
        // Loop through each mip level of compressed texture data provided and upload it to the given texture.
        for (var i = 0; i < levels; ++i) {
            // Determine how big this level of compressed texture data is in bytes.
            var levelSize = textureLevelSize(internalFormat, width, height);
            // Get a view of the bytes for this level of DXT data.
            var dxtLevel = new Uint8Array(data.buffer, data.byteOffset + offset, levelSize);
            // Upload!
            gl.compressedTexImage2D(gl.TEXTURE_2D, i, internalFormat, width, height, 0, dxtLevel);
            // The next mip level will be half the height and width of this one.
            width = width >> 1;
            if (width < 1)
                width = 1;
            height = height >> 1;
            if (height < 1)
                height = 1;
            // Advance the offset into the compressed texture data past the current mip level's data.
            offset += levelSize;
        }

        // if (levels > 1) {
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        // }
        // else {
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // }

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
        if(src.indexOf(".pvr") != -1) {
            return Texture.fromPVRSrc(gl, src);
        }

        return Texture.fromImageSrc(gl, src);
    }

    /**
     * get texture from jpg|png|jpeg src
     * texture maybe not init util image is loaded
     */
    Texture.fromImageSrc = function(gl, src) {
        var texture = new Texture(gl);

        var image = new Image();
        image.src = src;
        image.onload = function() {
            texture.uploadImage(image, true);
        }

        return texture;
    }

    /**
     * get texture from pvr src
     * texture maybe not init util image is loaded
     */
    Texture.fromPVRSrc = function(gl, src) {
        var texture = new Texture(gl);

        // Load the file via XHR.
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function (ev) {
            if (xhr.status == 200) {
                // If the file loaded successfully parse it.
                zen.PVRParser.parse(xhr.response, function(pvrDatas) {
                    // Upload the parsed PVR data to the texture.
                    texture.uploadCompressedData(pvrDatas.pvrtcData, pvrDatas.width, pvrDatas.height, pvrDatas.surfacesCount, pvrDatas.format, true);
                }, function(pvrDatas, msg) {
                    console.log(pvrDatas, msg);
                });
            } else {
                console.log("pvr load fails!");
            }
        }, false);
        xhr.open('GET', src, true);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);

        return texture;
    }

    Texture.pvrtcExt = null;

    // Calcualates the size of a compressed texture level in bytes
    function textureLevelSize(format, width, height) {
        switch (format) {
            case zen.PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
            case zen.PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
                return Math.floor((Math.max(width, 8) * Math.max(height, 8) * 4 + 7) / 8);

            case zen.PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
            case zen.PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
                return Math.floor((Math.max(width, 16) * Math.max(height, 8) * 2 + 7) / 8);

            default:
                return 0;
        }
    }

    zen.Texture = Texture;
})();

(function() {

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
    zen.inherit(RenderTexture, zen.Texture);

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

    zen.RenderTexture = RenderTexture;
})();

(function() {
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

    zen.DrawData = DrawData;
})();

(function() {

    var BLEND_MODE = zen.BLEND_MODE;
    var DISPLAY_TYPE = zen.DISPLAY_TYPE;
    var RENDER_CMD = zen.RENDER_CMD;

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
        this.rootRenderTarget = new zen.RenderTarget(this.gl, this.width, this.height, true);
        this.currentRenderTarget = null;
        this.activateRenderTarget(this.rootRenderTarget);

        // render buffer
        this.rootRenderBuffer = new zen.RenderBuffer(this.gl);
        this.currentRenderBuffer = null;
        this.activateRenderBuffer(this.rootRenderBuffer);

        // shader
        this.textureShader = new zen.TextureShader(this.gl);
        this.primitiveShader = new zen.PrimitiveShader(this.gl);
        this.colorTransformShader = new zen.ColorTransformShader(this.gl);
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
        shader.activate(gl);
        shader.setProjection(gl, this.currentRenderTarget.projectionMatrix);
        this.currentShader = shader;
    }

    /**
     * activate a renderTarget
     **/
     Render.prototype.activateRenderTarget = function(renderTarget) {
         if(this.currentRenderTarget == renderTarget) {
             return;
         }

         if(this.currentShader) {
             var gl = this.gl;
             this.currentShader.setProjection(gl, renderTarget.projectionMatrix)
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

        // save matrix
        var transform = this.currentRenderBuffer.transform;

        // create matrix is slow, so i cache it on displayObject, even this looks ugly
        // var matrix = Matrix.create();
        var matrix = displayObject.parentTransform;
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

            filterMatrix = zen.Matrix.create();
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

            this.currentRenderBuffer.cacheQuad(this, mask.x, mask.y, mask.width, mask.height, transform);

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
            this.currentRenderBuffer.cache(this, displayObject);
        }

        // if blend, reset blend mode
        if(displayObject.blend != this.defaultBlendMode) {
            this.currentRenderBuffer.cacheBlendMode(this.defaultBlendMode);
        }

        // if mask, popMask
        if(displayObject.mask) {
            // TODO handle mask
            var mask = displayObject.mask;

            this.currentRenderBuffer.cacheQuad(this, mask.x, mask.y, mask.width, mask.height, transform);

            this.currentRenderBuffer.cacheMaskPop();
        }

        // if filter, popFilters, restoreMatrix
        if(displayObject.filters.length > 0) {

            for(var i = 0; i < displayObject.filters.length - 1; i++) {
                this.currentRenderBuffer.cacheQuad(this, 0, 0, displayObject.width, displayObject.height, transform);
            }

            transform.copy(filterMatrix);
            zen.Matrix.release(filterMatrix);

            // last time, push vertices by real transform
            this.currentRenderBuffer.cacheQuad(this, 0, 0, displayObject.width, displayObject.height, transform);

            this.currentRenderBuffer.cacheFiltersPop();
        }

        // restore matrix
        transform.copy(matrix);
        // Matrix.release(matrix);
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
                    var renderTarget = zen.RenderTarget.create(this.gl, data.width, data.height);

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
                            var flop = zen.RenderTarget.create(gl, flip.width, flip.height);

                            offset = filter.applyFilter(this, flip, flop, offset);

                            zen.RenderTarget.release(flip);

                            flip = flop;
                        }

                    }

                    var filter = filters[filters.length - 1];

                    var renderTarget = lastData.renderTarget;

                    offset = filter.applyFilter(this, flip, renderTarget, offset);

                    // release the render target
                    zen.RenderTarget.release(flip);

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

    zen.Render = Render;
})();

(function() {

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

        // 3x3 projection matrix
        this.projectionMatrix = new Float32Array(3 * 3);

        if(!this.root) {

            this.frameBuffer = gl.createFramebuffer();

            /*
                A frame buffer needs a target to render to..
                create a texture and bind it attach it to the framebuffer..
             */

            this.texture = new zen.RenderTexture(gl, width, height);

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

        this.calculateProjection();
        gl.viewport(0, 0, this.width, this.height);
    };

    /**
     * Updates the projection matrix
     */
    RenderTarget.prototype.calculateProjection = function() {
        var pm = this.projectionMatrix;

        if(!this.root) {
            pm[0] = 1 / this.width * 2;
            pm[4] = 1 / this.height * 2;

            pm[6] = -1;
            pm[7] = -1;
        } else {
            pm[0] = 1 / this.width * 2;
            pm[4] = -1 / this.height * 2;

            pm[6] = -1;
            pm[7] = 1;
        }
    }

    /**
     * destroy
     */
    RenderTarget.prototype.destroy = function() {
        // TODO destroy
    };

    zen.RenderTarget = RenderTarget;
})();

(function() {

    var DISPLAY_TYPE = zen.DISPLAY_TYPE;
    var RENDER_CMD = zen.RENDER_CMD;

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
        this.transform = new zen.Matrix();
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
                    data = zen.DrawData.getObject();
                    data.texture = displayObject.texture;
                    data.filters = displayObject.filters;

                    data.cmd = RENDER_CMD.TEXTURE;
                    this.drawData.push(data);
                }

                this.drawData[this.drawData.length - 1].count++;

                break;

            case DISPLAY_TYPE.RECT:
                if(displayObject.filters.length > 0 || this.drawData.length == 0 || this.drawData[this.drawData.length - 1].cmd != RENDER_CMD.RECT || this.drawData[this.drawData.length - 1].color != displayObject.color) {
                    data = zen.DrawData.getObject();
                    data.color = displayObject.color;

                    data.cmd = RENDER_CMD.RECT;
                    this.drawData.push(data);
                }

                this.drawData[this.drawData.length - 1].count++;

                break;

            case DISPLAY_TYPE.TEXT:
                var data = zen.DrawData.getObject();

                // if dirty, update texture
                if(displayObject.dirty) {
                    displayObject.updateTexture();
                    displayObject.dirty = false;
                }

                data.texture = displayObject.texture;
                data.filters = displayObject.filters;

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

        var data = zen.DrawData.getObject();
        data.cmd = RENDER_CMD.BLEND;
        data.blendMode = blendMode;

        this.drawData.push(data);
    }

    /**
     * cache filters push
     */
    RenderBuffer.prototype.cacheFiltersPush = function(filters, width, height) {
        var data = zen.DrawData.getObject();
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
        var data = zen.DrawData.getObject();
        data.cmd = RENDER_CMD.FILTERS_POP;
        this.drawData.push(data);
    }

    /**
     * cache mask push
     */
    RenderBuffer.prototype.cacheMaskPush = function(mask) {
        var data = zen.DrawData.getObject();
        data.cmd = RENDER_CMD.MASK_PUSH;

        data.mask = mask;

        this.drawData.push(data);
    }

    /**
     * cache mask pop
     */
    RenderBuffer.prototype.cacheMaskPop = function() {
        var data = zen.DrawData.getObject();
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
            zen.DrawData.returnObject(this.drawData[i]);
        }

        this.drawData.length = 0;

        this.verticesCount = 0;
        this.verticesIndex = 0;
        this.indicesIndex = 0;
    }

    zen.RenderBuffer = RenderBuffer;
})();

(function() {
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
    Shader.prototype.activate = function(gl) {
        gl.useProgram(this.program);
    }

    /**
     * set projection
     **/
    Shader.prototype.setProjection = function(gl, projectionMat) {
        // set projection
        var u_Projection = gl.getUniformLocation(this.program, "u_Projection");
        gl.uniformMatrix3fv(u_Projection, false, projectionMat);
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

    zen.Shader = Shader;
})();

(function() {

    /**
     * PrimitiveShader Class
     **/
    var PrimitiveShader = function(gl) {

        var vshaderSource = [
            'attribute vec2 a_Position;',
            'uniform mat3 u_Projection;',
            'void main() {',
                'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
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
    zen.inherit(PrimitiveShader, zen.Shader);

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

    zen.PrimitiveShader = PrimitiveShader;
})();

(function() {

    /**
     * TextureShader Class
     **/
    var TextureShader = function(gl) {

        var vshaderSource = [
            'attribute vec2 a_Position;',
            'attribute vec2 a_TexCoord;',
            'varying vec2 v_TexCoord;',
            'uniform mat3 u_Projection;',
            'void main() {',
                'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
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
    zen.inherit(TextureShader, zen.Shader);

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

    zen.TextureShader = TextureShader;
})();

(function() {

    /**
     * ColorTransformShader Class
     **/
    var ColorTransformShader = function(gl) {

        var vshaderSource = [
            'attribute vec2 a_Position;',
            'attribute vec2 a_TexCoord;',
            'varying vec2 v_TexCoord;',
            'uniform mat3 u_Projection;',
            'void main() {',
                'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
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
    zen.inherit(ColorTransformShader, zen.Shader);

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

    zen.ColorTransformShader = ColorTransformShader;
})();

(function() {

    /**
     * GlowShader Class
     **/
    var GlowShader = function(gl) {

        var vshaderSource = [
            'attribute vec2 a_Position;',
            'attribute vec2 a_TexCoord;',
            'varying vec2 v_TexCoord;',
            'uniform mat3 u_Projection;',
            'void main() {',
                'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
                'v_TexCoord = a_TexCoord;',
            '}'
        ].join("\n");

        var fshaderSource = [
            'precision mediump float;',
            // 'varying vec2 v_TexCoord;',
            'varying vec2 v_TexCoord;',
            // 'varying vec4 vColor;',

            'uniform sampler2D u_Sampler;',

            'uniform float distance;',
            'uniform float outerStrength;',
            'uniform float innerStrength;',
            'uniform vec4 glowColor;',
            'uniform float pixelWidth;',
            'uniform float pixelHeight;',
            'vec2 px = vec2(1.0 / pixelWidth, 1.0 / pixelHeight);',

            'void main(void) {',
                'const float quality = 8.0;',
                'const float PI = 3.14159265358979323846264;',
                'vec4 ownColor = texture2D(u_Sampler, v_TexCoord);',
                'vec4 curColor;',
                'float totalAlpha = 0.0;',
                'float maxTotalAlpha = 0.0;',
                'float cosAngle;',
                'float sinAngle;',
                'float curDistance = 0.0;',
                'for (float angle = PI * 2.0 / quality; angle <= PI * 2.0; angle += PI * 2.0 / quality) {',
                   'cosAngle = cos(angle);',
                   'sinAngle = sin(angle);',
                   'for (float d = 1.0; d <= quality; d++) {',
                       'curDistance = d * distance / quality;',
                       'curColor = texture2D(u_Sampler, vec2(v_TexCoord.x + cosAngle * curDistance * px.x, v_TexCoord.y + sinAngle * curDistance * px.y));',
                       'totalAlpha += (distance - curDistance) * curColor.a;',
                       'maxTotalAlpha += (distance - curDistance);',
                   '}',
                '}',
                'maxTotalAlpha = max(maxTotalAlpha, 0.0001);',

                'ownColor.a = max(ownColor.a, 0.0001);',
                'ownColor.rgb = ownColor.rgb / ownColor.a;',
                'float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);',
                'float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;',
                'vec3 mix1 = mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));',
                'vec3 mix2 = mix(mix1, glowColor.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));',
                'float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);',
                'gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);',
            '}',
        ].join("\n");

        GlowShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    }

    // inherit
    zen.inherit(GlowShader, zen.Shader);

    /**
     * activate this shader
     **/
    GlowShader.prototype.activate = function(gl, width, height) {

        GlowShader.superClass.activate.call(this, gl, width, height);

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
     * setDistance
     **/
    GlowShader.prototype.setDistance = function(gl, distance) {
        // sync uniform
        var u_Distance = gl.getUniformLocation(this.program, "distance");

        gl.uniform1f(u_Distance, distance);
    }

    /**
     * setColor
     **/
    GlowShader.prototype.setColor = function(gl, color) {
        // sync uniform
        var u_Color = gl.getUniformLocation(this.program, "glowColor");
        var num = parseInt(color, 10);
        var r = num / (16 * 16 * 16 * 16);
        var g = num % (16 * 16 * 16 * 16) / (16 * 16);
        var b = num % (16 * 16) / 1;
        gl.uniform4f(u_Color, r / 256, g / 256, b / 256, 1.0);
    }

    /**
     * setOuterStrength
     **/
    GlowShader.prototype.setOuterStrength = function(gl, strength) {
        // sync uniform
        var u_Strength = gl.getUniformLocation(this.program, "outerStrength");

        gl.uniform1f(u_Strength, strength);
    }

    /**
     * setInnerStrength
     **/
    GlowShader.prototype.setInnerStrength = function(gl, strength) {
        // sync uniform
        var u_Strength = gl.getUniformLocation(this.program, "innerStrength");

        gl.uniform1f(u_Strength, strength);
    }

    /**
     * setViewSize
     **/
    GlowShader.prototype.setViewSize = function(gl, width, height) {
        // sync uniform
        var u_pixelWidth = gl.getUniformLocation(this.program, "pixelWidth");

        gl.uniform1f(u_pixelWidth, width);

        var u_pixelHeight = gl.getUniformLocation(this.program, "pixelHeight");

        gl.uniform1f(u_pixelHeight, height);
    }

    zen.GlowShader = GlowShader;
})();

(function() {

    /**
     * OutlineShader Class
     **/
    var OutlineShader = function(gl) {

        var vshaderSource = [
            'attribute vec2 a_Position;',
            'attribute vec2 a_TexCoord;',
            'varying vec2 v_TexCoord;',
            'uniform mat3 u_Projection;',
            'void main() {',
                'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
                'v_TexCoord = a_TexCoord;',
            '}'
        ].join("\n");

        var fshaderSource = [
            'precision mediump float;',
            // 'varying vec2 v_TexCoord;',
            'varying vec2 v_TexCoord;',
            // 'varying vec4 vColor;',
            'uniform sampler2D u_Sampler;',

            'uniform float thickness;',
            'uniform vec4 outlineColor;',
            'uniform float pixelWidth;',
            'uniform float pixelHeight;',
            'vec2 px = vec2(1. / pixelWidth, 1. / pixelHeight);',

            'void main(void) {',
                'const float quality = 8.;',
                'const float PI = 3.14159265358979323846264;',
                'vec4 ownColor = texture2D(u_Sampler, v_TexCoord);',
                'vec4 curColor;',
                'float maxAlpha = 0.;',
                'for (float angle = (PI * 2.) / quality; angle <= PI * 2.; angle += (PI * 2.) / quality ) {',
                    'curColor = texture2D(u_Sampler, vec2(v_TexCoord.x + thickness * px.x * cos(angle), v_TexCoord.y + thickness * px.y * sin(angle)));',
                    'maxAlpha = max(maxAlpha, curColor.a);',
                '}',
                'float resultAlpha = max(maxAlpha, ownColor.a);',
                'gl_FragColor = vec4(mix(outlineColor.rgb, ownColor.rgb, ownColor.a / 1.) * resultAlpha, resultAlpha);',
            '}'
        ].join("\n");

        OutlineShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    }

    // inherit
    zen.inherit(OutlineShader, zen.Shader);

    /**
     * activate this shader
     **/
    OutlineShader.prototype.activate = function(gl, width, height) {

        OutlineShader.superClass.activate.call(this, gl, width, height);

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
     * setDistance
     **/
    OutlineShader.prototype.setThickness = function(gl, distance) {
        // sync uniform
        var u_Distance = gl.getUniformLocation(this.program, "thickness");

        gl.uniform1f(u_Distance, distance);
    }

    /**
     * setColor
     **/
    OutlineShader.prototype.setColor = function(gl, color) {
        // sync uniform
        var u_Color = gl.getUniformLocation(this.program, "outlineColor");
        var num = parseInt(color, 10);
        var r = num / (16 * 16 * 16 * 16);
        var g = num % (16 * 16 * 16 * 16) / (16 * 16);
        var b = num % (16 * 16) / 1;
        gl.uniform4f(u_Color, r / 256, g / 256, b / 256, 1.0);
    }

    /**
     * setViewSize
     **/
    OutlineShader.prototype.setViewSize = function(gl, width, height) {
        // sync uniform
        var u_pixelWidth = gl.getUniformLocation(this.program, "pixelWidth");

        gl.uniform1f(u_pixelWidth, width);

        var u_pixelHeight = gl.getUniformLocation(this.program, "pixelHeight");

        gl.uniform1f(u_pixelHeight, height);
    }

    zen.OutlineShader = OutlineShader;
})();

(function() {

    /**
     * AsciiShader Class
     **/
    var AsciiShader = function(gl) {

        var vshaderSource = [
            'attribute vec2 a_Position;',
            'attribute vec2 a_TexCoord;',
            'varying vec2 v_TexCoord;',
            'uniform mat3 u_Projection;',
            'void main() {',
                'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
                'v_TexCoord = a_TexCoord;',
            '}'
        ].join("\n");

        var fshaderSource = [
            'precision mediump float;',

            'uniform vec2 u_TextureSize;',
            'uniform float pixelSize;',
            'uniform sampler2D u_Sampler;',
            'varying vec2 v_TexCoord;',

            'float character(float n, vec2 p)',
            '{',
                'p = floor(p*vec2(4.0, -4.0) + 2.5);',
                'if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)',
                '{',
                    'if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;',
                '}',
                'return 0.0;',
            '}',

            'void main()',
            '{',
                'vec2 uv = v_TexCoord.xy;',

                'vec2 uvPixel = pixelSize / u_TextureSize;',

                'vec3 col = texture2D(u_Sampler, floor( uv / uvPixel) * uvPixel).rgb;',

                'float gray = (col.r + col.g + col.b) / 3.0;',

                'float n =  65536.0;',             // .
                'if (gray > 0.2) n = 65600.0;',    // :
                'if (gray > 0.3) n = 332772.0;',   // *
                'if (gray > 0.4) n = 15255086.0;', // o
                'if (gray > 0.5) n = 23385164.0;', // &
                'if (gray > 0.6) n = 15252014.0;', // 8
                'if (gray > 0.7) n = 13199452.0;', // @
                'if (gray > 0.8) n = 11512810.0;', // #

                'vec2 p = mod( uv / ( uvPixel * 0.5 ), 2.0) - vec2(1.0);',
                'col = col * character(n, p);',

                'gl_FragColor = vec4(col, 1.0);',
            '}'
        ].join("\n");

        AsciiShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    }

    // inherit
    zen.inherit(AsciiShader, zen.Shader);

    /**
     * activate this shader
     **/
    AsciiShader.prototype.activate = function(gl, width, height) {

        AsciiShader.superClass.activate.call(this, gl, width, height);

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
     * set texture size
     **/
    AsciiShader.prototype.setTextureSize = function(gl, width, height) {
        // sync uniform
        var u_TextureSize = gl.getUniformLocation(this.program, "u_TextureSize");

        gl.uniform2f(u_TextureSize, width, height);
    }

    /**
     * set pixelSize
     **/
    AsciiShader.prototype.setPixelSize = function(gl, size) {
        // sync uniform
        var u_pixelSize = gl.getUniformLocation(this.program, "pixelSize");

        gl.uniform1f(u_pixelSize, size);
    }

    zen.AsciiShader = AsciiShader;
})();

(function() {

    /**
     * PixelateShader Class
     **/
    var PixelateShader = function(gl) {

        var vshaderSource = [
            'attribute vec2 a_Position;',
            'attribute vec2 a_TexCoord;',
            'varying vec2 v_TexCoord;',
            'uniform mat3 u_Projection;',
            'void main() {',
                'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
                'v_TexCoord = a_TexCoord;',
            '}'
        ].join("\n");

        var fshaderSource = [
            'precision mediump float;',

            'uniform vec2 u_TextureSize;',
            'uniform float pixelSize;',
            'uniform sampler2D u_Sampler;',
            'varying vec2 v_TexCoord;',
            'vec2 uvPixel = pixelSize / u_TextureSize;',

            'void main()',
            '{',
                'vec2 uv = floor(v_TexCoord / uvPixel) * uvPixel + uvPixel * 0.5;',
                'gl_FragColor = texture2D(u_Sampler, uv);',
            '}'
        ].join("\n");

        PixelateShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    }

    // inherit
    zen.inherit(PixelateShader, zen.Shader);

    /**
     * activate this shader
     **/
    PixelateShader.prototype.activate = function(gl, width, height) {

        PixelateShader.superClass.activate.call(this, gl, width, height);

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
     * set texture size
     **/
    PixelateShader.prototype.setTextureSize = function(gl, width, height) {
        // sync uniform
        var u_TextureSize = gl.getUniformLocation(this.program, "u_TextureSize");

        gl.uniform2f(u_TextureSize, width, height);
    }

    /**
     * set pixelSize
     **/
    PixelateShader.prototype.setPixelSize = function(gl, size) {
        // sync uniform
        var u_pixelSize = gl.getUniformLocation(this.program, "pixelSize");

        gl.uniform1f(u_pixelSize, size);
    }

    zen.PixelateShader = PixelateShader;
})();

(function() {

    /**
     * BlurXShader Class
     **/
    var BlurXShader = function(gl) {

        var vshaderSource = [
            'attribute vec2 a_Position;',
            'attribute vec2 a_TexCoord;',
            'varying vec2 v_TexCoord;',
            'uniform mat3 u_Projection;',
            'void main() {',
                'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
                'v_TexCoord = a_TexCoord;',
            '}'
        ].join("\n");

        var fshaderSource = [
            'precision mediump float;',
            'uniform sampler2D u_Sampler;',
            'varying vec2 v_TexCoord;',
            'uniform float u_Blur;',
            'uniform vec2 u_TextureSize;',
            'float blurUv = u_Blur / u_TextureSize.x;',
            'void main() {',
                'vec4 color = vec4(0.0, 0.0, 0.0, 0.0);',
                'color += texture2D(u_Sampler, v_TexCoord + vec2(-3. / 3. * blurUv, 0.)) * 0.004431848411938341;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2(-2. / 3. * blurUv, 0.)) * 0.05399096651318985;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2(-1. / 3. * blurUv, 0.)) * 0.2419707245191454;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2( 0. / 3. * blurUv, 0.)) * 0.3989422804014327;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2( 1. / 3. * blurUv, 0.)) * 0.2419707245191454;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2( 2. / 3. * blurUv, 0.)) * 0.05399096651318985;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2( 3. / 3. * blurUv, 0.)) * 0.004431848411938341;',
                'gl_FragColor = color;',
            '}'
        ].join("\n");

        BlurXShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    }

    // inherit
    zen.inherit(BlurXShader, zen.Shader);

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

    zen.BlurXShader = BlurXShader;
})();

(function() {

    /**
     * BlurYShader Class
     **/
    var BlurYShader = function(gl) {

        var vshaderSource = [
            'attribute vec2 a_Position;',
            'attribute vec2 a_TexCoord;',
            'varying vec2 v_TexCoord;',
            'uniform mat3 u_Projection;',
            'void main() {',
                'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
                'v_TexCoord = a_TexCoord;',
            '}'
        ].join("\n");

        var fshaderSource = [
            'precision mediump float;',
            'uniform sampler2D u_Sampler;',
            'varying vec2 v_TexCoord;',
            'uniform float u_Blur;',
            'uniform vec2 u_TextureSize;',
            'float blurUv = u_Blur / u_TextureSize.y;',
            'void main() {',
                'vec4 color = vec4(0.0, 0.0, 0.0, 0.0);',
                'color += texture2D(u_Sampler, v_TexCoord + vec2(-3. / 3. * blurUv, 0.)) * 0.004431848411938341;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2(-2. / 3. * blurUv, 0.)) * 0.05399096651318985;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2(-1. / 3. * blurUv, 0.)) * 0.2419707245191454;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2( 0. / 3. * blurUv, 0.)) * 0.3989422804014327;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2( 1. / 3. * blurUv, 0.)) * 0.2419707245191454;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2( 2. / 3. * blurUv, 0.)) * 0.05399096651318985;',
                'color += texture2D(u_Sampler, v_TexCoord + vec2( 3. / 3. * blurUv, 0.)) * 0.004431848411938341;',
                'gl_FragColor = color;',
            '}'
        ].join("\n");

        BlurYShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    }

    // inherit
    zen.inherit(BlurYShader, zen.Shader);

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

    zen.BlurYShader = BlurYShader;
})();

(function() {

    function getGaussianDistribution(x, y, rho) {
        var g = 1 / Math.sqrt(2 * 3.141592654 * rho * rho);
        return g * Math.exp( -(x * x + y * y) / (2 * rho * rho) );
    }

    /**
     * BlurShader Class
     **/
    var BlurShader = function(gl) {

        var vshaderSource = [
            'attribute vec2 a_Position;',
            'attribute vec2 a_TexCoord;',
            'varying vec2 v_TexCoord;',
            'uniform mat3 u_Projection;',
            'void main() {',
                'gl_Position = vec4((u_Projection * vec3(a_Position, 1.0)).xy, 0.0, 1.0);',
                'v_TexCoord = a_TexCoord;',
            '}'
        ].join("\n");

        // sample times equals (halfSampleTimes * 2 + 1) * (halfSampleTimes * 2 + 1)
        var halfSampleTimes = 3;

        var totalWeight = 0;
        for(var i = -halfSampleTimes; i <= halfSampleTimes; i++) {
            for(var j = -halfSampleTimes; j <= halfSampleTimes; j++) {
                totalWeight += getGaussianDistribution(i * 3 / halfSampleTimes, j * 3 / halfSampleTimes, 1);
            }
        }

        var blurCode = "";
        for(var i = -halfSampleTimes; i <= halfSampleTimes; i++) {
            for(var j = -halfSampleTimes; j <= halfSampleTimes; j++) {
                blurCode += 'color += texture2D(u_Sampler, vec2(v_TexCoord.x + ' + (i / halfSampleTimes).toFixed(5) + ' * blurUv.x, v_TexCoord.y + ' + (j / halfSampleTimes).toFixed(5) + ' * blurUv.y)) * ' + (getGaussianDistribution(i * 3 / halfSampleTimes, j * 3 / halfSampleTimes, 1) / totalWeight).toFixed(7) + ';\n';
            }
        }

        var fshaderSource = [
            'precision mediump float;',
            'uniform sampler2D u_Sampler;',
            'varying vec2 v_TexCoord;',
            'uniform vec2 u_Blur;',
            'uniform vec2 u_TextureSize;',
            'void main() {',
                'vec2 blurUv = u_Blur / u_TextureSize;',
                'vec4 color = vec4(0.0, 0.0, 0.0, 0.0);',

                '%BLUR_CODE%',

                'gl_FragColor = color;',
            '}'
        ].join("\n").replace('%BLUR_CODE%', blurCode);

        BlurShader.superClass.constructor.call(this, gl, vshaderSource, fshaderSource);

    }

    // inherit
    zen.inherit(BlurShader, zen.Shader);

    /**
     * activate this shader
     **/
    BlurShader.prototype.activate = function(gl, width, height) {

        BlurShader.superClass.activate.call(this, gl, width, height);

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
     * setBlur
     **/
    BlurShader.prototype.setBlur = function(gl, blurX, blurY) {
        // sync uniform
        var u_Blur = gl.getUniformLocation(this.program, "u_Blur");

        gl.uniform2f(u_Blur, blurX, blurY);
    }

    /**
     * set texture size
     **/
    BlurShader.prototype.setTextureSize = function(gl, width, height) {
        // sync uniform
        var u_TextureSize = gl.getUniformLocation(this.program, "u_TextureSize");

        gl.uniform2f(u_TextureSize, width, height);
    }

    zen.BlurShader = BlurShader;
})();

(function() {
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

    zen.AbstractFilter = AbstractFilter;
})();

(function() {

    /**
     * color transform filter
     **/
    var ColorTransformFilter = function(gl) {

        this.shader = new zen.ColorTransformShader(gl);

        // color transform matrix
        this.matrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];

    }

    zen.inherit(ColorTransformFilter, zen.AbstractFilter);

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

    zen.ColorTransformFilter = ColorTransformFilter;
})();

(function() {

    /**
     * glow filter
     **/
    var GlowFilter = function(gl) {

        this.shader = new zen.GlowShader(gl);

        // sample range, distance will effect glow size
        this.distance = 15;

        // glow color
        this.color = 0xff0000;

        // outer glow strength
        this.outerStrength = 1;

        // inner glow strength
        this.innerStrength = 1;

    }

    zen.inherit(GlowFilter, zen.AbstractFilter);

    GlowFilter.prototype.applyFilter = function(render, input, output, offset) {
        render.activateShader(this.shader);
        this.shader.setDistance(render.gl, this.distance);
        this.shader.setColor(render.gl, this.color);
        this.shader.setOuterStrength(render.gl, this.outerStrength);
        this.shader.setInnerStrength(render.gl, this.innerStrength);
        this.shader.setViewSize(render.gl, input.width, input.height);

        offset = render.applyFilter(this, input, output, offset);

        return offset;
    }

    zen.GlowFilter = GlowFilter;
})();

(function() {

    /**
     * outline filter
     **/
    var OutlineFilter = function(gl) {

        this.shader = new zen.OutlineShader(gl);

        // outline thickness
        this.thickness = 4;

        // outline color
        this.color = 0xff0000;

    }

    zen.inherit(OutlineFilter, zen.AbstractFilter);

    OutlineFilter.prototype.applyFilter = function(render, input, output, offset) {
        render.activateShader(this.shader);
        this.shader.setThickness(render.gl, this.thickness);
        this.shader.setColor(render.gl, this.color);
        this.shader.setViewSize(render.gl, input.width, input.height);

        offset = render.applyFilter(this, input, output, offset);

        return offset;
    }

    zen.OutlineFilter = OutlineFilter;
})();

(function() {

    /**
     * Ascii filter
     **/
    var AsciiFilter = function(gl) {

        this.shader = new zen.AsciiShader(gl);

        this.pixelSize = 10;

    }

    zen.inherit(AsciiFilter, zen.AbstractFilter);

    AsciiFilter.prototype.applyFilter = function(render, input, output, offset) {
        render.activateShader(this.shader);
        this.shader.setPixelSize(render.gl, this.pixelSize);
        this.shader.setTextureSize(render.gl, input.width, input.height);

        offset = render.applyFilter(this, input, output, offset);

        return offset;
    }

    zen.AsciiFilter = AsciiFilter;
})();

(function() {

    /**
     * Pixelate filter
     **/
    var PixelateFilter = function(gl) {

        this.shader = new zen.PixelateShader(gl);

        this.pixelSize = 10;

    }

    zen.inherit(PixelateFilter, zen.AbstractFilter);

    PixelateFilter.prototype.applyFilter = function(render, input, output, offset) {
        render.activateShader(this.shader);
        this.shader.setPixelSize(render.gl, this.pixelSize);
        this.shader.setTextureSize(render.gl, input.width, input.height);

        offset = render.applyFilter(this, input, output, offset);

        return offset;
    }

    zen.PixelateFilter = PixelateFilter;
})();

(function() {

    /**
     * blurX filter
     **/
    var BlurXFilter = function(gl) {

        this.shader = new zen.BlurXShader(gl);

        this.blurX = 1;

    }

    zen.inherit(BlurXFilter, zen.AbstractFilter);

    BlurXFilter.prototype.applyFilter = function(render, input, output, offset) {
        render.activateShader(this.shader);
        this.shader.setBlurX(render.gl, this.blurX);
        this.shader.setTextureSize(render.gl, input.width, input.height);

        offset = render.applyFilter(this, input, output, offset);

        return offset;
    }

    zen.BlurXFilter = BlurXFilter;
})();

(function() {

    /**
     * blurY filter
     **/
    var BlurYFilter = function(gl) {

        this.shader = new zen.BlurYShader(gl);

        this.blurY = 1;

    }

    zen.inherit(BlurYFilter, zen.AbstractFilter);

    BlurYFilter.prototype.applyFilter = function(render, input, output, offset) {
        render.activateShader(this.shader);
        this.shader.setBlurY(render.gl, this.blurY);
        this.shader.setTextureSize(render.gl, input.width, input.height);

        offset = render.applyFilter(this, input, output, offset);

        return offset;
    }

    zen.BlurYFilter = BlurYFilter;
})();

(function() {

    /**
     * blur filter
     **/
    var BlurFilter = function(gl) {

        this.shader = new zen.BlurShader(gl);

        this.blurX = 2;

        this.blurY = 2;

        // TODO use help filters
        // if one of blurX and blurY equals zero, use blurXFilter or blurYFilter
        // if texture size bigger than 250, use two pass filter, because blur shader will run slow
        // this.blurXFilter = new BlurXFilter();
        // this.blurYFilter = new BlurYFilter();

    }

    zen.inherit(BlurFilter, zen.AbstractFilter);

    BlurFilter.prototype.applyFilter = function(render, input, output, offset) {
        render.activateShader(this.shader);
        this.shader.setBlur(render.gl, this.blurX, this.blurY);
        this.shader.setTextureSize(render.gl, input.width, input.height);

        offset = render.applyFilter(this, input, output, offset);

        return offset;
    }

    zen.BlurFilter = BlurFilter;
})();

(function() {
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

    zen.EventDispatcher = EventDispatcher;
})();

(function() {
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

    zen.Event = Event;
})();

(function() {

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
    zen.inherit(TouchEvent, zen.Event);

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

    zen.TouchEvent = TouchEvent;
})();

(function() {

    /**
     * LoadEvent Class
     **/
    var LoadEvent = function() {
        LoadEvent.superClass.constructor.call(this);

        this.loadedCount = 0;

        this.totalCount = 0;
    }

    // inherit
    zen.inherit(LoadEvent, zen.Event);

    /**
     * create and dispatch event
     **/
    LoadEvent.dispatchEvent = function(target, type, loadedCount, totalCount) {
        var event = new LoadEvent();
        event.type = type;
        event.target = target;
        event.loadedCount = loadedCount;
        event.totalCount = totalCount;
        target.dispatchEvent(event);
    }

    /**
     * load begin event
     **/
    LoadEvent.LOAD_BEGIN = "load_begin";

    /**
     * load processing event
     **/
    LoadEvent.LOAD_PROCESSING = "load_processing";

    /**
     * load finish event
     **/
    LoadEvent.LOAD_FINISH = "load_finish";

    zen.LoadEvent = LoadEvent;
})();

(function() {

    var BLEND_MODE = zen.BLEND_MODE;

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
        this.transform = new zen.Matrix();
        // used to cache parent transform
        this.parentTransform = new zen.Matrix();

        this.width = 0;
        this.height = 0;

        this.filters = [];

        this.blend = BLEND_MODE.SOURCE_OVER;

        this.mask = null;

        this._contentBounds = new zen.Rectangle();

        this.parent = null;

        this.concatenatedMatrix = new zen.Matrix();

        this.invertConcatenatedMatrix = new zen.Matrix();

    }

    // inherit
    zen.inherit(DisplayObject, zen.EventDispatcher);

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
     * get the transform matrix
     **/
    DisplayObject.prototype.getTransformMatrix = function() {
        // one call is better
        this.transform.setTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.anchorX * this.width, this.anchorY * this.height);

        // this.transform.identify();
        // this.transform.translate(-this.anchorX * this.width, -this.anchorY * this.height);
        // this.transform.scale(this.scaleX, this.scaleY);
        // this.transform.rotate(this.rotation);
        // this.transform.translate(this.x, this.y);

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

    zen.DisplayObject = DisplayObject;
})();

(function() {

    var DISPLAY_TYPE = zen.DISPLAY_TYPE;

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
    zen.inherit(DisplayObjectContainer, zen.DisplayObject);

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

    zen.DisplayObjectContainer = DisplayObjectContainer;
})();

(function() {

    var DISPLAY_TYPE = zen.DISPLAY_TYPE;

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
        this.sourceFrame = new zen.Rectangle();

    }

    // inherit
    zen.inherit(Sprite, zen.DisplayObject);

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

    zen.Sprite = Sprite;
})();

(function() {

    var DISPLAY_TYPE = zen.DISPLAY_TYPE;

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
    zen.inherit(Rect, zen.DisplayObject);

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

    zen.Rect = Rect;
})();

(function() {

    var DISPLAY_TYPE = zen.DISPLAY_TYPE;

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
        this.texture = new zen.Texture(gl);

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
    zen.inherit(Text, zen.DisplayObject);

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

    zen.Text = Text;
})();

(function() {
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

    zen.State = State;
})();

(function() {

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
            if(zen.isMobile()) {
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

        var temp = zen.Vec2.tempVec2;
        var touchPoint =this.getLocation(event, temp);
        var x = temp.x;
        var y = temp.y;

        var target = this.rootTarget.hitTest(x, y);

        if(!target) {
            return;
        }

        if(this.touchDownTarget[identifier] == null) {
            this.touchDownTarget[identifier] = target;
            this.useTouchesCount++;
        }

        zen.TouchEvent.dispatchEvent(target, zen.TouchEvent.TOUCH_BEGIN, x, y);
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

        var temp = zen.Vec2.tempVec2;
        var touchPoint =this.getLocation(event, temp);
        var x = temp.x;
        var y = temp.y;

        var target = this.rootTarget.hitTest(x, y);

        if(!target) {
            return;
        }

        zen.TouchEvent.dispatchEvent(target, zen.TouchEvent.TOUCH_MOVE, x, y);
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

        var temp = zen.Vec2.tempVec2;
        var touchPoint =this.getLocation(event, temp);
        var x = temp.x;
        var y = temp.y;

        var target = this.rootTarget.hitTest(x, y);
        var oldTarget = this.touchDownTarget[identifier];
        delete this.touchDownTarget[identifier];
        this.useTouchesCount--;

        if(target) {
            zen.TouchEvent.dispatchEvent(target, zen.TouchEvent.TOUCH_END, x, y);
        }

        if(target == oldTarget) {
            zen.TouchEvent.dispatchEvent(target, zen.TouchEvent.TOUCH_TAP, x, y);
        } else {
            zen.TouchEvent.dispatchEvent(oldTarget, zen.TouchEvent.TOUCH_RELEASE_OUTSIDE, x, y);
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
        point.y = (event.pageY - box.top) / this.scaleY;
        return point;
    }

    zen.TouchHandler = TouchHandler;
})();

(function() {

    var RESOLUTION_POLICY = zen.RESOLUTION_POLICY;

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

    zen.ScreenAdapter = ScreenAdapter;
})();

(function() {

    /**
     * Loader Class
     * used to load resources
     **/
    var Loader = function() {
        Loader.superClass.constructor.call(this);

        this.loadedCount = 0;
        this.totalCount = 0;

        this.cache = [];

        this.resources = {};
    }

    // inherit
    zen.inherit(Loader, zen.EventDispatcher);

    /**
     * add resources
     **/
    Loader.prototype.add = function(resource) {
        if(resource.length || resource.length == 0) {
            this.cache = this.cache.concat(resource);
        } else {
            this.cache.push(resource);
        }
        return this;
    }

    /**
     * load resources
     **/
    Loader.prototype.load = function() {
        this.totalCount = this.cache.length;
        this.loadedCount = 0;

        // dispatch load start event
        zen.LoadEvent.dispatchEvent(this, zen.LoadEvent.LOAD_BEGIN, this.loadedCount, this.totalCount);

        this._load();

    }

    Loader.prototype._load = function() {
        var resource = this.cache.shift();

        if(resource) {
            switch (resource.type) {
                case "image":

                    var image = new Image();
                    image.onload = function() {
                        this.resources[resource.name] = image;

                        this.loadedCount++;
                        // dispatch load start event
                        zen.LoadEvent.dispatchEvent(this, zen.LoadEvent.LOAD_PROCESSING, this.loadedCount, this.totalCount);

                        this._load();
                    }.bind(this);
                    image.src = resource.src;

                    break;
                case "json":

                    var request = new XMLHttpRequest();
                    request.onreadystatechange = function(event) {
                        if(event.target.readyState == 4) {
                            this.resources[resource.name] = JSON.parse(event.target.response);

                            this.loadedCount++;
                            // dispatch load start event
                            zen.LoadEvent.dispatchEvent(this, zen.LoadEvent.LOAD_PROCESSING, this.loadedCount, this.totalCount);

                            this._load();
                        }
                    }.bind(this);
                    request.open("GET", resource.src, true);
                    request.send();

                    break;
                default:
                    console.warn("unknow resource type!");
                    this._load();
            }
        } else {
            // this.cache.length = 0;
            // dispatch load finish event
            zen.LoadEvent.dispatchEvent(this, zen.LoadEvent.LOAD_FINISH, this.loadedCount, this.totalCount);
        }
    }

    /**
     * get resource
     **/
    Loader.prototype.getRes = function(name) {
        var res = this.resources[name];
        return res;
    }

    /**
     * clear resources
     **/
    Loader.prototype.clear = function() {
        this.resources = {};
    }

    zen.Loader = Loader;
})();
