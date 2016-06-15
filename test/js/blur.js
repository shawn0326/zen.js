// create a render
var render = new Render(document.getElementById("canvas"));

var texture = Texture.fromSrc(render.context, "resources/hi.png");

// create some sprites
// var sprites = [];
// var container = new DisplayObjectContainer();
// container.width = 480;
// container.height = 800;

var filter = new ColorTransformFilter(render.context);
var scale = 0.9;
filter.grayScale(0.7);

var blurXFilter = new BlurXFilter(render.context);
blurXFilter.blurX = 2;
var blurYFilter = new BlurYFilter(render.context);
blurYFilter.blurY = 2;

var sprite = new Sprite();
sprite.texture = texture;
sprite.anchorX = 0.5;
sprite.anchorY = 0.5;
sprite.x = 480 / 2;
sprite.y = 800 / 2;
sprite.width = 150;
sprite.height = 150;

sprite.filters = [blurXFilter];

// console.log("render object number:", num)


// fps
var state = new State();
document.body.appendChild(state.getDom());

var colorValue = 0;
// frame render
function loop() {

    requestAnimationFrame(loop);

    colorValue += 0.01;

    filter.hue(colorValue * 2);

    blurXFilter.blurX = Math.sin(colorValue) * 10;
    blurYFilter.blurY = Math.sin(colorValue) * 10;

    // render.clear();

    var drawCall = render.render(sprite);

    state.update(drawCall);
}

// start!!!
loop();