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
}

/**
 * add listeners
 * need call by user
 **/
TouchHandler.prototype.addListeners = function () {
    if (window.navigator.msPointerEnabled) {
        this.addMSPointerListener();
    } else {
        if(Util.isMobile()) {
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

    var identifyer = +event.identifyer || 0;

    var x = event.pageX;
    var y = this.canvas.height - event.pageY;

    var target = this.rootTarget.hitTest(x, y);

    if(!target) {
        return;
    }

    if(this.touchDownTarget[identifyer] == null) {
        this.touchDownTarget[identifyer] = target;
        this.useTouchesCount++;
    }

    TouchEvent.dispatchEvent(target, TouchEvent.TOUCH_BEGIN, x, y);
}

/**
 * touch move
 **/
TouchHandler.prototype.onTouchMove = function(event) {
    // console.log("touch move")
    var identifyer = +event.identifyer || 0;

    if (this.touchDownTarget[identifyer] == null) {
        return;
    }

    var x = event.pageX;
    var y = this.canvas.height - event.pageY;

    var target = this.rootTarget.hitTest(x, y);

    if(!target) {
        return;
    }

    TouchEvent.dispatchEvent(target, TouchEvent.TOUCH_MOVE, x, y);
}

/**
 * touch end
 **/
TouchHandler.prototype.onTouchEnd = function(event) {
    // console.log("touch end")
    var identifyer = +event.identifyer || 0;

    if (this.touchDownTarget[identifyer] == null) {
        return;
    }

    var x = event.pageX;
    var y = this.canvas.height - event.pageY;

    var target = this.rootTarget.hitTest(x, y);
    var oldTarget = this.touchDownTarget[identifyer];
    delete this.touchDownTarget[identifyer];
    this.useTouchesCount--;

    if(target) {
        TouchEvent.dispatchEvent(target, TouchEvent.TOUCH_END, x, y);
    }

    if(target == oldTarget) {
        TouchEvent.dispatchEvent(target, TouchEvent.TOUCH_TAP, x, y);
    } else {
        TouchEvent.dispatchEvent(oldTarget, TouchEvent.TOUCH_RELEASE_OUTSIDE, x, y);
    }
}

