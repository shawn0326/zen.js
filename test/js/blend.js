// create a render
var render = new zen.Render(document.getElementById("canvas"));

var texture = zen.Texture.fromSrc(render.context, "resources/bunny.png");

// var renderTarget = new RenderTarget(render.context, render.width, render.height, false);

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
    // if(i > 200)
    sprite.blend = zen.BLEND_MODE.ADD;
    // sprite.blend = BLEND_MODE.MULTIPLY;
    // sprite.blend = BLEND_MODE.SCREEN;
    // if(i > 500)
    // sprite.blend = BLEND_MODE.LIGHTER;
    // if(i > 1000)
    // sprite.blend = BLEND_MODE.DESTINATION_OUT;
    // if(i > 1500)
    // sprite.blend = BLEND_MODE.DESTINATION_IN;
    container.addChild(sprite);
}

console.log("render object number:", num)

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
