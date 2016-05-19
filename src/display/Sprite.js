/**
 * A Sample Sprite Class
 * in this demo, it just a picture -_-
 **/
var Sprite = function() {

    Sprite.superClass.constructor.call(this);

    this.type = DISPLAY_TYPE.SPRITE;

    // webGL texture
    this.texture = null;

}

// inherit
Util.inherit(Sprite, DisplayObject);

/**
 * get vertices data of this
 **/
Sprite.prototype.getVertices = function(transform) {
    var t = transform;

    var vertices = [];

    var x = 0;
    var y = 0;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 0, 0);

    var x = 0 + this.width;
    var y = 0;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 0);

    var x = 0 + this.width;
    var y = 0 + this.height;
    vertices.push(t.a * x + t.c * y + t.tx, t.b * x + t.d * y + t.ty, 1, 1);

    var x = 0;
    var y = 0 + this.height;
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
