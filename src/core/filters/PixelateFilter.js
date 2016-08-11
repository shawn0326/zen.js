(function() {

    /**
     * Pixelate filter
     **/
    var PixelateFilter = function(gl) {

        this.shader = new zen.PixelateShader(gl);

        this.pixelSize = 10;

    }

    zen.inherit(PixelateFilter, zen.AbstractFilter);

    PixelateFilter.prototype.applyFilter = function(render, input, output, offset) {
        render.activateShader(this.shader);
        this.shader.setPixelSize(render.gl, this.pixelSize);
        this.shader.setTextureSize(render.gl, input.width, input.height);

        offset = render.applyFilter(this, input, output, offset);

        return offset;
    }

    zen.PixelateFilter = PixelateFilter;
})();
