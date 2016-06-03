/*
 * render command
 */
var RENDER_CMD = {

    TEXTURE: 0,

    RECT: 1,

    BLEND: 2,

    FILTERS_PUSH: 3,

    FILTERS_POP: 4,

    MASK_PUSH: 5,

    MASK_POP: 6

}

/*
 * display object type
 */
var DISPLAY_TYPE = {

    CONTAINER: 0,

    RECT: 1,

    SPRITE: 2
}

/*
 * blend mode
 */
var BLEND_MODE = {

    SOURCE_OVER: ["ONE", "ONE_MINUS_SRC_ALPHA"],

    LIGHTER: ["SRC_ALPHA", "ONE"],

    DESTINATION_OUT: ["ZERO", "ONE_MINUS_SRC_ALPHA"],

    DESTINATION_IN: ["ZERO", "SRC_ALPHA"],

    ADD: ["ONE", "DST_ALPHA"],

    MULTIPLY: ["DST_COLOR", "ONE_MINUS_SRC_ALPHA"],

    SCREEN: ["ONE", "ONE_MINUS_SRC_COLOR"]
}

/*
 * resolution policy
 */
var RESOLUTION_POLICY = {

    EXACT_FIT: 0,

    SHOW_ALL: 1,

    NO_BORDER: 2,

    FIXED_WIDTH: 3,

    FIXED_HEIGHT: 4
}