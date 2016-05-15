
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
var Texture = function(gl, src) {

    this.gl = gl;

    this.width = 0;
    this.height = 0;

    this.baseTexture = new Image();

    this.webGLTexture = gl.createTexture();

    this.loaded = false;

    if(src) {
        this.loadFromSrc(src);
    }
};

/**
 * base texture loaded, create webgl texture, get width and height
 *
 */
Texture.prototype.loadFromSrc = function(src) {
    this.baseTexture.src = src;
    this.baseTexture.onload = this.onBaseTextureLoaded.bind(this);
}

/**
 * base texture loaded, create webgl texture, get width and height
 *
 */
Texture.prototype.onBaseTextureLoaded = function() {
    var gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D, this.webGLTexture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.baseTexture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    if (isPowerOfTwo(this.baseTexture.width) && isPowerOfTwo(this.baseTexture.height)) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    this.width = this.baseTexture.width;
    this.height = this.baseTexture.height;

    this.loaded = true;
}
