// create a render
var render = new zen.Render(document.getElementById("canvas"));

var texture = zen.Texture.fromSrc(render.context, "resources/actor_32x32.png");

// create some sprites
var container = new zen.DisplayObjectContainer();

var frames = [
    // back
    new zen.Rectangle(32 * 0, 32 * 0, 32, 32),
    new zen.Rectangle(32 * 1, 32 * 0, 32, 32),
    new zen.Rectangle(32 * 2, 32 * 0, 32, 32),

    // right
    new zen.Rectangle(32 * 0, 32 * 1, 32, 32),
    new zen.Rectangle(32 * 1, 32 * 1, 32, 32),
    new zen.Rectangle(32 * 2, 32 * 1, 32, 32),

    // forward
    new zen.Rectangle(32 * 0, 32 * 3, 32, 32),
    new zen.Rectangle(32 * 1, 32 * 3, 32, 32),
    new zen.Rectangle(32 * 2, 32 * 3, 32, 32),

    // left
    new zen.Rectangle(32 * 0, 32 * 2, 32, 32),
    new zen.Rectangle(32 * 1, 32 * 2, 32, 32),
    new zen.Rectangle(32 * 2, 32 * 2, 32, 32)


];

var sprites = [];
var num = 300;

var frameCount = 0;

for(var i = 0; i < num; i++) {
    var sprite = new zen.Sprite();
    sprite.texture = texture;
    // sprite.color = 0x475846;
    sprite.x = Math.random() * 480;
    sprite.y = Math.random() * 800;
    sprite.width = 32;
    sprite.height = 32;
    // sprite.scaleX = 2;
    // sprite.scaleY = 2;
    // sprite.anchorX = 0.5;
    // sprite.anchorY = 0.5;
    sprites.push(sprite);
    container.addChild(sprite);

    var frame = frames[frameCount];
    sprite.setSourceFrame(frame);
}

// fps
var state = new zen.State();
document.body.appendChild(state.getDom());

var speed = 10;
// frame render
function loop() {

    requestAnimationFrame(loop);

    frameCount++;
    if(frameCount >= frames.length * speed) {
        frameCount = 0;
    }

    var key = Math.floor(frameCount / speed);
    // render.clear();
    for(var i = 0; i < num; i++) {
        var sprite = sprites[i];

        if(key == 0 || key == 1 || key == 2) {
            sprite.y += 1;
        }
        if(key == 3 || key == 4 || key == 5) {
            sprite.x += 1;
        }
        if(key == 6 || key == 7 || key == 8) {
            sprite.y -= 1;
        }
        if(key == 9 || key == 10 || key == 11) {
            sprite.x -= 1;
        }

        var frame = frames[key];
        sprite.setSourceFrame(frame);
    }

    var drawCall = render.render(container);

    state.update(drawCall);
}

loop();
