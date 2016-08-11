var loader = new zen.Loader();

loader.addEventListener(zen.LoadEvent.LOAD_BEGIN, function(event) {
    console.log("load start " + event.loadedCount + "/" + event.totalCount);
}, this);

loader.addEventListener(zen.LoadEvent.LOAD_PROCESSING, function(event) {
    console.log("load processing " + event.loadedCount + "/" + event.totalCount);
}, this);

loader.addEventListener(zen.LoadEvent.LOAD_FINISH, function(event) {
    console.log("load finish " + event.loadedCount + "/" + event.totalCount);

    var hi = loader.getRes("hi");
    console.log(hi);
    var test = loader.getRes("test");
    console.log(test);
}, this);

loader.add([{
    type: "image",
    name: "hi",
    src: "resources/hi.png"
},{
    type: "image",
    name: "logo",
    src: "resources/logo.png"
}]).add({
    type: "json",
    name: "test",
    src: "resources/test.json"
});

loader.load();
