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
