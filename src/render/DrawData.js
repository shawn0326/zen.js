/**
 * DrawData Class
 * describ a draw data
 **/
var DrawData = function() {

    this.cmd = null;

    this.texture = null;

    this.color = 0x000000;

    this.transform = null;

    this.count = 0;

    this.blendMode = "";

    this.filter = null;

    this.mask = null;

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

    drawData.cmd = null;
    drawData.texture = null;
    drawData.color = 0x000000;
    drawData.transform = null;
    drawData.count = 0;
    drawData.blendMode = "";
    drawData.filter = null;
    drawData.mask = null;

    DrawData.pool.push(drawData);

};