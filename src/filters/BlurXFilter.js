/**
 * blurX filter
 **/
var BlurXFilter = function(gl) {

    this.shader = new BlurXShader(gl);

    this.blurX = 1;

}

Util.inherit(BlurXFilter, AbstractFilter);

BlurXFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);
    this.shader.setBlurX(render.gl, this.blurX);
    this.shader.setTextureSize(render.gl, input.width, input.height);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}
