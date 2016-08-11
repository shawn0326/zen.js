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
