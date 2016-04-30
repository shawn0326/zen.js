/**
 * color transform filter
 **/
var ColorTransformFilter = function(gl) {

    this.shader = new ColorTransformShader(gl);

    // color transform matrix
    this.matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

}

Util.inherit(ColorTransformFilter, AbstractFilter);

ColorTransformFilter.prototype.reset = function() {
    for(var i = 0; i < this.matrix.length; i++) {
        this.matrix[i] = 0;
    }
    this.matrix[0] = this.matrix[5] =this.matrix[10] = this.matrix[15] = 1;
}

ColorTransformFilter.prototype.applyFilter = function(render) {
    render.activateShader(this.shader);
    this.shader.setMatrix(render.context, this.matrix);
}
