// create a render
var render = new Render(document.getElementById("canvas"));

var texture = Texture.fromSrc(render.context, "resources/bunny.png");

// var renderTarget = new RenderTarget(render.context, render.width, render.height, false);

var container = new DisplayObjectContainer();
// container.x = 100;
// container.y = 100;
container.width = 300;
container.height = 300;
container.anchorX = 0.5;
container.anchorY = 0;
container.x = 480 / 2;
container.y = 800 / 2;
container.scaleY = 0.5;

var sprites = [];
var num = 3000;
for(var i = 0; i < num; i++) {
    var sprite = new Sprite();
    sprite.texture = texture;
    // sprite.color = 0x475846;
    sprite.x = Math.random() * (300 - 26);
    sprite.y = Math.random() * (300 - 37);
    sprite.width = 26;
    sprite.height = 37;
    // sprite.anchorX = 0.5;
    // sprite.anchorY = 0.5;
    sprites.push(sprite);
    container.addChild(sprite);
}

console.log("render object number:", num)

// fps
var state = new State();
document.body.appendChild(state.getDom());

// frame render
function loop() {

    requestAnimationFrame(loop);
    // render.clear();

    container.rotation += 0.01;
    // container.x += 1;

    var drawCall = render.render(container);

    state.update(drawCall);
}

// start!!!
loop();