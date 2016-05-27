/**
 * EventDispatcher Class
 **/
var EventDispatcher = function() {
    this.eventMap = {};
}

/**
 * add a event listener
 **/
EventDispatcher.prototype.addEventListener = function(type, listener, thisObject) {
    var list = this.eventMap[type];

    if(!list) {
        list = this.eventMap[type] = [];
    }

    list.push({listener: listener, thisObject: thisObject});
}

/**
 * remove a event listener
 **/
EventDispatcher.prototype.removeEventListener = function(type, listener, thisObject) {
    var list = this.eventMap[type];

    if(!list) {
        return;
    }

    for(var i = 0, len = list.length; i < len; i++) {
        var bin = list[i];
        if(bin.listener == listener && bin.thisObject == thisObject) {
            list.splice(i, 1);
            break;
        }
    }
}

/**
 * dispatch a event
 **/
EventDispatcher.prototype.dispatchEvent = function(type) {
    var list = this.eventMap[type];

    if(!list) {
        return;
    }

    for(var i = 0, len = list.length; i < len; i++) {
        var bin = list[i];
        bin.listener.call(bin.thisObject);
    }
}
