(function() {

    var DISPLAY_TYPE = zen.DISPLAY_TYPE;

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
    zen.inherit(DisplayObjectContainer, zen.DisplayObject);

    /**
     * add child
     **/
    DisplayObjectContainer.prototype.addChild = function(displayObject) {
        this.children.push(displayObject);
        displayObject.parent = this;
    }

    /**
     * remove child
     **/
    DisplayObjectContainer.prototype.removeChild = function(displayObject) {
        for(var i = 0; i < this.children.length;) {
            var child = this.children[i];
            if(child == displayObject) {
                this.children.splice(i, 1);
                child.parent = null;
                break;
            }
            i++;
        }
    }

    /**
     * hit test(rewrite)
     **/
    DisplayObjectContainer.prototype.hitTest = function(x, y) {
        var target = null;

        for(var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            target = child.hitTest(x, y);
            if(target) {
                break;
            }
        }

        return target || DisplayObjectContainer.superClass.hitTest.call(this);
    }

    zen.DisplayObjectContainer = DisplayObjectContainer;
})();
