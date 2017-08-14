import {Observable} from 'data/observable';
import {
    BeaconRegion, Beacon, BeaconCallback,
    BeaconLocationOptions, BeaconLocationOptionsIOSAuthType, BeaconLocationOptionsAndroidAuthType
} from "nativescript-ibeacon/nativescript-ibeacon.common";
import {NativescriptIbeacon} from "nativescript-ibeacon";

export class HelloWorldModel extends Observable implements BeaconCallback {

    private nativescriptIbeacon: NativescriptIbeacon;

    public message: string = "Init";

    public beaconInRange = {
        id1: "",
        id2: "",
        id3: "",
        distance: "",
        updated: ""
    };

    private closestDistance: number = 99999;

    private region: BeaconRegion = null;

    constructor() {
        super();

        console.log('Hello World Model constructed');
        this.resetBeaconInRange();

        let options: BeaconLocationOptions = {
            iOSAuthorisationType: BeaconLocationOptionsIOSAuthType.Always,
            androidAuthorisationType: BeaconLocationOptionsAndroidAuthType.Coarse,
            androidAuthorisationDescription: "Location permission needed"
        };
        this.nativescriptIbeacon = new NativescriptIbeacon(this, options);
        // this.region = new BeaconRegion("HelloID", "61687109-905f-4436-91f8-e602f514c96d", null, null);
        this.region = new BeaconRegion("BeaconIO", null, null, null);
    }

    start() {
        this.message = "start";
        this.resetBeaconInRange();

        if (!this.nativescriptIbeacon.isAuthorised()) {
            console.log("NOT Authorised");
            this.nativescriptIbeacon.requestAuthorization()
                .then(() => {
                    console.log("Authorised by the user");
                    this.nativescriptIbeacon.bind();

                }, (e) => {
                    console.log("Authorisation denied by the user");
                })
        } else {
            console.log("Already authorised");
            this.nativescriptIbeacon.bind();
        }

    }

    stop() {
        this.message = "stop";
        this.resetBeaconInRange();
        this.nativescriptIbeacon.stopRanging(this.region);
        this.nativescriptIbeacon.stopMonitoring(this.region);
        this.nativescriptIbeacon.unbind();
    }

    onBeaconManagerReady(): void {
        console.log("onBeaconManagerReady");
        this.nativescriptIbeacon.startRanging(this.region);
        this.nativescriptIbeacon.startMonitoring(this.region);
    }

    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Beacon[]): void {
        //console.log("didRangeBeaconsInRegion: " + region.identifier + " - " + beacons.length);
        //this.message = "didRangeBeaconsInRegion: " + (new Date().toDateString());
        for (let beacon of beacons) {
            console.log("B: " + beacon.proximityUUID + " - " + beacon.major + " - " + beacon.minor + " - " + beacon.distance_proximity + " - " + beacon.rssi + " - " + beacon.txPower_accuracy );
            if (beacon.distance_proximity < this.closestDistance) {
                this.closestDistance = beacon.distance_proximity;
                this.beaconInRange.distance = beacon.distance_proximity.toString();
                this.beaconInRange.id1 = beacon.proximityUUID;
                this.beaconInRange.id2 = beacon.major.toString();
                this.beaconInRange.id3 = beacon.minor.toString();
                this.beaconInRange.updated = (new Date().toDateString());
            }
        }
    }

    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): void {
        console.log("didFailRangingBeaconsInRegion: " + region.identifier + " - " + errorCode + " - " + errorDescription);
    }

    didEnterRegion(region: BeaconRegion) {
        //console.log(region);
        console.log('Did enter Region ' + region.identifier);
    }

    didExitRegion(region: BeaconRegion) {
        //console.log(region);
        this.resetBeaconInRange();
        console.log('Did leave Region '  + region.identifier);
    }

    resetBeaconInRange() {
         this.beaconInRange = {
            id1: "",
            id2: "",
            id3: "",
            distance: "",
            updated: ""
        };
        this.closestDistance = 99999;
   }

}