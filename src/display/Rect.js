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
    var t = this.getTransformMatrix();

    var vertices = [];

    var x = this.x;
    var y = this.y;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 0, 0);

    var x = this.x + this.width;
    var y = this.y;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 0);

    var x = this.x + this.width;
    var y = this.y + this.height;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 1);

    var x = this.x;
    var y = this.y + this.height;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 0, 1);

    return vertices;
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
