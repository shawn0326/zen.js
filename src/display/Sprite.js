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
Sprite.prototype.getIndices = function() {
    return [
        0, 1, 2,
        2, 3, 0
    ];
};
