// create a render
var render = new Render(document.getElementById("canvas"));

var texture = Texture.fromPVR(render.context, "resources/textures/shannon-pvrtc-4bpp-rgba.pvr");

var container = new DisplayObjectContainer();
container.width = 480;
container.height = 800;

// for(var i = 0; i < 1; i++) {
    var sprite = new Sprite();
    sprite.texture = texture;
    sprite.anchorX = 0.5;
    sprite.anchorY = 0.5;
    sprite.x = 480 / 2;
    sprite.y = 800 / 2;
    sprite.width = 512;
    sprite.height = 512;

    container.addChild(sprite);
// }

// console.log("render object number:", num)


// fps
var state = new State();
document.body.appendChild(state.getDom());

// frame render
function loop() {

    requestAnimationFrame(loop);

    // render.clear();

    var drawCall = render.render(container);

    state.update(drawCall);
}

// start!!!
loop();
