
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
