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
 **/
Rect.prototype.getCoords = function() {
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
 **/
Rect.prototype.getProps = function() {
    // no use
    var props = [
        0, 0,
        0, 0,
        0, 0,
        0, 0
    ];

    return props;
}

/**
 * get indices data of this
 **/
Rect.prototype.getIndices = function() {
    return [
        0, 1, 2,
        2, 3, 0
    ];
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
