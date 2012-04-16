CollectionsController = {};

CollectionsController.COLLECTIONS_URL = "https://addons.mozilla.org/collections/";
CollectionsController.RETIREMENT_URL = "http://blog.mozilla.org/addons/2012/03/07/add-on-collector-retiremen/";

self.port.on("collector_init", function(data) {
    CollectionsController.loadButton();
    CollectionsController.loadRetirement();
});

self.port.on("collector_disable", function(data) {
    CollectionsController.cleanUp();
});

CollectionsController.loadButton = function()
{
    // XX TODO Localise strings
    var cats = document.getElementById("categories");
    var collsButton = document.createElement("button");
    collsButton.setAttribute("id", "collections-button");
    collsButton.setAttribute("class", "category header-button");
    collsButton.setAttribute("label", "Collections");
    collsButton.setAttribute("name", "Collections");
    collsButton.addEventListener("click", function() {
        openURL(CollectionsController.COLLECTIONS_URL);
    }, true);

    cats.appendChild(collsButton);
}

CollectionsController.loadRetirement = function()
{
    // XX TODO Localise strings
    var cats = document.getElementById("categories");
    var retBox = document.createElement("vbox");
    retBox.setAttribute("id", "retirement-box");
    retBox.setAttribute("align", "start");
    // XX TOOD Figure out how to wrap the following text
    var retText = document.createElement("description");
    retText.setAttribute("id", "retirement-text");
    retText.setAttribute("flex", "1");
    retText.setAttribute("crop", "end");
    retText.textContent = "We retired the Add-on Collector"
    var retButton = document.createElement("button");
    retButton.setAttribute("id", "retirement-button");
    retButton.setAttribute("class", "button-link");
    retButton.setAttribute("label", "Find out why >");
    retButton.addEventListener("click", function() {
        openURL(CollectionsController.RETIREMENT_URL);
    }, true);

    retBox.appendChild(retText);
    retBox.appendChild(retButton);
    cats.appendChild(retBox);
}

CollectionsController.cleanUp = function()
{
    var cats = document.getElementById("categories");
    var collsButton = document.getElementById("collections-button");
    var retBox = document.getElementById("retirement-box");

    cats.removeChild(collsButton);
    cats.removeChild(retBox);
}
