const {Cc, Ci, Cu} = require("chrome");
const self = require("self");
const chromeMod = require("chrome-mod");
const prefService = require("preferences-service");
const windows = require("windows");
const tabs = require("tabs");
const panel = require("panel");
const AddonManager = Cu.import("resource://gre/modules/AddonManager.jsm").AddonManager;
const obsService = require("observer-service");
const us = require("userstyles");

chromeMod.ChromeMod(
{
    include: "about:addons",
    contentScriptWhen: 'end',
    contentScriptFile: self.data.url("AddonsManagerMod.js"),
    onAttach: function(worker) {
        worker.port.emit("collector_init", {});

        // Add the stylesheet to chrome
        var url = self.data.url("AddonsManagerMod.css");
        us.load(url);
    }
});

// catch case when addons manager is open during install
function reloadAllAddonsManagerTabs()
{
    for each (var window in windows.browserWindows)
        for each (var tab in window.tabs)
            if (tab.url == "about:addons")
                tab.reload();
}
//reloadAllAddonsManagerTabs();

exports.main = function() {

};

console.log("Collector is running.");

