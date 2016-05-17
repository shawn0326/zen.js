/**
 * color transform filter
 **/
var ColorTransformFilter = function(gl) {

    this.shader = new ColorTransformShader(gl);

    // color transform matrix
    this.matrix = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ];

}

Util.inherit(ColorTransformFilter, AbstractFilter);

ColorTransformFilter.prototype.reset = function() {
    this.matrix = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Adjusts brightness
 *
 * @param b {number} value of the brigthness (0 is black)
 */
ColorTransformFilter.prototype.brightness = function(b) {
    this.matrix = [
        b, 0, 0, 0, 0,
        0, b, 0, 0, 0,
        0, 0, b, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Set the matrices in grey scales
 *
 * @param scale {number} value of the grey (0 is black)
 */
ColorTransformFilter.prototype.grayScale = function(scale) {
    this.matrix = [
        scale, scale, scale, 0, 0,
        scale, scale, scale, 0, 0,
        scale, scale, scale, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Set the black and white matrice
 * Multiply the current matrix
 *
 * @param multiply {boolean} refer to ._loadMatrix() method
 */
ColorTransformFilter.prototype.blackAndWhite = function(b) {
    this.matrix = [
        0.3, 0.6, 0.1, 0, 0,
        0.3, 0.6, 0.1, 0, 0,
        0.3, 0.6, 0.1, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Set the hue property of the color
 *
 * @param rotation {number} in degrees
 */
ColorTransformFilter.prototype.hue = function(rotation) {
    rotation = (rotation || 0) / 180 * Math.PI;
    var cos = Math.cos(rotation),
        sin = Math.sin(rotation);

    // luminanceRed, luminanceGreen, luminanceBlue
    var lumR = 0.213, // or 0.3086
        lumG = 0.715, // or 0.6094
        lumB = 0.072; // or 0.0820

    this.matrix = [
        lumR + cos * (1 - lumR) + sin * (-lumR), lumG + cos * (-lumG) + sin * (-lumG), lumB + cos * (-lumB) + sin * (1 - lumB), 0, 0,
        lumR + cos * (-lumR) + sin * (0.143), lumG + cos * (1 - lumG) + sin * (0.140), lumB + cos * (-lumB) + sin * (-0.283), 0, 0,
        lumR + cos * (-lumR) + sin * (-(1 - lumR)), lumG + cos * (-lumG) + sin * (lumG), lumB + cos * (1 - lumB) + sin * (lumB), 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Set the contrast matrix, increase the separation between dark and bright
 * Increase contrast : shadows darker and highlights brighter
 * Decrease contrast : bring the shadows up and the highlights down
 *
 * @param amount {number} value of the contrast
 */
ColorTransformFilter.prototype.contrast = function(amount) {
    var v = (amount || 0) + 1;
    var o = -128 * (v - 1);

    this.matrix = [
        v, 0, 0, 0, o,
        0, v, 0, 0, o,
        0, 0, v, 0, o,
        0, 0, 0, 1, 0
    ];
}

/**
 * Set the saturation matrix, increase the separation between colors
 * Increase saturation : increase contrast, brightness, and sharpness
 *
 * @param [amount=0] {number}
 */
ColorTransformFilter.prototype.saturate = function(amount) {
    var x = (amount || 0) * 2 / 3 + 1;
    var y = ((x - 1) * -0.5);

    this.matrix = [
        x, y, y, 0, 0,
        y, x, y, 0, 0,
        y, y, x, 0, 0,
        0, 0, 0, 1, 0
    ];
}

/**
 * Desaturate image (remove color)
 *
 * Call the saturate function
 *
 */
ColorTransformFilter.prototype.desaturate = function(amount) {
    this.saturate(-1);
}

/**
 * Negative image (inverse of classic rgb matrix)
 *
 */
ColorTransformFilter.prototype.negative = function() {
    this.matrix = [
        0, 1, 1, 0, 0,
        1, 0, 1, 0, 0,
        1, 1, 0, 0, 0,
        0, 0, 0, 1, 0
    ];
}

ColorTransformFilter.prototype.applyFilter = function(render) {
    render.activateShader(this.shader);
    this.shader.setMatrix(render.context, this.matrix);
}
