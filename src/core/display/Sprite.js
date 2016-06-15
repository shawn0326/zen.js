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
 * [
 *      0         , 0          ,
 *      this.width, 0          ,
 *      this.width, this.height,
 *      0         , this.height
 * ]
 **/
Sprite.prototype.getCoords = function() {
    this.coords[0] = this.coords[1] = this.coords[3] = this.coords[6] = 0;
    this.coords[2] = this.coords[4] = this.width;
    this.coords[5] = this.coords[7] = this.height;
    return this.coords;
}

/**
 * get props data of this
 * uv datas
 * [
 *     uvx      , uvy      ,
 *     uvx + uvw, uvy      ,
 *     uvx + uvw, uvy + uvh,
 *     uvx      , uvy + uvh
 * ]
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

    this.props[0] = uvx;
    this.props[1] = uvy;
    this.props[2] = uvx + uvw;
    this.props[3] = uvy;

    this.props[4] = uvx + uvw;
    this.props[5] = uvy + uvh;
    this.props[6] = uvx;
    this.props[7] = uvy + uvh;

    return this.props;
}

/**
 * get indices data of this
 **/
Sprite.prototype.getIndices = function() {
    this.indices[0] = 0;
    this.indices[1] = 1;
    this.indices[2] = 2;

    this.indices[3] = 2;
    this.indices[4] = 3;
    this.indices[5] = 0;

    return this.indices;
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
