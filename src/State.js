/**
 * State Class
 * show state
 **/
var State = function() {
    this.startTime = Date.now();
    this.frameCount = 0;
    this.draw = "";
    this.fps = "";

    this.dom = document.createElement("div");
    this.dom.style.cssText = "background:rgba(0, 0, 0, 0.8);position:absolute;top:0;left:0;padding:10px;min-width:180px;height:80px;fontSize:26px;color:green";
}

State.prototype.update = function(draw) {
    var endTime = Date.now();
    if(endTime - this.startTime < 1000) {
        this.frameCount ++;
    } else {
        this.fps = Math.min(this.frameCount + 1, 60);
        this.startTime = endTime;
        frameCount = 0;

        if(draw) {
            this.draw = draw;
        }

        this.show();
    }
}

State.prototype.show = function() {
    this.dom.innerHTML = "FPS :" + this.fps + "</br>"
                     + "DRAW:" + this.draw;
}

State.prototype.getDom = function() {
    return this.dom;
}