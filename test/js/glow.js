// create a render
var render = new Render(document.getElementById("canvas"));

var texture = Texture.fromSrc(render.context, "resources/logo.png");

// create some sprites
var sprites = [];
var container = new DisplayObjectContainer();
container.width = 480;
container.height = 800;

var glowFilter = new GlowFilter(render.context, 15);
// glowFilter.innerStrength = 0;
glowFilter.outerStrength = 0;
glowFilter.color = 0x00ffff;

var num = 1;
for(var i = 0; i < num; i++) {
    var sprite = new Sprite();
    sprite.texture = texture;
    // sprite.color = 0x475846;
    sprite.filters = [glowFilter];
    sprite.x = 480 / 2;
    sprite.y = 800 / 2;
    sprite.width = 400;
    sprite.height = 400;
    sprite.anchorX = 0.5;
    sprite.anchorY = 0.5;
    sprites.push(sprite);
    container.addChild(sprite);
}
// container.filters = [glowFilter];

console.log("render object number:", num)

// fps
var state = new State();
document.body.appendChild(state.getDom());

var colorValue = 0;
// frame render
function loop() {

    requestAnimationFrame(loop);

    colorValue += 0.05;

    for(var i=0;i<num;i++)
    {
    //    sprites[i].rotation += 0.1;
    }

    glowFilter.outerStrength = 1 + 1 * Math.abs(Math.sin(colorValue));

    glowFilter.innerStrength = 0 + 1 * Math.abs(Math.sin(colorValue));

    // render.clear();

    var drawCall = render.render(container);

    state.update(drawCall);
}

// start!!!
loop();