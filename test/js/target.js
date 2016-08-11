// create a render
var render = new zen.Render(document.getElementById("canvas"));

// var texture = Texture.fromSrc(render.context, "resources/bunny.png");

// create some sprites
var sprites = [];
var container = new zen.DisplayObjectContainer();
container.width = 300;
container.height = 300;

var num = 2000;
for(var i = 0; i < num; i++) {
    var sprite = new zen.Sprite();
    // sprite.texture = texture;
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

var _sprite = new zen.Sprite();
_sprite.width = container.width;
_sprite.height = container.height;

// if you use a render target, you must make sure the texture is inited
// so here we use fromImage (not fromSrc) to create texture
var image = new Image();
image.src = "resources/bunny.png";
image.onload = function() {
    var texture = zen.Texture.fromImage(render.context, image);

    for(var i = 0; i < num; i++) {
        var sprite = sprites[i];
        sprite.texture = texture;
    }

    // var renderTarget = RenderTarget.create(render.context, container.width, container.height);
    var renderTarget = new zen.RenderTarget(render.context, container.width, container.height);

    render.activateRenderTarget(renderTarget);

    render.render(container);

    render.activateRenderTarget(render.rootRenderTarget);

    _sprite.texture = renderTarget.texture;

    // start!!!
    loop();
}

// frame render
function loop() {

    requestAnimationFrame(loop);

    var drawCall = render.render(_sprite);

    // RenderTarget.release(renderTarget);

    state.update(drawCall);
}
