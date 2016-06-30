/**
 * glow filter
 **/
var GlowFilter = function(gl) {

    this.shader = new GlowShader(gl);

    this.distance = 10;

    this.color = 0xff0000;

    this.outerStrength = 2;
    this.innerStrength = 1;

}

Util.inherit(GlowFilter, AbstractFilter);

GlowFilter.prototype.applyFilter = function(render, input, output, offset) {
    render.activateShader(this.shader);
    this.shader.setDistance(render.gl, this.distance);
    this.shader.setColor(render.gl, this.color);
    this.shader.setOuterStrength(render.gl, this.outerStrength);
    this.shader.setInnerStrength(render.gl, this.innerStrength);
    this.shader.setViewSize(render.gl, render.width, render.height);

    offset = render.applyFilter(this, input, output, offset);

    return offset;
}
