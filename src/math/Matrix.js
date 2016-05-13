
var PI = Math.PI;
var HalfPI = PI / 2;
var PacPI = PI + HalfPI;
var TwoPI = PI * 2;
var DEG_TO_RAD = PI / 180;

function cos(angle) {
    switch(angle) {
        case HalfPI:
        case -PacPI:
            return 0;
        case PI:
        case -PI:
            return -1;
        case PacPI:
        case -HalfPI:
            return 0;
        default:
            return Math.cos(angle);
    }
}

function sin(angle) {
    switch (angle) {
        case HalfPI:
        case -PacPI:
            return 1;
        case PI:
        case -PI:
            return 0;
        case PacPI:
        case -HalfPI:
            return -1;
        default:
            return Math.sin(angle);
    }
}

/**
 * Matrix Class
 * Creates a new Matrix object with the specified parameters.
 * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
 * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
 * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
 * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
 * @param tx The distance by which to translate each point along the x axis.
 * @param ty The distance by which to translate each point along the y axis.
 * | a | c | tx|
 * | b | d | ty|
 * | 0 | 0 | 1 |
 **/
var Matrix = function() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
}

Matrix._pool = [];

Matrix.create = function() {
    return matrix = Matrix._pool.pop() || new Matrix();
}

Matrix.release = function(matrix) {
    matrix.identify();
    Matrix._pool.push(matrix);
}

/**
 * identify matrix
 **/
Matrix.prototype.identify = function() {
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
}

/**
 * set the value of matrix
 **/
Matrix.prototype.set = function(a, b, c, d, tx, ty) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
}

/*
 * Applies a rotation transformation to the Matrix object.
 * The rotate() method alters the a, b, c, and d properties of the Matrix object.
 * @param angle The rotation angle in radians.
 */
Matrix.prototype.rotate = function(angle) {
    angle = +angle; // parseFloat
    if(angle !== 0) {
        var u = cos(angle);
        var v = sin(angle);
        var ta = this.a;
        var tb = this.b;
        var tc = this.c;
        var td = this.d;
        var ttx = this.tx;
        var tty = this.ty;
        this.a = ta  * u - tb  * v;
        this.b = ta  * v + tb  * u;
        this.c = tc  * u - td  * v;
        this.d = tc  * v + td  * u;
        this.tx = ttx * u - tty * v;
        this.ty = ttx * v + tty * u;
    }
}

/**
 * Applies a scaling transformation to the matrix. The x axis is multiplied by sx, and the y axis it is multiplied by sy.
 * The scale() method alters the a and d properties of the Matrix object.
 * @param sx A multiplier used to scale the object along the x axis.
 * @param sy A multiplier used to scale the object along the y axis.
 */
Matrix.prototype.scale = function(sx, sy) {
    if(sx !== 1) {
        this.a *= sx;
        this.c *= sx;
        this.tx *= sx;
    }
    if(sy !== 1) {
        this.b *= sy;
        this.d *= sy;
        this.ty *= sy;
    }
}

/**
 * Translates the matrix along the x and y axes, as specified by the dx and dy parameters.
 * @param dx The amount of movement along the x axis to the right, in pixels.
 * @param dy The amount of movement down along the y axis, in pixels.
 */
Matrix.prototype.translate = function(dx, dy) {
    this.tx += dx;
    this.ty += dy;
}

/**
 * append matrix
 **/
Matrix.prototype.append = function(matrix) {
    var ta = this.a;
    var tb = this.b;
    var tc = this.c;
    var td = this.d;
    var ttx = this.tx;
    var tty = this.ty;
    this.a = ta * matrix.a + tc * matrix.b;
    this.b = tb * matrix.a + td * matrix.b;
    this.c = ta * matrix.c + tc * matrix.d;
    this.d = tb * matrix.c + td * matrix.d;
    this.tx = ta * matrix.tx + tc * matrix.ty + ttx;
    this.ty = tb * matrix.tx + td * matrix.ty + tty;
}

/**
 * prepend matrix
 **/
Matrix.prototype.prepend = function(matrix) {
    var ta = this.a;
    var tb = this.b;
    var tc = this.c;
    var td = this.d;
    var ttx = this.tx;
    var tty = this.ty;
    this.a = matrix.a * ta+ matrix.c * tb;
    this.b = matrix.b * ta + matrix.d * tb;
    this.c = matrix.a * tc + matrix.c * td;
    this.d = matrix.b * tc + matrix.d * td;
    this.tx = matrix.a * ttx + matrix.c * tty + matrix.tx;
    this.ty = matrix.b * ttx + matrix.d * tty + matrix.ty;
}

/**
 * copy matrix
 **/
Matrix.prototype.copy = function(matrix) {
    this.a = matrix.a;
    this.b = matrix.b;
    this.c = matrix.c;
    this.d = matrix.d;
    this.tx = matrix.tx;
    this.ty = matrix.ty;
}
