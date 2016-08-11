// create a render
var render = new zen.Render(document.getElementById("canvas"));

// var texturePVR = Texture.fromPVR(render.context, "resources/shannon.pvr");
// var texturePNG = Texture.fromSrc(render.context, "resources/shannon.png");

var texturePVRV2 = zen.Texture.fromSrc(render.context, "resources/light_pvr_v2.pvr");
var texturePVRV3 = zen.Texture.fromSrc(render.context, "resources/light_pvr_v3.pvr");
var texturePNG = zen.Texture.fromSrc(render.context, "resources/light.png");

var container = new zen.DisplayObjectContainer();
container.width = 480;
container.height = 800;

// for(var i = 0; i < 1; i++) {
    var sprite = new zen.Rect();
    sprite.color = 0xff0000;
    sprite.anchorX = 0.5;
    sprite.anchorY = 0.5;
    sprite.x = 480 / 2;
    sprite.y = 800 / 2;
    sprite.width = 480;
    sprite.height = 800;

    container.addChild(sprite);

    var sprite = new zen.Sprite();
    sprite.texture = texturePNG;
    sprite.anchorX = 0.5;
    sprite.anchorY = 0.5;
    sprite.x = 480 / 2;
    sprite.y = 800 / 2 + 200;
    sprite.width = 391;
    sprite.height = 402;

    container.addChild(sprite);

    var sprite = new zen.Sprite();
    sprite.texture = texturePVRV2;
    sprite.anchorX = 0.5;
    sprite.anchorY = 0.5;
    sprite.x = 480 / 2 - 100;
    sprite.y = 800 / 2 - 100;
    sprite.width = 512;
    sprite.height = 512;

    container.addChild(sprite);

    var sprite = new zen.Sprite();
    sprite.texture = texturePVRV3;
    sprite.anchorX = 0.5;
    sprite.anchorY = 0.5;
    sprite.x = 480 / 2 + 100;
    sprite.y = 800 / 2 - 100;
    sprite.width = 512;
    sprite.height = 512;

    container.addChild(sprite);
// }

// console.log("render object number:", num)


// fps
var state = new zen.State();
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
