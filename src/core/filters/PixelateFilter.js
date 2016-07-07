/**
 * Pixelate filter
 **/
var PixelateFilter = function(gl) {

    this.shader = new PixelateShader(gl);

    this.pixelSize = 10;

}

Util.inherit(PixelateFilter, AbstractFilter);

PixelateFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);
    this.shader.setPixelSize(render.gl, this.pixelSize);
    this.shader.setTextureSize(render.gl, input.width, input.height);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}
