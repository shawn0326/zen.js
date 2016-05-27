/**
 * DisplayObject Class
 * base class of all display objects
 * inherit from EventDispatcher, so display object can dispatcher event
 **/
var DisplayObject = function() {

    DisplayObject.superClass.constructor.call(this);

    // type of this display object
    // typeof DISPLAY_TYPE
    this.type = null;

    // bla bla ...
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.anchorX = 0;
    this.anchorY = 0;

    // a 4x4 transform matrix
    this.transform = new Matrix();

    this.width = 0;
    this.height = 0;

    this.filters = [];

    this.blend = BLEND_MODE.SOURCE_OVER;

    this.mask = null;

    this._bounds = new Rectangle();

}

// inherit
Util.inherit(DisplayObject, EventDispatcher);

/**
 * get coords data of this
 **/
DisplayObject.prototype.getCoords = function() {

}

/**
 * get props data of this
 **/
DisplayObject.prototype.getProps = function() {

}

/**
 * get indices data of this
 **/
DisplayObject.prototype.getIndices = function() {

};

/**
 * get draw data of this
 **/
DisplayObject.prototype.getDrawData = function(render) {

};

/**
 * prepare draw for a render
 **/
// DisplayObject.prototype.prepareDraw = function(render) {
//
// };

/**
 * get the transform matrix
 **/
DisplayObject.prototype.getTransformMatrix = function() {

    this.transform.identify();
    this.transform.translate(-this.anchorX * this.width, -this.anchorY * this.height);
    this.transform.scale(this.scaleX, this.scaleY);
    this.transform.rotate(this.rotation);
    this.transform.translate(this.x, this.y);

    return this.transform;
}

/**
 * get bounds
 **/
DisplayObject.prototype.getBounds = function() {
    var bounds = this._bounds;

    // TODO not considered transform
    bounds.x = this.x - this.anchorX * this.width;
    bounds.y = this.y - this.anchorY * this.height;
    bounds.width = this.width;
    bounds.height = this.height;

    return this._bounds;
}

/**
 * hit test
 **/
DisplayObject.prototype.hitTest = function(x, y) {
    var bounds = this.getBounds();
    return (x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height);
}
