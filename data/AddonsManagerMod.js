CollectionsController = {};

CollectionsController.COLLECTIONS_URL = "https://addons.mozilla.org/collections/";

self.port.on("collector_init", function(data) {
    CollectionsController.loadViewPanel();
    CollectionsController.loadView();
});

self.port.on("collector_refresh", function(data) {
    CollectionsController.onViewChanged();
});

CollectionsController.loadViewPanel = function()
{
    /*
        <browser id="collections-browser" type="content" flex="1"
                       disablehistory="true" homepage="about:blank"/>
    */
    var viewport = document.getElementById("view-port");
    var collectionsBox = document.createElement("deck");
    collectionsBox.setAttribute("id", "collections-view");
    collectionsBox.setAttribute("flex", "1");
    collectionsBox.setAttribute("class", "view-pane");
    var collectionsBrowser = document.createElement("browser");
    collectionsBrowser.setAttribute("id", "collections-browser");
    collectionsBrowser.setAttribute("type", "content");
    collectionsBrowser.setAttribute("flex", "1");
    collectionsBrowser.setAttribute("disablehistory", "true");
    collectionsBrowser.setAttribute("homepage", "about:blank");
    collectionsBox.appendChild(collectionsBrowser);
    viewport.appendChild(collectionsBox);
}

CollectionsController.loadView = function()
{
    /*
        <richlistitem id="bandwagon-collections-view" value="addons://collectionsnew/"
            class="category"
            name="Collections" />
    */
    var cats = document.getElementById("categories");
    var collsItems = document.createElement("richlistitem");
    collsItems.setAttribute("id", "collections-view-item");
    collsItems.setAttribute("value", "addons://collectionsnew/");
    collsItems.setAttribute("class", "category");
    collsItems.setAttribute("name", "Collections");

    gViewController.viewObjects["collectionsnew"] = 
    {
        node: null,
        enabled: true,
        loaded: false,
        _browser: null,
        homepageURL: "https://addons.mozilla.org/collections/",
        _listBox: null,

        initialize: function() {
            this.node = document.getElementById("collections-view");
            this._browser = document.getElementById("collections-browser");
        },

        show: function(aParam, aRequest, aState, aIsRefresh) {
            if (this.loaded)
                return;

            this.loaded = true;

            this._loadURL(this.homepageURL, false);

            gViewController.updateCommands();
            gViewController.notifyViewChanged();
        },

        _loadURL: function(aURL, aKeepHistory, aCallback) {
            if (this._browser.currentURI.spec == aURL) {
              if (aCallback)
                aCallback();
              return;
            }

            if (aCallback)
              this._loadListeners.push(aCallback);

            var flags = 0;
            if (!aKeepHistory)
              flags |= Ci.nsIWebNavigation.LOAD_FLAGS_REPLACE_HISTORY;

            this._browser.loadURIWithFlags(aURL, flags);
        },

        hide: function() { },

        getSelectedAddon: function() null
    };

    cats.appendChild(collsItems);
    gViewController.viewObjects["collectionsnew"].initialize();
}

CollectionsController.onViewChanged = function()
{
    // XX TODO Determine if anything needs to be done here
}

//Services.obs.addObserver(init, "EM-loaded", false);
//document.addEventListener("ViewChanged", CollectionsController.onViewChanged, true);

