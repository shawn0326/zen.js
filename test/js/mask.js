// create a render
var render = new zen.Render(document.getElementById("canvas"));

var texture = zen.Texture.fromSrc(render.context, "resources/bunny.png");

// var renderTarget = new RenderTarget(render.context, render.width, render.height, false);

// create some sprites
var sprites = [];
var container = new zen.DisplayObjectContainer();
container.width = 480;
container.height = 800;

var sprite = new zen.Sprite();
sprite.texture = texture;
sprite.x = 100;
sprite.y = 100;
sprite.width = 100;
sprite.height = 100;
sprite.mask = new zen.Rectangle(0, 0, 50, 50);
container.addChild(sprite);

var sprite = new zen.Sprite();
sprite.texture = texture;
sprite.x = 50;
sprite.y = 50;
sprite.width = 100;
sprite.height = 100;
sprite.mask = new zen.Rectangle(0, 0, 50, 50);
container.addChild(sprite);


// TODO unknow bug?????
var mask = new zen.Rectangle(0, 0, 150, 150);

// container.mask = mask;


// var num = 200;
// for(var i = 0; i < num; i++) {
//     var sprite = new Sprite();
//     sprite.texture = texture;
//     // sprite.color = 0x475846;
//     sprite.x = Math.random() * 480;
//     sprite.y = Math.random() * 800;
//     sprite.width = 26;
//     sprite.height = 37;
//     // sprite.anchorX = 0.5;
//     // sprite.anchorY = 0.5;
//     sprites.push(sprite);
//     sprite.mask = new Rectangle(0, 0, 10, 10);
//     container.addChild(sprite);
// }
// container.mask = mask;

// console.log("render object number:", num)

// fps
var state = new zen.State();
document.body.appendChild(state.getDom());

// frame render
function loop() {

    requestAnimationFrame(loop);
    // render.clear();
    mask.x += Math.random() * 2 - 1;
    mask.y += Math.random() * 2 - 1;

    var drawCall = render.render(container);

    state.update(drawCall);
}

loop();
