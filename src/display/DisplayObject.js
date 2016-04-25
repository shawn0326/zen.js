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
