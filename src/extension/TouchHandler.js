(function() {

    /**
     * TouchHandler Class
     * handle touch event
     **/
    var TouchHandler = function(canvas, rootTarget) {

        this.canvas = canvas;

        this.rootTarget = rootTarget;

        this.touchDownTarget = {};

        this.useTouchesCount = 0;

        this.maxTouches = 6;

        // scale rate will change touch position mapping
        this.scaleX = 1;
        this.scaleY = 1;
    }

    /**
     * add listeners
     * need call by user
     **/
    TouchHandler.prototype.addListeners = function () {
        if (window.navigator.msPointerEnabled) {
            this.addMSPointerListener();
        } else {
            if(zen.isMobile()) {
                this.addTouchListener();
            } else {
                this.addMouseListener();
            }
        }
    }

    /**
     * add MSPointer listeners
     * for microsoft
     **/
    TouchHandler.prototype.addMSPointerListener = function () {
        var _this = this;
        this.canvas.addEventListener("MSPointerDown", function (event) {
            event.identifier = event.pointerId;
            _this.onTouchBegin(event);
            _this.prevent(event);
        }, false);
        this.canvas.addEventListener("MSPointerMove", function (event) {
            event.identifier = event.pointerId;
            _this.onTouchMove(event);
            _this.prevent(event);
        }, false);
        this.canvas.addEventListener("MSPointerUp", function (event) {
            event.identifier = event.pointerId;
            _this.onTouchEnd(event);
            _this.prevent(event);
        }, false);
    }

    /**
     * add Mouse listeners
     * for desktop
     **/
    TouchHandler.prototype.addMouseListener = function () {
        this.canvas.addEventListener("mousedown", this.onTouchBegin.bind(this));
        this.canvas.addEventListener("mousemove", this.onTouchMove.bind(this));
        this.canvas.addEventListener("mouseup", this.onTouchEnd.bind(this));
    }

    /**
     * add touch listeners
     * for mobile device
     **/
    TouchHandler.prototype.addTouchListener = function () {
        var _this = this;
        this.canvas.addEventListener("touchstart", function (event) {
            var l = event.changedTouches.length;
            for (var i = 0; i < l; i++) {
                _this.onTouchBegin(event.changedTouches[i]);
            }
            _this.prevent(event);
        }, false);
        this.canvas.addEventListener("touchmove", function (event) {
            var l = event.changedTouches.length;
            for (var i = 0; i < l; i++) {
                _this.onTouchMove(event.changedTouches[i]);
            }
            _this.prevent(event);
        }, false);
        this.canvas.addEventListener("touchend", function (event) {
            var l = event.changedTouches.length;
            for (var i = 0; i < l; i++) {
                _this.onTouchEnd(event.changedTouches[i]);
            }
            _this.prevent(event);
        }, false);
        this.canvas.addEventListener("touchcancel", function (event) {
            var l = event.changedTouches.length;
            for (var i = 0; i < l; i++) {
                _this.onTouchEnd(event.changedTouches[i]);
            }
            _this.prevent(event);
        }, false);
    }

    /**
     * prevent default event
     **/
    TouchHandler.prototype.prevent = function (event) {
        event.stopPropagation();
        if (event["isScroll"] != true && !this.canvas['userTyping']) {
            event.preventDefault();
        }
    };

    /**
     * touch begin
     **/
    TouchHandler.prototype.onTouchBegin = function(event) {
        if (this.useTouchesCount >= this.maxTouches) {
            return;
        }

        var identifier = +event.identifier || 0;

        var temp = zen.Vec2.tempVec2;
        var touchPoint =this.getLocation(event, temp);
        var x = temp.x;
        var y = temp.y;

        var target = this.rootTarget.hitTest(x, y);

        if(!target) {
            return;
        }

        if(this.touchDownTarget[identifier] == null) {
            this.touchDownTarget[identifier] = target;
            this.useTouchesCount++;
        }

        zen.TouchEvent.dispatchEvent(target, zen.TouchEvent.TOUCH_BEGIN, x, y);
    }

    /**
     * touch move
     **/
    TouchHandler.prototype.onTouchMove = function(event) {
        // console.log("touch move")
        var identifier = +event.identifier || 0;

        if (this.touchDownTarget[identifier] == null) {
            return;
        }

        var temp = zen.Vec2.tempVec2;
        var touchPoint =this.getLocation(event, temp);
        var x = temp.x;
        var y = temp.y;

        var target = this.rootTarget.hitTest(x, y);

        if(!target) {
            return;
        }

        zen.TouchEvent.dispatchEvent(target, zen.TouchEvent.TOUCH_MOVE, x, y);
    }

    /**
     * touch end
     **/
    TouchHandler.prototype.onTouchEnd = function(event) {
        // console.log("touch end")
        var identifier = +event.identifier || 0;

        if (this.touchDownTarget[identifier] == null) {
            return;
        }

        var temp = zen.Vec2.tempVec2;
        var touchPoint =this.getLocation(event, temp);
        var x = temp.x;
        var y = temp.y;

        var target = this.rootTarget.hitTest(x, y);
        var oldTarget = this.touchDownTarget[identifier];
        delete this.touchDownTarget[identifier];
        this.useTouchesCount--;

        if(target) {
            zen.TouchEvent.dispatchEvent(target, zen.TouchEvent.TOUCH_END, x, y);
        }

        if(target == oldTarget) {
            zen.TouchEvent.dispatchEvent(target, zen.TouchEvent.TOUCH_TAP, x, y);
        } else {
            zen.TouchEvent.dispatchEvent(oldTarget, zen.TouchEvent.TOUCH_RELEASE_OUTSIDE, x, y);
        }
    }

    /**
     * update scale
     **/
    TouchHandler.prototype.updateScale = function(scaleX, scaleY) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }

    /**
     * touch end
     **/
    TouchHandler.prototype.getLocation = function(event, point) {
        var box = this.canvas.getBoundingClientRect();
        point.x = (event.pageX - box.left) / this.scaleX;
        point.y = (event.pageY - box.top) / this.scaleY;
        return point;
    }

    zen.TouchHandler = TouchHandler;
})();
