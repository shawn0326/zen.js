/**
 * DisplayObject Class
 * base class of all display objects
 **/
var DisplayObjectContainer = function() {

    DisplayObjectContainer.superClass.constructor.call(this);

    this.type = DISPLAY_TYPE.CONTAINER;

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
