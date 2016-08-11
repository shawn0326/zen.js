(function() {
    /**
     * abstract filter
     **/
    var AbstractFilter = function(gl) {

        //  a shader to render this filter
        this.shader = null;

    }

    // render apply this filter
    AbstractFilter.prototype.applyFilter = function(render, input, output, offset) {

        // use shader

        // apply filter
        offset = render.applyFilter(this, input, output, offset);

        // return draw offset
        return offset;

    }

    zen.AbstractFilter = AbstractFilter;
})();
