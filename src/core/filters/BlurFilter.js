(function() {

    /**
     * blur filter
     **/
    var BlurFilter = function(gl) {

        this.shader = new zen.BlurShader(gl);

        this.blurX = 2;

        this.blurY = 2;

        // TODO use help filters
        // if one of blurX and blurY equals zero, use blurXFilter or blurYFilter
        // if texture size bigger than 250, use two pass filter, because blur shader will run slow
        // this.blurXFilter = new BlurXFilter();
        // this.blurYFilter = new BlurYFilter();

    }

    zen.inherit(BlurFilter, zen.AbstractFilter);

    BlurFilter.prototype.applyFilter = function(render, input, output, offset) {
        render.activateShader(this.shader);
        this.shader.setBlur(render.gl, this.blurX, this.blurY);
        this.shader.setTextureSize(render.gl, input.width, input.height);

        offset = render.applyFilter(this, input, output, offset);

        return offset;
    }

    zen.BlurFilter = BlurFilter;
})();
