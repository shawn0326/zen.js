var Sprite = function() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.texture = null;
}
Sprite.prototype.getVertices = function() {
    return [
        this.x, this.y, 0, 0,
        this.x + this.width, this.y, 1, 0,
        this.x + this.width, this.y + this.height, 1, 1,
        this.x, this.y + this.height, 0, 1
    ];
}
Sprite.prototype.getIndices = function() {
    return [
        0, 1, 2,
        2, 3, 0
    ];
};
