
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
 * uploadCompressedData
 * Uploads compressed texture data to the GPU.
 */
Texture.prototype.uploadCompressedData = function(data, width, height, levels, internalFormat, bind) {
    var gl = this.gl;

    if(!Texture.pvrtcExt) {
        Texture.pvrtcExt = gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
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
    var texture = new Texture(gl);

    var image = new Image();
    image.src = src;
    image.onload = function() {
        texture.uploadImage(image, true);
    }

    return texture;
}

/**
 * get texture from pvr
 * texture maybe not init util image is loaded
 */
Texture.fromPVR = function(gl, src) {
    var texture = new Texture(gl);

    // Load the file via XHR.
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function (ev) {
        if (xhr.status == 200) {
            // If the file loaded successfully parse it.
            parsePVR(xhr.response, function(dxtData, width, height, levels, internalFormat) {
                if (!formatSupported(internalFormat)) {
                    console.log("pvr format not supported");
                    return;
                }
                // Upload the parsed PVR data to the texture.
                texture.uploadCompressedData(dxtData, width, height, levels, internalFormat, true);
            }, function(error) {
                console.log("pvr parse fails!");
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

// PVR formats, from:
// http://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_pvrtc/
var COMPRESSED_RGB_PVRTC_4BPPV1_IMG  = 0x8C00;
var COMPRESSED_RGB_PVRTC_2BPPV1_IMG  = 0x8C01;
var COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
var COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

// ETC1 format, from:
// http://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_etc1/
var COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

var PVR_FORMAT_2BPP_RGB  = 0;
var PVR_FORMAT_2BPP_RGBA = 1;
var PVR_FORMAT_4BPP_RGB  = 2;
var PVR_FORMAT_4BPP_RGBA = 3;
var PVR_FORMAT_ETC1      = 6;
var PVR_FORMAT_DXT1      = 7;
var PVR_FORMAT_DXT3      = 9;
var PVR_FORMAT_DXT5      = 5;

var PVR_HEADER_LENGTH = 13; // The header length in 32 bit ints.
var PVR_MAGIC = 0x03525650; //0x50565203;

// Offsets into the header array.
var PVR_HEADER_MAGIC = 0;
var PVR_HEADER_FORMAT = 2;
var PVR_HEADER_HEIGHT = 6;
var PVR_HEADER_WIDTH = 7;
var PVR_HEADER_MIPMAPCOUNT = 11;
var PVR_HEADER_METADATA = 12;

// is format Supported
function formatSupported(format) {
    switch (format) {
        case COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
        case COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
        case COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
        case COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
            return true;

        default:
            return false;
    }
}

// Calcualates the size of a compressed texture level in bytes
function textureLevelSize(format, width, height) {
    switch (format) {
        case COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
        case COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
            return Math.floor((Math.max(width, 8) * Math.max(height, 8) * 4 + 7) / 8);

        case COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
        case COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
            return Math.floor((Math.max(width, 16) * Math.max(height, 8) * 2 + 7) / 8);

        default:
            return 0;
    }
}

// webgl get extension
function getExtension(gl, name) {
    var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
    var ext = null;
    for (var i in vendorPrefixes) {
        ext = gl.getExtension(vendorPrefixes[i] + name);
        if (ext) { break; }
    }
    return ext;
}

// Parse a PVR file and provide information about the raw texture data it contains to the given callback.
function parsePVR(arrayBuffer, callback, errorCallback) {
    // Callbacks must be provided.
    if (!callback || !errorCallback) { return; }

    // Get a view of the arrayBuffer that represents the DDS header.
    var header = new Int32Array(arrayBuffer, 0, PVR_HEADER_LENGTH);

    // Do some sanity checks to make sure this is a valid DDS file.
    if(header[PVR_HEADER_MAGIC] != PVR_MAGIC) {
        console.log("Invalid magic number in PVR header");
        return 0;
    }

    // Determine what type of compressed data the file contains.
    var format = header[PVR_HEADER_FORMAT];
    var internalFormat;
    switch(format) {
        case PVR_FORMAT_2BPP_RGB:
            internalFormat = COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
            break;

        case PVR_FORMAT_2BPP_RGBA:
            internalFormat = COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
            break;

        case PVR_FORMAT_4BPP_RGB:
            internalFormat = COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
            break;

        case PVR_FORMAT_4BPP_RGBA:
            internalFormat = COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
            break;

        case PVR_FORMAT_ETC1:
            internalFormat = COMPRESSED_RGB_ETC1_WEBGL;
            break;

        case PVR_FORMAT_DXT1:
            internalFormat = COMPRESSED_RGB_S3TC_DXT1_EXT;
            break;

        case PVR_FORMAT_DXT3:
            internalFormat = COMPRESSED_RGBA_S3TC_DXT3_EXT;
            break;

        case PVR_FORMAT_DXT5:
            internalFormat = COMPRESSED_RGBA_S3TC_DXT5_EXT;
            break;

        default:
            congsole.log("Unsupported PVR format: " + format);
            return;
    }

    // Gather other basic metrics and a view of the raw the DXT data.
    var width = header[PVR_HEADER_WIDTH];
    var height = header[PVR_HEADER_HEIGHT];
    var levels = header[PVR_HEADER_MIPMAPCOUNT];
    var dataOffset = header[PVR_HEADER_METADATA] + 52;
    var pvrtcData = new Uint8Array(arrayBuffer, dataOffset);

    // Pass the PVRTC information to the callback for uploading.
    callback(pvrtcData, width, height, levels, internalFormat);
}
