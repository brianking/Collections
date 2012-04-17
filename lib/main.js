/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const {Cc, Ci, Cu} = require("chrome");
const self = require("self");
const chromeMod = require("chrome-mod");
const prefService = require("preferences-service");
const windows = require("windows");
const windowUtils = require("window-utils");
const tabs = require("tabs");
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

exports.onUnload = function(reason) {
    if (reason == "disable") {
        windowUtils.WindowTracker({
          onTrack: function (window) {
            console.log("Unloading Collector UI");
            if ("about:addons" != window.content.document.location) return;

            var cats = window.content.document.getElementById("categories");
            var collsButton = window.content.document.getElementById("collections-button");
            var retBox = window.content.document.getElementById("retirement-box");

            cats.removeChild(collsButton);
            cats.removeChild(retBox);
          }
        });
    }
}

// catch case when addons manager is open during install
function reloadAllAddonsManagerTabs()
{
    for each (var window in windows.browserWindows)
        for each (var tab in window.tabs)
            if (tab.url == "about:addons")
                tab.reload();
}
// XX TODO Determine if needed
//reloadAllAddonsManagerTabs();

exports.main = function() {

};

console.log("Collector is running.");
