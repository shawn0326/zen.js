// create a render
var render = new zen.Render(document.getElementById("canvas"));

var texture = zen.Texture.fromSrc(render.context, "resources/bunny.png");

// create some sprites
var container = new zen.DisplayObjectContainer();

var frames = [
    new zen.Rectangle(0, 0, 10, 10),
    new zen.Rectangle(10, 0, 10, 10),
    new zen.Rectangle(0, 10, 10, 10),
    new zen.Rectangle(10, 10, 10, 10),
    new zen.Rectangle(0, 20, 10, 10),
    new zen.Rectangle(10, 20, 10, 10)
]

var sizes = [
    new zen.Rectangle(0, 0, 100, 100),
    new zen.Rectangle(110, 0, 100, 100),
    new zen.Rectangle(0, 110, 100, 100),
    new zen.Rectangle(110, 110, 100, 100),
    new zen.Rectangle(0, 220, 100, 100),
    new zen.Rectangle(110, 220, 100, 100)
];

for(var i = 0; i < frames.length; i++) {
    var sprite = new zen.Sprite();
    sprite.texture = texture;

    var size = sizes[i];
    sprite.x = size.x;
    sprite.y = size.y;
    sprite.width = size.width;
    sprite.height = size.height;
    container.addChild(sprite);

    var frame = frames[i];
    sprite.setSourceFrame(frame);
}

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
