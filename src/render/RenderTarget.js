/**
 * RenderTarget Class
 **/
var RenderTarget = function(gl, width, height, root) {
    this.gl = gl;
    // boolean type, if root is false, bind frame buffer
    this.root = root;
    // frame buffer
    this.frameBuffer = null;
    // the texture
    this.texture = null;
    // size
    this.width = width;
    this.height = height;
    // transform matrix
    // change render target will also has a new transform space
    this.transform = new Matrix();
    // clear color
    this.clearColor = [0.0, 0.0, 0.0, 0.0];

    if(!this.root) {

        this.frameBuffer = gl.createFramebuffer();

        /*
            A frame buffer needs a target to render to..
            create a texture and bind it attach it to the framebuffer..
         */

        this.texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D,  this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // set the scale properties of the texture..
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    }
}

RenderTarget._pool = [];

RenderTarget.create = function(gl, width, height) {
    var renderTarget = RenderTarget._pool.pop();
    if(renderTarget) {
        if(renderTarget.width == width && renderTarget.height == height) {
            renderTarget.clear();// if size is right, just clear
        } else {
            renderTarget.resize(width, height);
        }

        renderTarget.transform.identify();

        return renderTarget;
    } else {
        return new RenderTarget(gl, width, height);
    }
}

RenderTarget.release = function(renderTarget) {
    // should resize to save memory?
    // renderTarget.resize(3, 3);
    RenderTarget._pool.push(renderTarget);
}

// TODO clear function

/**
 * resize render target
 * so we can recycling a render buffer
 */
RenderTarget.prototype.resize = function(width, height) {
    var gl = this.gl;
    // resize texture
    gl.bindTexture(gl.TEXTURE_2D,  this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);// upload null will clear this texture!!!
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * clear render target
 */
RenderTarget.prototype.clear = function(bind) {
    var gl = this.gl;

    if(bind) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    }

    gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

/**
 * TODO Binds the stencil buffer.
 *
 */
RenderTarget.prototype.attachStencilBuffer = function() {

}

/**
 * Binds the buffers
 *
 */
RenderTarget.prototype.activate = function() {
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
};

/**
 * destroy
 */
RenderTarget.prototype.destroy = function() {
    // TODO destroy
};


