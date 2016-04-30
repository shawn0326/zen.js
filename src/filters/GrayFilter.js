/**
 * gray filter
 **/
var GrayFilter = function(gl) {

    this.shader = new GrayShader(gl);

}

Util.inherit(GrayFilter, AbstractFilter);

GrayFilter.prototype.applyFilter = function(render) {
    render.activateShader(this.shader);
}
