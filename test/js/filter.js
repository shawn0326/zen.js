// create a render
var render = new Render(document.getElementById("canvas"));

var texture = Texture.fromSrc(render.context, "resources/bunny.png");

// var renderTarget = new RenderTarget(render.context, render.width, render.height, false);

// create some sprites
var sprites = [];
var container = new DisplayObjectContainer();
container.width = 480;
container.height = 800;

var filter = new ColorTransformFilter(render.context);
var scale = 0.9;
filter.grayScale(0.7);
// filter.blackAndWhite();
// filter.contrast(2);
// filter.matrix = [
//     0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0, 47.43192855600873,
//     -0.037703249837783157, 0.8609577587992641, 0.15059552388459913, 0, -36.96841498319127,
//     0.24113635128153335, -0.07441037908422492, 0.44972182064877153, 0, -7.562075277591283,
//     0, 0, 0, 1, 0
// ];
// filter.negative();
// filter.desaturate();
var blurXFilter = new BlurXFilter(render.context);
blurXFilter.blurX = 2;
var blurYFilter = new BlurYFilter(render.context);
blurYFilter.blurY = 2;

var num = 100;
for(var i = 0; i < num; i++) {
    var sprite = new Sprite();
    sprite.texture = texture;
    // sprite.color = 0x475846;
    // sprite.filters = [blurXFilter, blurYFilter];
    sprite.x = Math.random() * 480;
    sprite.y = Math.random() * 800;
    sprite.width = 26;
    sprite.height = 37;
    // sprite.anchorX = 0.5;
    // sprite.anchorY = 0.5;
    sprites.push(sprite);
    container.addChild(sprite);
}
container.filters = [blurXFilter, blurYFilter, filter];

console.log("render object number:", num)

// fps
var state = new State();
document.body.appendChild(state.getDom());

var colorValue = 0;
// frame render
function loop() {

    requestAnimationFrame(loop);

    colorValue++;

    for(var i=0;i<num;i++)
    {
       sprites[i].rotation += 0.1;
    }

    // filter.matrix[0] = Math.sin(colorValue / 30);
    // filter.matrix[5] = Math.cos(colorValue / 20);
    // filter.matrix[15] = Math.cos(colorValue / 40);

    // filter.grayScale(Math.cos(colorValue / 20));

    filter.hue(colorValue * 2);

    // render.clear();

    var drawCall = render.render(container);

    state.update(drawCall);
}

// start!!!
loop();