/**
 * LoadEvent Class
 **/
var LoadEvent = function() {
    LoadEvent.superClass.constructor.call(this);

    this.loadedCount = 0;

    this.totalCount = 0;
}

// inherit
Util.inherit(LoadEvent, Event);

/**
 * create and dispatch event
 **/
LoadEvent.dispatchEvent = function(target, type, loadedCount, totalCount) {
    var event = new LoadEvent();
    event.type = type;
    event.target = target;
    event.loadedCount = loadedCount;
    event.totalCount = totalCount;
    target.dispatchEvent(event);
}

/**
 * load begin event
 **/
LoadEvent.LOAD_BEGIN = "load_begin";

/**
 * load processing event
 **/
LoadEvent.LOAD_PROCESSING = "load_processing";

/**
 * load finish event
 **/
LoadEvent.LOAD_FINISH = "load_finish";
