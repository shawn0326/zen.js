(function() {
    /**
     * Vec2 Class
     */
    var Vec2 = function(x, y) {
        this.set(x, y);
    }

    /**
     * set values of this vec2
     */
    Vec2.prototype.set = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    /**
     * identify matrix
     **/
    Vec2.prototype.identify = function() {
        this.set(0, 0);
    }

    /**
     * copy values from other vec2
     */
    Vec2.prototype.copy = function(vec2) {
        this.x = vec2.x;
        this.y = vec2.y;
    }

    /**
     * transform
     */
    Vec2.prototype.transform = function(matrix) {
        var x = this.x;
        var y = this.y;
        this.x = matrix.a * x + matrix.c * y + matrix.tx;
        this.y = matrix.b * x + matrix.d * y + matrix.ty;
    }

    Vec2._pool = [];

    Vec2.create = function() {
        return Vec2._pool.pop() || new Vec2();
    }

    Vec2.release = function(vec2) {
        vec2.identify();
        vec2._pool.push(matrix);
    }

    // a temp vec2 used in this framework
    Vec2.tempVec2 = new Vec2();

    zen.Vec2 = Vec2;
})();
