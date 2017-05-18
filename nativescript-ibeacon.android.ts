import {BeaconCallback, BeaconRegion, Common} from './nativescript-ibeacon.common';
import * as application from "application";

declare var org: any;

export class LocationService {

    private beaconManager: any = null;
    public delegate: BeaconCallback = null;


    private myCallback: any = null;

    constructor() {
        console.log("constructor");
    }

    public bind() {
        this.beaconManager.bind(this.myCallback);
    }

    public unbind() {
        this.beaconManager.unbind(this.myCallback);
    }

    public startRanging(beaconRegion: BeaconRegion) {
        console.log("startRanging");
        this.beaconManager = org.altbeacon.beacon.BeaconManager().getInstanceForApplication(application.android.foregroundActivity);
        this.myCallback = org.altbeacon.beacon.BeaconConsumer.extend({

            onBeaconServiceConnect: function () {
                console.log("onBeaconServiceConnect");

                // Start ranging
            }

        });

        this.bind();
    }

    public stopRanging(beaconRegion: BeaconRegion) {
        console.log("stopRanging");
        this.unbind();
        this.beaconManager = null;
        this.myCallback = null;
    }

    private getContext() {
        let context = application.android.context;
        return context
    }
}

export class NativescriptIbeacon extends Common {
    private locationService: LocationService = null;

    constructor(beaconCallback: BeaconCallback) {
        super(beaconCallback);
        this.locationService = new LocationService();
        this.locationService.delegate = beaconCallback;
    }

    public startRanging(beaconRegion: BeaconRegion) {
        this.locationService.startRanging(beaconRegion);
    }

    public stopRanging(beaconRegion: BeaconRegion) {
        this.locationService.stopRanging(beaconRegion);
    }


}