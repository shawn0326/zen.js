// create a render
var render = new zen.Render(document.getElementById("canvas"));

var container = new zen.DisplayObjectContainer();
container.x = 100;
container.y = 100;

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
sprite.scaleX = 2;
sprite.rotation = 1;
container.addChild(sprite);

var sprite2 = new zen.Sprite();
sprite2.texture = texture;
sprite2.x = 300;
sprite2.y = 300;
sprite2.anchorX = 0.5;
sprite2.anchorY = 0.5;
sprite2.width = 100;
sprite2.height = 100;
container.addChild(sprite2);

var listener = function(e) {
    console.log("sprite1" + e.type, e.localX, e.localY);
    sprite.rotation+=1;
}
var listener2 = function(e) {
    console.log("sprite2" + e.type);
}
var listener3 = function(e) {
    console.log("container" + e.type);
}
// sprite.addEventListener(TouchEvent.TOUCH_BEGIN, listener, this);
// sprite.addEventListener(TouchEvent.TOUCH_MOVE, listener, this);
// sprite.addEventListener(TouchEvent.TOUCH_END, listener, this);
// sprite.addEventListener(TouchEvent.TOUCH_RELEASE_OUTSIDE, listener, this);

sprite.addEventListener(zen.TouchEvent.TOUCH_TAP, listener, this);

sprite2.addEventListener(zen.TouchEvent.TOUCH_TAP, listener2, this);

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
