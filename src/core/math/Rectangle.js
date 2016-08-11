(function() {
    /**
     * Rectangle Class
     */
    var Rectangle = function(x, y, width, height) {
        this.set(x, y, width, height);
    }

    /**
     * set values of this rectangle
     */
    Rectangle.prototype.set = function(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    }

    /**
     * copy values from other rectangle
     */
    Rectangle.prototype.copy = function(rectangle) {
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.width = rectangle.width;
        this.height = rectangle.height;
    }

    /**
     * is this rectangle contains a point
     */
    Rectangle.prototype.contains = function(x, y) {
        return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
    }

    zen.Rectangle = Rectangle;
})();
