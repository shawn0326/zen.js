// create a render
var render = new zen.Render(document.getElementById("canvas"));

var texture = zen.Texture.fromSrc(render.context, "resources/bunny.png");

// var renderTarget = new RenderTarget(render.context, render.width, render.height, false);

// create some sprites
var sprites = [];
var container = new zen.DisplayObjectContainer();

var num = 10;
for(var i = 0; i < num; i++) {
    var sprite = new zen.Text(render.context);
    // sprite.text = "1234,TEST";
    sprite.text = "中文";
    sprite.fontSize = 30;
    // sprite.fontFamily = "Cursive";
    sprite.x = Math.random() * 380;
    sprite.y = Math.random() * 400;
    // sprite.width = 100;
    // sprite.height = 24;
    // sprite.anchorX = 0.5;
    // sprite.anchorY = 0.5;
    sprites.push(sprite);
    container.addChild(sprite);
}

console.log("render object number:", num)

// fps
var state = new zen.State();
document.body.appendChild(state.getDom());

var count = 0;
// frame render
function loop() {

    requestAnimationFrame(loop);
    // render.clear();
    count++;
    sprites[0].text = count;

    var drawCall = render.render(container);

    state.update(drawCall);
}

loop();
