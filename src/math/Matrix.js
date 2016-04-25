/**
 * Matrix Class
 * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
 * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
 * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
 * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
 * @param tx 沿 x 轴平移每个点的距离。
 * @param ty 沿 y 轴平移每个点的距离。
 * | a | b | tx| 0 |
 * | c | d | ty| 0 |
 * | 0 | 0 | 1 | 0 |
 * | 0 | 0 | 0 | 1 |
 **/
var Matrix = function(a, b, c, d, tx, ty) {
    this.a = a || 1;
    this.b = b || 0;
    this.c = c || 0;
    this.d = d || 1;
    this.tx = tx || 0;
    this.ty = ty || 0;
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
 * 对 Matrix 对象应用旋转转换。
 * rotate() 方法将更改 Matrix 对象的 a、b、c 和 d 属性。
 * @param angle 以弧度为单位的旋转角度。
 */
Matrix.prototype.rotate = function(angle) {

}