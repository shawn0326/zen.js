// create a render
var render = new zen.Render(document.getElementById("canvas"));

var texture = zen.Texture.fromSrc(render.context, "resources/bunny.png");

// var renderTarget = new RenderTarget(render.context, render.width, render.height, false);

var buffer = new zen.RenderBuffer(render.context);

// create some sprites
var sprites = [];
var container = new zen.DisplayObjectContainer();

var num = 2000;
for(var i = 0; i < num; i++) {
    var sprite = new zen.Sprite();
    sprite.texture = texture;
    // sprite.color = 0x475846;
    sprite.x = Math.random() * 480;
    sprite.y = Math.random() * 800;
    sprite.width = 26;
    sprite.height = 37;
    // sprite.anchorX = 0.5;
    // sprite.anchorY = 0.5;
    sprites.push(sprite);
    container.addChild(sprite);
}

// fps
var state = new zen.State();
document.body.appendChild(state.getDom());

// frame render
function loop() {

    requestAnimationFrame(loop);

    buffer.clear();
    render.activateRenderBuffer(buffer);

    var drawCall = render.render(container);

    render.activateRenderBuffer(render.rootRenderBuffer);

    state.update(drawCall);
}

// start!!!
loop();
