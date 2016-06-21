// create a render
var render = new Render(document.getElementById("canvas"));

var texture = Texture.fromSrc(render.context, "resources/bg.jpeg");

var container = new DisplayObjectContainer();
container.width = 478;
container.height = 319;

var filter = new ColorTransformFilter(render.context);

var sprite = new Sprite();
sprite.texture = texture;
sprite.x = 0;
sprite.y = 300;
sprite.width = 478;
sprite.height = 319;
container.addChild(sprite);

var text = new Text(render.context);
text.y = 300;
container.addChild(text);

sprite.filters = [filter];

// fps
// var state = new State();
// document.body.appendChild(state.getDom());

var time = 0;
// frame render
function loop() {

    requestAnimationFrame(loop);

    // 时间流逝 0.02hour
    time += 0.02;

    if(time > 24) {
        time = time % 24;
    }

    // 计时器
    text.text = (Math.floor(time) > 12 ? "pm. " + Math.floor(time - 12) : "am. " + Math.floor(time)) + ":" + Math.floor((time - Math.floor(time)) * 60);
    text.fontColor = 0xffffff;

    var colorValue = (time - 9) / 24 * 2 * Math.PI;
    // 太阳光
    filter.matrix[0] = Math.sin(colorValue) * 0.6;
    filter.matrix[5] = Math.sin(colorValue) * 0.6;
    filter.matrix[10] = Math.sin(colorValue) * 0.6;

    // 补偿光
    filter.matrix[3] = Math.sin(colorValue) * 0.2;
    filter.matrix[7] = Math.sin(colorValue) * 0.2;
    filter.matrix[11] = Math.sin(colorValue) * 0.2;

    // 黄昏的夕阳
    var yellow = Math.sin(colorValue - Math.PI * 2 / 4);
    filter.matrix[3] += Math.max(0 ,yellow * 0.4);
    filter.matrix[7] += Math.max(0 ,yellow * 0.55);

    var drawCall = render.render(container);
    // state.update(drawCall);
}

// start!!!
loop();
