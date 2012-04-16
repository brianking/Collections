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

var addonListener = {
    onUninstalling: function(addon) {},
    onOperationCancelled: function(addon) {},
    onUninstalled: function(addon) {},
    onEnabling: function(addon) {},
    onDisabling: function(addon)
    {
        try
        {
            if (addon.id == self.id) 
            {
                console.log("removing an addon listener");
                // TODO : Figure out how to get into about:addons from here to clean up
                // + unload the stylesheet
                //worker.port.emit("collector_disable", {});
                AddonManager.removeAddonListener(this);
            }
        }
        catch (e) {console.log("Disable error : "+e)}
    },
    onDisabled: function(addon) {},
    onInstalling: function(addon) {}
}

function registerAddonListener()
{
    console.log("adding an addon listener");
    AddonManager.addAddonListener(addonListener);
}

exports.main = function() {
  registerAddonListener();
};

console.log("Collector is running.");
