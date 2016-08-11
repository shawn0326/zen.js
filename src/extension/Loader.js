(function() {

    /**
     * Loader Class
     * used to load resources
     **/
    var Loader = function() {
        Loader.superClass.constructor.call(this);

        this.loadedCount = 0;
        this.totalCount = 0;

        this.cache = [];

        this.resources = {};
    }

    // inherit
    zen.inherit(Loader, zen.EventDispatcher);

    /**
     * add resources
     **/
    Loader.prototype.add = function(resource) {
        if(resource.length || resource.length == 0) {
            this.cache = this.cache.concat(resource);
        } else {
            this.cache.push(resource);
        }
        return this;
    }

    /**
     * load resources
     **/
    Loader.prototype.load = function() {
        this.totalCount = this.cache.length;
        this.loadedCount = 0;

        // dispatch load start event
        zen.LoadEvent.dispatchEvent(this, zen.LoadEvent.LOAD_BEGIN, this.loadedCount, this.totalCount);

        this._load();

    }

    Loader.prototype._load = function() {
        var resource = this.cache.shift();

        if(resource) {
            switch (resource.type) {
                case "image":

                    var image = new Image();
                    image.onload = function() {
                        this.resources[resource.name] = image;

                        this.loadedCount++;
                        // dispatch load start event
                        zen.LoadEvent.dispatchEvent(this, zen.LoadEvent.LOAD_PROCESSING, this.loadedCount, this.totalCount);

                        this._load();
                    }.bind(this);
                    image.src = resource.src;

                    break;
                case "json":

                    var request = new XMLHttpRequest();
                    request.onreadystatechange = function(event) {
                        if(event.target.readyState == 4) {
                            this.resources[resource.name] = JSON.parse(event.target.response);

                            this.loadedCount++;
                            // dispatch load start event
                            zen.LoadEvent.dispatchEvent(this, zen.LoadEvent.LOAD_PROCESSING, this.loadedCount, this.totalCount);

                            this._load();
                        }
                    }.bind(this);
                    request.open("GET", resource.src, true);
                    request.send();

                    break;
                default:
                    console.warn("unknow resource type!");
                    this._load();
            }
        } else {
            // this.cache.length = 0;
            // dispatch load finish event
            zen.LoadEvent.dispatchEvent(this, zen.LoadEvent.LOAD_FINISH, this.loadedCount, this.totalCount);
        }
    }

    /**
     * get resource
     **/
    Loader.prototype.getRes = function(name) {
        var res = this.resources[name];
        return res;
    }

    /**
     * clear resources
     **/
    Loader.prototype.clear = function() {
        this.resources = {};
    }

    zen.Loader = Loader;
})();
