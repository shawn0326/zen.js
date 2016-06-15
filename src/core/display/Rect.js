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
Util.inherit(Rect, DisplayObject);

/**
 * get coords data of this
 * [
 *      0         , 0          ,
 *      this.width, 0          ,
 *      this.width, this.height,
 *      0         , this.height
 * ]
 **/
Rect.prototype.getCoords = function() {
    this.coords[0] = this.coords[1] = this.coords[3] = this.coords[6] = 0;
    this.coords[2] = this.coords[4] = this.width;
    this.coords[5] = this.coords[7] = this.height;

    return coords;
}

/**
 * get props data of this
 * no used!
 * [
 *     0, 0,
 *     1, 0,
 *     1, 1,
 *     0, 1
 * ]
 **/
Rect.prototype.getProps = function() {
    this.props[0] = 0;
    this.props[1] = 0;
    this.props[2] = 0;
    this.props[3] = 0;

    this.props[4] = 0;
    this.props[5] = 0;
    this.props[6] = 0;
    this.props[7] = 0;

    return this.props;
}

/**
 * get indices data of this
 **/
Rect.prototype.getIndices = function() {
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
Rect.prototype.getDrawData = function() {
    var data = DrawData.getObject();
    data.color = this.color;
    return data;
};

/**
 * prepare draw for a render
 **/
// Rect.prototype.prepareDraw = function(render, data) {
//     var gl = render.context;
//
//     render.activateShader(render.primitiveShader);
//
//     render.primitiveShader.fillColor(gl, data.color);
// };
