// create a render
var render = new Render(document.getElementById("canvas"));

var texture = Texture.fromSrc(render.context, "resources/bg.jpeg");

// create some sprites
// var sprites = [];
// var container = new DisplayObjectContainer();
// container.width = 480;
// container.height = 800;

// var filter = new ColorTransformFilter(render.context);
// var scale = 0.9;
// filter.grayScale(0.7);

var blurXFilter = new BlurXFilter(render.context);
blurXFilter.blurX = 7;
var blurYFilter = new BlurYFilter(render.context);
blurYFilter.blurY = 7;
var blurFilter = new BlurFilter(render.context);
blurFilter.blurX = 20;
blurFilter.blurY = 20;

var container = new DisplayObjectContainer();
container.width = 480;
container.height = 800;

for(var i = 0; i < 30; i++) {
    var sprite = new Sprite();
    sprite.texture = texture;
    sprite.anchorX = 0.5;
    sprite.anchorY = 0.5;
    sprite.x = 480 / 2;
    sprite.y = 800 / 2;
    sprite.width = 300;
    sprite.height = 300;

    sprite.filters = [blurFilter];
    // sprite.filters = [blurXFilter, blurYFilter];

    container.addChild(sprite);
}

// container.filters = [blurFilter, blurFilter];
// container.filters = [blurXFilter, blurYFilter];


// console.log("render object number:", num)


// fps
var state = new State();
document.body.appendChild(state.getDom());

var colorValue = 0;
// frame render
function loop() {

    requestAnimationFrame(loop);

    colorValue += 0.01;

    // filter.hue(colorValue * 2);

    blurXFilter.blurX = Math.sin(colorValue) * 10;
    blurYFilter.blurY = Math.sin(colorValue) * 10;

    blurFilter.blurX = Math.sin(colorValue) * 10;
    blurFilter.blurY = Math.sin(colorValue) * 10;
    // blurFilter.blurX = 0;
    // blurFilter.blurY = 0;

    // render.clear();

    var drawCall = render.render(container);

    state.update(drawCall);
}

// start!!!
loop();
