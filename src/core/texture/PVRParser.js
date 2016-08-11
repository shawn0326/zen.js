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
