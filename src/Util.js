var Util = {
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
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
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

        return texture;
    }

}
