import {Observable} from 'data/observable';
import {
    BeaconRegion, Beacon, BeaconCallback,
    BeaconLocationOptions, BeaconLocationOptionsIOSAuthType, BeaconLocationOptionsAndroidAuthType
} from "nativescript-ibeacon/nativescript-ibeacon.common";
import {NativescriptIbeacon} from "nativescript-ibeacon";

export class HelloWorldModel extends Observable implements BeaconCallback {
    private nativescriptIbeacon: NativescriptIbeacon;

    public message: string = "Init";

    private region: BeaconRegion = null;

    constructor() {
        super();

        console.log('Hello World Model constructed');
        let options: BeaconLocationOptions = {
            iOSAuthorisationType: BeaconLocationOptionsIOSAuthType.Always,
            androidAuthorisationType: BeaconLocationOptionsAndroidAuthType.Coarse,
            androidAuthorisationDescription: "Location permission needed"
        };
        this.nativescriptIbeacon = new NativescriptIbeacon(this, options);
        this.region = new BeaconRegion("HelloID", "2f234454-cf6d-4a0f-adf2-f4911ba9ffa6");
    }

    start() {
        this.message = "start";
        if (!this.nativescriptIbeacon.isAuthorised()) {
            console.log("NOT Authorised");
            this.nativescriptIbeacon.requestAuthorization()
                .then(() => {
                    console.log("Authorised by the user");
                    this.nativescriptIbeacon.startRanging(this.region);
                    this.nativescriptIbeacon.startMonitoring(this.region);

                }, (e) => {
                    console.log("Authorisation denied by the user");
                })
        } else {
            console.log("Authorised");
            this.nativescriptIbeacon.startRanging(this.region);
            this.nativescriptIbeacon.startMonitoring(this.region);
        }

    }

    stop() {
        this.message = "stop";
        this.nativescriptIbeacon.stopRanging(this.region);
    }

    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Beacon[]): void {
        // console.log("didRangeBeaconsInRegion: " + region.identifier + " - " + beacons.length);
        //this.message = "didRangeBeaconsInRegion: " + (new Date().toDateString());
        for (let beacon of beacons) {
            // console.log("B: " + beacon.proximityUUID + " - " + beacon.major + " - " + beacon.minor + " - " + beacon.distance_proximity + " - " + beacon.rssi + " - " + beacon.txPower_accuracy );
        }
    }

    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): void {
        console.log("didFailRangingBeaconsInRegion: " + region.identifier + " - " + errorCode + " - " + errorDescription);
    }

    didEnterRegion(region: BeaconRegion) {
        console.log(region);
        console.log('Did enter Region ' + region.identifier);
    }

    didExitRegion(region: BeaconRegion) {
        console.log(region);
        console.log('Did leave Region '  + region.identifier);
    }

}