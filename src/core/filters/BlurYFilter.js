/**
 * blurY filter
 **/
var BlurYFilter = function(gl) {

    this.shader = new BlurYShader(gl);

    this.blurY = 1;

}

Util.inherit(BlurYFilter, AbstractFilter);

BlurYFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);
    this.shader.setBlurY(render.gl, this.blurY);
    this.shader.setTextureSize(render.gl, input.width, input.height);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}
