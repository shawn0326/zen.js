/**
 * DisplayObject Class
 * base class of all display objects
 **/
var DisplayObjectContainer = function() {

    DisplayObjectContainer.superClass.constructor.call(this);

    // render type of this display object
    // every type has it own render function
    this.renderType = "container";

    this.children = [];

}

// inherit
Util.inherit(DisplayObjectContainer, DisplayObject);

/**
 * add child
 **/
DisplayObject.prototype.addChild = function(displayObject) {
    this.children.push(displayObject);
}

/**
 * remove child
 **/
DisplayObject.prototype.removeChild = function(displayObject) {
    for(var i = 0; i < this.children.length;) {
        var child = this.children[i];
        if(child == displayObject) {
            this.children.splice(i, 1);
            break;
        }
        i++;
    }
}
