/**
 * Ascii filter
 **/
var AsciiFilter = function(gl) {

    this.shader = new AsciiShader(gl);

    this.pixelSize = 10;

}

Util.inherit(AsciiFilter, AbstractFilter);

AsciiFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);
    this.shader.setPixelSize(render.gl, this.pixelSize);
    this.shader.setTextureSize(render.gl, input.width, input.height);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}
