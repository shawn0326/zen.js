/**
 * DrawData Class
 * describ a draw data
 **/
var DrawData = function() {

    this.renderType = "";

    this.texture = null;

    this.rgba = [0, 0, 0, 0];

};

// draw data object pool
DrawData.pool = [];

DrawData.getObject = function() {
    return DrawData.pool.length > 0 ? DrawData.pool.pop() : new DrawData();
};

DrawData.returnObject = function(drawData) {

    drawData.renderType = "";
    drawData.texture = null;
    drawData.rgba = [0, 0, 0, 0];

    DrawData.pool.push(drawData);

};