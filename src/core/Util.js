var Util = {

    /**
     * Class inherit
     */

    emptyConstructor: function() {},

    inherit: function(subClass, superClass) {
        Util.emptyConstructor.prototype = superClass.prototype;
        subClass.superClass = superClass.prototype;
        subClass.prototype = new Util.emptyConstructor;
        subClass.prototype.constructor = subClass;
    },

    /**
     * is mobile
     */
    isMobile: function() {
        if (!window["navigator"]) {
            return true;
        }
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
    },

    /**
     * webgl get extension
     */
    getExtension: function(gl, name) {
        var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
        var ext = null;
        for (var i in vendorPrefixes) {
            ext = gl.getExtension(vendorPrefixes[i] + name);
            if (ext) { break; }
        }
        return ext;
    }

}
