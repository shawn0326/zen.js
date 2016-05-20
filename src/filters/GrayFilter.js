/**
 * gray filter
 **/
var GrayFilter = function(gl) {

    this.shader = new GrayShader(gl);

}

Util.inherit(GrayFilter, AbstractFilter);

GrayFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}
