//=====================================================================
// This sample displays data about the current charge state using TeslaJS
//
// https://github.com/mseminatore/TeslaJS
//
// Copyright (c) 2016 Mark Seminatore
//
// Refer to included LICENSE file for usage rights and restrictions
//=====================================================================

var tms = require('../TeslaJS');

//
//
//
function login_cb(result) {
    if (result.error) {
        console.error("Login failed!");
        console.warn(JSON.stringify(result.error));
        return;
    }

    var options = { authToken: result.authToken, carIndex: 0 };
    tms.vehicles(options, function (vehicle) {
        console.log("Vehicle " + vehicle.vin + " ( '" + vehicle.display_name + "' ) is: " + vehicle.state);

        options.vehicleID = vehicle.id_s;
        sampleMain(options);
    });
}

//
//
//
function sampleMain(options) {
    tms.chargeState(options, function (chargeState) {
        console.log("\nCurrent charge level: " + chargeState.battery_level + '%');
        console.log("Target charge level: " + chargeState.charge_limit_soc + '%');
        console.log("\nIdeal range: " + Math.round(chargeState.ideal_battery_range) + ' miles');
        console.log("Rated range: " + Math.round(chargeState.battery_range) + ' miles');
        console.log("Projected range: " + Math.round(chargeState.est_battery_range) + ' miles');

        if (chargeState.scheduled_charging_pending) {
            var scheduledChargeTime = new Date(chargeState.scheduled_charging_start_time * 1000);
            console.log("\nCharge scheduled for " + scheduledChargeTime.toLocaleTimeString());
        }
    });
}

//
//
//
function usage() {
    console.log("\nUsage: node <sample_name> <email> <password>\n");
}

//
// Sample starts here
//
if (process.argv.length < 3) {
    usage();
    process.exit(1);
}

var options = { email: process.argv[2], password: process.argv[3] };
tms.login(options.email, options.password, login_cb);
