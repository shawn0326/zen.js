/**
 * DrawData Class
 * describ a draw data
 **/
var DrawData = function() {

    this.renderType = "";

    this.texture = null;

    this.color = 0x000000;

    this.transform = null;

};

// draw data object pool
DrawData.pool = [];

// create some draw data
for(var i = 0; i < 300; i++) {
    DrawData.pool.push(new DrawData());
}

DrawData.getObject = function() {
    return DrawData.pool.length > 0 ? DrawData.pool.pop() : new DrawData();
};

DrawData.returnObject = function(drawData) {

    drawData.renderType = "";
    drawData.texture = null;
    drawData.color = 0x000000;
    drawData.transform = null;

    DrawData.pool.push(drawData);

};