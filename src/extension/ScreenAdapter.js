(function() {

    var RESOLUTION_POLICY = zen.RESOLUTION_POLICY;

    /**
     * ScreenAdapter Class
     * adapte canvas to screen
     **/
    var ScreenAdapter = function(canvas, policy) {

        this.canvas = canvas;

        this.resolutionPolicy = policy || RESOLUTION_POLICY.EXACT_FIT;
    }

    /**
     * resize canvas
     */
    ScreenAdapter.prototype.fullScreen = function() {
        var canvas = this.canvas;

        var sizeData = this.calculateStageSize(this.resolutionPolicy, window.innerWidth, window.innerHeight, canvas.width, canvas.height);

        canvas.width = sizeData.stageWidth;
        canvas.height = sizeData.stageHeight;
        canvas.style.left = sizeData.displayLeft + "px";
        canvas.style.top = sizeData.displayTop + "px";
        canvas.style.width = sizeData.displayWidth + "px";
        canvas.style.height = sizeData.displayHeight + "px";

        return {
            scaleX: sizeData.displayWidth / sizeData.stageWidth,
            scaleY: sizeData.displayHeight / sizeData.stageHeight
        };
    }

    /**
     * calculateStageSize
     */
    ScreenAdapter.prototype.calculateStageSize = function(policy, screenWidth, screenHeight, contentWidth, contentHeight) {
        var stageWidth = contentWidth;
        var stageHeight = contentHeight;

        var displayLeft = 0;
        var displayTop = 0;
        var displayWidth = screenWidth;
        var displayHeight = screenHeight;

        var scaleX = displayWidth / stageWidth;
        var scaleY = displayHeight / stageHeight;

        switch (policy) {
            case RESOLUTION_POLICY.EXACT_FIT:

                break;
            case RESOLUTION_POLICY.SHOW_ALL:
                if(scaleX > scaleY) {
                    displayWidth = Math.round(stageWidth * scaleY);
                    displayLeft = Math.round((screenWidth - displayWidth) / 2);
                } else {
                    displayHeight = Math.round(stageHeight * scaleX);
                    displayTop = Math.round((screenHeight - displayHeight) / 2);
                }
                break;
            case RESOLUTION_POLICY.NO_BORDER:
                if (scaleX > scaleY) {
                    displayHeight = Math.round(stageHeight * scaleX);
                    // fixed left bottom
                    displayTop = Math.round(screenHeight - displayHeight);
                }
                else {
                    displayWidth = Math.round(stageWidth * scaleY);
                }
                break;
            case RESOLUTION_POLICY.FIXED_WIDTH:
                stageHeight = Math.round(screenHeight / scaleX);
                break;
            case RESOLUTION_POLICY.FIXED_HEIGHT:
                stageWidth = Math.round(screenWidth / scaleY);
                break;
            default:

        }

        return {
            stageWidth: stageWidth,
            stageHeight: stageHeight,
            displayLeft: displayLeft,
            displayTop: displayTop,
            displayWidth: displayWidth,
            displayHeight: displayHeight
        };
    }

    zen.ScreenAdapter = ScreenAdapter;
})();
