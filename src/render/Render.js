/**
 * Render Class
 **/
var Render = function(view) {
    // canvas
    this.view = view;
    // gl context
    this.gl = view.getContext("webgl", {
        antialias: false, // effect performance!! default false
        // alpha: false, // effect performance, default false
        // premultipliedAlpha: false, // effect performance, default false
        stencil: true
    });
    // width and height, same with the canvas
    this.width = view.clientWidth;
    this.height = view.clientHeight;

    // render target
    this.rootRenderTarget = new RenderTarget(this.gl, this.width, this.height, true);
    this.currentRenderTarget = null;
    this.activateRenderTarget(this.rootRenderTarget);

    // render buffer
    this.rootRenderBuffer = new RenderBuffer(this.gl);
    this.currentRenderBuffer = null;
    this.activateRenderBuffer(this.rootRenderBuffer);

    // shader
    this.textureShader = new TextureShader(this.gl);
    this.primitiveShader = new PrimitiveShader(this.gl);
    this.colorTransformShader = new ColorTransformShader(this.gl);
    this.currentShader = null;

    // draw call count
    this.drawCall = 0;

    this.defaultBlendMode = "source-over";

    // init webgl
    var gl = this.gl;
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    this.setBlendMode(this.defaultBlendMode);
}

Object.defineProperties(Render.prototype, {
    /**
     * webgl context
     **/
    context:
    {
        get: function ()
        {
            return this.gl;
        }
    }
});

/**
 * activate a shader
 **/
Render.prototype.activateShader = function(shader) {
    if(this.currentShader == shader) {
        return;
    }

    var gl = this.gl;
    shader.activate(gl, this.width, this.height);
    this.currentShader = shader;
}

/**
 * activate a renderTarget
 **/
 Render.prototype.activateRenderTarget = function(renderTarget) {
     if(this.currentRenderTarget == renderTarget) {
         return;
     }

     renderTarget.activate();
     this.currentRenderTarget = renderTarget;
 }

 /**
  * activate a renderBuffer
  **/
  Render.prototype.activateRenderBuffer = function(renderBuffer) {
      if(this.currentRenderBuffer == renderBuffer) {
          return;
      }

      renderBuffer.activate();
      this.currentRenderBuffer = renderBuffer;
  }

/**
 * render display object and flush
 **/
Render.prototype.render = function(displayObject) {

    this.drawCall = 0;

    this._render(displayObject);

    this.flush();

    return this.drawCall;

};

/**
 * render display object
 **/
Render.prototype._render = function(displayObject) {

    // if buffer count reached max size, auto flush
    if(this.currentRenderBuffer.reachedMaxSize()) {
        this.flush();
    }

    // save matrix
    var transform = this.currentRenderBuffer.transform;
    var matrix = Matrix.create();
    matrix.copy(transform);

    // transform, use append to add transform matrix
    transform.append(displayObject.getTransformMatrix());

    // if blend, cache blend mode
    if(displayObject.blend != this.defaultBlendMode) {
        this.currentRenderBuffer.cacheBlendMode(displayObject.blend);
    }

    // if filter, pushFilters, identify matrix

    // if mask, pushMask

    if(displayObject.renderType == "container") {// cache children

        // if cacheAsBitmap

        // if not init
        // change target, identify matrix

        var len = displayObject.children.length;
        for(var i = 0; i < len; i++) {
            var child = displayObject.children[i];
            this._render(child);
        }

        // render renderTexture

    } else {
        // cache display object
        this.currentRenderBuffer.cache(displayObject);
    }

    // if blend, reset blend mode
    if(displayObject.blend != this.defaultBlendMode) {
        this.currentRenderBuffer.cacheBlendMode(this.defaultBlendMode);
    }

    // if filter, popFilters, restoreMatrix

    // if mask, popMask

    // restore matrix
    transform.copy(matrix);
    Matrix.release(matrix);
};

/**
 * flush the render buffer data, should do in the end of the frame
 **/
Render.prototype.flush = function() {

    this.drawWebGL();

    this.currentRenderBuffer.clear();
}

/**
 * draw into webGL context
 **/
Render.prototype.drawWebGL = function() {
    var gl = this.gl;

    this.currentRenderBuffer.upload();

    var offset = 0;
    var currentSize = this.currentRenderBuffer.currentSize;
    var drawData = this.currentRenderBuffer.drawData;
    for(var i = 0; i < currentSize; i++) {
        var data = drawData[i];

        switch (data.renderType) {
            case "sprite":

                var size = data.count;
                // is texture not loaded skip render
                if(data.texture && data.texture.isInit) {
                    if(data.filters.length > 0) {
                        // TODO now just last filter works
                        // render should have popFilter and pushFilter function
                        var len = data.filters.length;

                        for(var j = 0; j < len; j++) {
                            data.filters[j].applyFilter(render);
                        }

                    } else {
                        this.activateShader(this.textureShader);
                    }

                    // TODO use more texture unit
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, data.texture.glTexture);

                    gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, offset * 2);

                    // count draw call if texture not exist?
                    this.drawCall++;
                }

                offset += size * 6;

                break;

            case "rect":

                var size = data.count;

                this.activateShader(this.primitiveShader);

                this.primitiveShader.fillColor(gl, data.color);

                gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, offset * 2);

                this.drawCall++;

                offset += size * 6;

                break;

            case "blend":

                var blendMode = data.blendMode;

                // set blendMode
                this.setBlendMode(blendMode);

                break;

            default:
                console.warn("no render type function");
                break;

        }

    }

    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * set blend mode
 */
Render.prototype.setBlendMode = function(blendMode) {
    var gl = this.gl;

    switch (blendMode) {
        case "source-over":
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            break;
        case "lighter":
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            break;
        case "destination-out":
            gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
            break;
        case "destination-in":
            gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
            break;
        default:
            // do nothing
    }
}

/**
 * clear current renderTarget
 **/
Render.prototype.clear = function() {
    this.currentRenderTarget.clear();
}
