'use strict';

/* Magic Mirror
 * Module: MMM-DHT-Sensor
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const fs = require('fs'); // file system module

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting helper: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        const self = this;
        this.config = payload;

        setInterval(function() {
            self.checkTemperature();
        }, this.config.updateInterval);
    },

    checkTemperature: function() {
        const self = this;

        var temp = 0;
        var hum = 0;
	fs.readFile('/home/andreas/TempMon/th.log', 'utf-8', function(err, data) {
        if (err) throw err;

            var lines = data.trim().split('\n');
            var lastLine = lines.slice(-1)[0];

	    var end_temp = lastLine.indexOf("Temp: ");
	    var end_hum = lastLine.indexOf("RH: ");
	    var sep = lastLine.indexOf(",");
	    var end = lastLine.indexOf("%");

	    temp = lastLine.substring(end_temp+7, sep);
	    hum = lastLine.substring(end_hum+5, end);
            if (hum > 0 && temp > 0) {
                self.sendSocketNotification('DHT_TEMPERATURE', temp);
                self.sendSocketNotification('DHT_HUMIDITY', hum);
            }
	});
    }
});
