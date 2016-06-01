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

    this._contentBounds = new Rectangle();

    this.parent = null;

    this.concatenatedMatrix = new Matrix();

    this.invertConcatenatedMatrix = new Matrix();

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
 * get content bounds
 **/
DisplayObject.prototype.getContentBounds = function() {
    var bounds = this._contentBounds;

    bounds.x = 0;
    bounds.y = 0;
    bounds.width = this.width;
    bounds.height = this.height;

    return this._contentBounds;
}

/**
 * hit test
 **/
DisplayObject.prototype.hitTest = function(x, y) {
    var bounds = this.getContentBounds();

    var matrix = this.getInvertedConcatenatedMatrix();

    // change global position to local
    var localX = matrix.a * x + matrix.c * y + matrix.tx;
    var localY = matrix.b * x + matrix.d * y + matrix.ty;

    if(bounds.contains(localX, localY)) {
        return this;
    } else {
        return null;
    }
}

/**
 * dispatch a event (rewrite)
 **/
DisplayObject.prototype.dispatchEvent = function(event) {
    var list = this.getPropagationList();
    for(var i = 0; i < list.length; i++) {
        var object = list[i];
        object.notifyListener(event);
    }
}

/**
 * get event propagation list
 **/
DisplayObject.prototype.getPropagationList = function() {
    var list = [];
    var target = this;
    while (target) {
        list.push(target);
        target = target.parent;
    }
    return list;
}

/**
 * get concatenated matrix
 */
DisplayObject.prototype.getConcatenatedMatrix = function() {
    this.concatenatedMatrix.copy(this.getTransformMatrix());

    if(this.parent) {
        this.concatenatedMatrix.prepend(this.parent.getConcatenatedMatrix());
    }

    return this.concatenatedMatrix;
}

/**
 * get inverted concatenated matrix
 */
DisplayObject.prototype.getInvertedConcatenatedMatrix = function() {
    this.invertConcatenatedMatrix.copy(this.getConcatenatedMatrix());

    this.invertConcatenatedMatrix.invert();

    return this.invertConcatenatedMatrix;
}
