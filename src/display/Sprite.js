/**
 * A Sample Sprite Class
 * in this demo, it just a picture -_-
 **/
var Sprite = function() {

    Sprite.superClass.constructor.call(this);

    this.renderType = "sprite";

    // webGL texture
    this.texture = null;

}

// inherit
Util.inherit(Sprite, DisplayObject);

/**
 * get vertices data of this
 **/
Sprite.prototype.getVertices = function() {
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
