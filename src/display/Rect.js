/**
 * A Sample Rect Class
 * you can give it a color
 **/
var Rect = function() {

    Rect.superClass.constructor.call(this);

    this.renderType = "rect";

    // color
    this.color = 0x000000;

}

// inherit
Util.inherit(Rect, DisplayObject);

/**
 * get vertices data of this
 **/
Rect.prototype.getVertices = function() {
    return [
        this.x, this.y, 0, 0,
        this.x + this.width, this.y, 1, 0,
        this.x + this.width, this.y + this.height, 1, 1,
        this.x, this.y + this.height, 0, 1
    ];
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
    data.transform = this.getTransformMatrix();
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
