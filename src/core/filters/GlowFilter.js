(function() {

    /**
     * glow filter
     **/
    var GlowFilter = function(gl) {

        this.shader = new zen.GlowShader(gl);

        // sample range, distance will effect glow size
        this.distance = 15;

        // glow color
        this.color = 0xff0000;

        // outer glow strength
        this.outerStrength = 1;

        // inner glow strength
        this.innerStrength = 1;

    }

    zen.inherit(GlowFilter, zen.AbstractFilter);

    GlowFilter.prototype.applyFilter = function(render, input, output, offset) {
        render.activateShader(this.shader);
        this.shader.setDistance(render.gl, this.distance);
        this.shader.setColor(render.gl, this.color);
        this.shader.setOuterStrength(render.gl, this.outerStrength);
        this.shader.setInnerStrength(render.gl, this.innerStrength);
        this.shader.setViewSize(render.gl, input.width, input.height);

        offset = render.applyFilter(this, input, output, offset);

        return offset;
    }

    zen.GlowFilter = GlowFilter;
})();
