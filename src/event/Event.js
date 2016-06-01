/**
 * Event Class
 **/
var Event = function() {
    // event type
    this.type = "";
    // event target
    this.target = null;
}

/**
 * create and dispatch event
 **/
Event.dispatchEvent = function(target, type) {
    var event = new Event();
    event.type = type;
    event.target = target;
    target.dispatchEvent(event);
}
