import {Observable} from 'data/observable';
import {NativescriptIbeacon} from 'nativescript-ibeacon';
import {BeaconRegion, Beacon, BeaconCallback} from "nativescript-ibeacon/nativescript-ibeacon.common";

export class HelloWorldModel extends Observable implements BeaconCallback {
    private nativescriptIbeacon: NativescriptIbeacon;

    public message: string = "Init";

    private region: BeaconRegion = null;

    constructor() {
        super();

        this.nativescriptIbeacon = new NativescriptIbeacon(this);

        this.region = new BeaconRegion("HelloID", "2f234454-cf6d-4a0f-adf2-f4911ba9ffa6");
    }

    start() {
        this.message = "start";
        this.nativescriptIbeacon.startRanging(this.region);
    }

    stop() {
        this.message = "stop";
        this.nativescriptIbeacon.stopRanging(this.region);
    }

    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Beacon[]): void {
        console.log("didRangeBeaconsInRegion: " + region.identifier + " - " + beacons.length);
        //this.message = "didRangeBeaconsInRegion: " + (new Date().toDateString());
        for (let beacon of beacons) {
            console.log("B: " + beacon.proximityUUID + " - " + beacon.major + " - " + beacon.minor);
        }
    }

    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): void {
        console.log("didFailRangingBeaconsInRegion: " + region.identifier + " - " + errorCode + " - " + errorDescription);
    }


}