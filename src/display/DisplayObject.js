/**
 * DisplayObject Class
 * base class of all display objects
 **/
var DisplayObject = function() {

    // render type of this display object
    // every type has it own render function
    this.renderType = "";

    // bla bla ...
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.anchorX = 0;
    this.anchorY = 0;

    // a 4x4 transform matrix
    this._transform = new Matrix();
    this.transform = new Float32Array(9);

    this.width = 0;
    this.height = 0;

}

// TODO add some transform method

/**
 * get vertices data of this
 **/
DisplayObject.prototype.getVertices = function() {

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

    this._transform.identify();
    this._transform.translate(-this.x - this.anchorX * this.width, -this.y - this.anchorY * this.height);
    this._transform.rotate(this.rotation);
    this._transform.scale(this.scaleX, this.scaleY);
    this._transform.translate(this.x + this.anchorX * this.width, this.y + this.anchorY * this.height);

    this.transform[0] = this._transform.a;
    this.transform[1] = this._transform.b;
    this.transform[2] = 0;

    this.transform[3] = this._transform.c;
    this.transform[4] = this._transform.d;
    this.transform[5] = 0;

    this.transform[6] = this._transform.tx;
    this.transform[7] = this._transform.ty;
    this.transform[8] = 1;

    return this.transform;
}
