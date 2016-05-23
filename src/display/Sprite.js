/**
 * Sprite Class
 * sprite to show picture
 **/
var Sprite = function() {

    Sprite.superClass.constructor.call(this);

    this.type = DISPLAY_TYPE.SPRITE;

    // webGL texture
    this.texture = null;

    // is source frame set
    this.sourceFrameSet = false;
    // source frame
    this.sourceFrame = new Rectangle();

}

// inherit
Util.inherit(Sprite, DisplayObject);

/**
 * set source frame of this
 */
Sprite.prototype.setSourceFrame = function(x, y, width, height) {
    this.sourceFrameSet = true;

    if(arguments.length == 1) {
        // if argument is a rectangle
        this.sourceFrame.copy(x);
    } else {

        this.sourceFrame.set(x, y, width, height);
    }

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
    var textureInit = false;
    var textureWidth = 0;
    var textureHeight = 0;

    if(this.texture) {
        textureInit = this.texture.isInit;
        textureWidth = this.texture.width;
        textureHeight = this.texture.height;
    }

    // if not set source frame, set source frame by texture
    // if change texture, this will not auto change
    if(!this.sourceFrameSet) {
        if(textureInit) {
            this.setSourceFrame(0, 0, textureWidth, textureHeight);
        }
    }

    var uvx = this.sourceFrame.x / textureWidth;
    var uvy = this.sourceFrame.y / textureHeight;
    var uvw = this.sourceFrame.width / textureWidth;
    var uvh = this.sourceFrame.height / textureHeight;

    var props = [
        uvx      , uvy      ,
        uvx + uvw, uvy      ,
        uvx + uvw, uvy + uvh,
        uvx      , uvy + uvh
    ];

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
