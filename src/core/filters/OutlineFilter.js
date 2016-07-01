/**
 * outline filter
 **/
var OutlineFilter = function(gl) {

    this.shader = new OutlineShader(gl);

    // outline thickness
    this.thickness = 4;

    // outline color
    this.color = 0xff0000;

}

Util.inherit(OutlineFilter, AbstractFilter);

OutlineFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);
    this.shader.setThickness(render.gl, this.thickness);
    this.shader.setColor(render.gl, this.color);
    this.shader.setViewSize(render.gl, input.width, input.height);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}
