// create a render
var render = new zen.Render(document.getElementById("canvas"));

// var texture = Texture.fromSrc(render.context, "resources/bunny.png");

var rect = new zen.Rect();
rect.width = render.width;
rect.height = render.height;
rect.color = 0xffffff;


// create some sprites

var sprite = new zen.Sprite();
// sprite.texture = texture;
// sprite.color = 0x475846;
sprite.x = 0;
sprite.y = 0;
sprite.width = 2;
sprite.height = 122;
// sprite.anchorX = 0.5;
// sprite.anchorY = 0.5;
// sprites.push(sprite);

// fps
var state = new zen.State();
document.body.appendChild(state.getDom());

var _sprite = new zen.Sprite();
_sprite.width = 2;
_sprite.height = 122;
_sprite.x = 100;
_sprite.y = 100;
_sprite.anchorX = 0.5;


//
var image = new Image();
image.src = "resources/1.png";
image.onload = function() {
    var texture = zen.Texture.fromImage(render.context, image);

    sprite.texture = texture;

    var renderTarget = new zen.RenderTarget(render.context, 2, 122);

    render.activateRenderTarget(renderTarget);

    render.render(sprite);

    //
    render.activateRenderTarget(render.rootRenderTarget);
    _sprite.texture = renderTarget.texture;
    // render.render(_sprite);

    // start!!!
    loop();
}

// frame render
function loop() {

    requestAnimationFrame(loop);

    _sprite.rotation += 0.01;

    var drawCall = render.render(rect);
    drawCall += render.render(_sprite);

    // RenderTarget.release(renderTarget);

    state.update(drawCall);
}
