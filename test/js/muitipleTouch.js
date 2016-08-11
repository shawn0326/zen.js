// create a render
var render = new zen.Render(document.getElementById("canvas"));

var container = new zen.DisplayObjectContainer();

// touch handler
var touchHandler = new zen.TouchHandler(render.view, container);
touchHandler.addListeners();

var texture = zen.Texture.fromSrc(render.context, "resources/bunny.png");

var sprite = new zen.Sprite();
sprite.texture = texture;
sprite.x = 100;
sprite.y = 300;
sprite.anchorX = 0.5;
sprite.anchorY = 0.5;
sprite.width = 100;
sprite.height = 100;
container.addChild(sprite);

var sprite2 = new zen.Sprite();
sprite2.texture = texture;
sprite2.x = 200;
sprite2.y = 300;
sprite2.anchorX = 0.5;
sprite2.anchorY = 0.5;
sprite2.width = 100;
sprite2.height = 100;
container.addChild(sprite2);

var listener = function(e) {
    console.log("sprite1" + e.type, e.localX, e.localY);
    sprite.x = e.pageX;
    sprite.y = e.pageY;
}
var listener2 = function(e) {
    console.log("sprite2" + e.type);
    sprite2.x = e.pageX;
    sprite2.y = e.pageY;
}
var listener3 = function(e) {
    console.log("container" + e.type);
}
var biggerSize = function(e) {
    console.log("container" + e.type);
    sprite.scaleX = 1.2;
    sprite.scaleY = 1.2;
}
var restoreSize = function(e) {
    console.log("container" + e.type);
    sprite.scaleX = 1;
    sprite.scaleY = 1;
}
sprite.addEventListener(zen.TouchEvent.TOUCH_BEGIN, biggerSize, this);
sprite.addEventListener(zen.TouchEvent.TOUCH_MOVE, listener, this);
sprite.addEventListener(zen.TouchEvent.TOUCH_END, restoreSize, this);
// sprite.addEventListener(TouchEvent.TOUCH_RELEASE_OUTSIDE, listener, this);

// sprite.addEventListener(TouchEvent.TOUCH_TAP, listener, this);

sprite2.addEventListener(zen.TouchEvent.TOUCH_MOVE, listener2, this);

container.addEventListener(zen.TouchEvent.TOUCH_TAP, listener3, this);

// fps
var state = new zen.State();
document.body.appendChild(state.getDom());

// frame render
function loop() {

    requestAnimationFrame(loop);
    // render.clear();

    var drawCall = render.render(container);

    state.update(drawCall);
}

loop();
