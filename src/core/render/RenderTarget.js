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
    // clear color
    this.clearColor = [0.0, 0.0, 0.0, 0.0];

    // 3x3 projection matrix
    this.projectionMatrix = new Float32Array(3 * 3);

    if(!this.root) {

        this.frameBuffer = gl.createFramebuffer();

        /*
            A frame buffer needs a target to render to..
            create a texture and bind it attach it to the framebuffer..
         */

        this.texture = new RenderTexture(gl, width, height);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.glTexture, 0);
    }
}

RenderTarget._pool = [];

RenderTarget.create = function(gl, width, height) {
    var renderTarget = RenderTarget._pool.pop();
    if(renderTarget) {
        if(renderTarget.width == width && renderTarget.height == height) {
            renderTarget.clear(true);// if size is right, just clear
        } else {
            renderTarget.resize(width, height);
        }

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
    this.width = width;
    this.height = height;
    // resize texture
    this.texture.resize(width, height, true);
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

    this.calculateProjection();
    gl.viewport(0, 0, this.width, this.height);
};

/**
 * Updates the projection matrix
 */
RenderTarget.prototype.calculateProjection = function() {
    var pm = this.projectionMatrix;

    if(!this.root) {
        pm[0] = 1 / this.width * 2;
        pm[4] = 1 / this.height * 2;

        pm[6] = -1;
        pm[7] = -1;
    } else {
        pm[0] = 1 / this.width * 2;
        pm[4] = -1 / this.height * 2;

        pm[6] = -1;
        pm[7] = 1;
    }
}

/**
 * destroy
 */
RenderTarget.prototype.destroy = function() {
    // TODO destroy
};
