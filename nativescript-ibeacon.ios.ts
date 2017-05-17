import {Beacon, BeaconCallback, BeaconRegion, Common} from './nativescript-ibeacon.common';

export class LocationService extends NSObject implements CLLocationManagerDelegate {

    public static ObjCProtocols = [CLLocationManagerDelegate];

    public delegate: BeaconCallback = null;

    private locationManager: CLLocationManager = null;

    constructor() {
        super();
        console.log("constructor");
    }

    private getLocationManager(): CLLocationManager {
        console.log("getLocationManager: " + this.locationManager);
        if (!this.locationManager) {
            console.log("getLocationManager2: " + this.locationManager);
            // this.locationManager = this.createiOSLocationManager(this, null);
            this.locationManager = new CLLocationManager();
            this.locationManager.delegate = this;
            // iosLocManager.desiredAccuracy = options ? options.desiredAccuracy : Accuracy.high;
            // iosLocManager.distanceFilter = options ? options.updateDistance : nativescript_geolocation_common_1.minRangeUpdate;
            // locationManagers[locListener.id] = iosLocManager;
            // locationListeners[locListener.id] = locListener;
            this.locationManager.requestAlwaysAuthorization(); // TODO type of authorisation as an option
        }
        console.log("getLocationManager3: " + this.locationManager);
        return this.locationManager;
    }

    public startRanging(beaconRegion: BeaconRegion) {
        console.log("startRanging");
        let region = this.getCLBeaconRegion(beaconRegion);
        this.getLocationManager().startRangingBeaconsInRegion(region)
    }

    public stopRanging(beaconRegion: BeaconRegion) {
        console.log("stopRanging");
        let region = this.getCLBeaconRegion(beaconRegion);
        this.getLocationManager().stopRangingBeaconsInRegion(region);
    }

    // Utils

    private getCLBeaconRegion(beaconRegion: BeaconRegion): CLBeaconRegion {
        let region: CLBeaconRegion = new CLBeaconRegion({
            proximityUUID: new NSUUID({
                UUIDString: beaconRegion.proximityUUID
            }),
            // major: null,
            // minor: null,
            identifier: beaconRegion.identifier
        });
        return region;
    }

    private getBeaconRegion(clBeaconRegion: CLBeaconRegion): BeaconRegion {
        let beaconRegion: BeaconRegion = new BeaconRegion(clBeaconRegion.identifier, clBeaconRegion.proximityUUID.UUIDString, clBeaconRegion.major, clBeaconRegion.minor);
        return beaconRegion;
    }

    private getBeacon(clBeacon: CLBeacon): Beacon {
        let beacon: Beacon = new Beacon(clBeacon.proximityUUID.UUIDString, clBeacon.major, clBeacon.minor);
        return beacon;
    }

    // Callbacks

    locationManagerDidRangeBeaconsInRegion(manager: CLLocationManager, beacons: NSArray<CLBeacon>, region: CLBeaconRegion): void {
        console.log("locationManagerDidRangeBeaconsInRegion:" + region.identifier + ": " + beacons.count);
        // for (let beacon of beacons.iter) {
        let jsBeacons: Beacon[] = [];
        for (let i = 0; i < beacons.count; i++) {
            let beacon = this.getBeacon(beacons[i]);
            jsBeacons.push(beacon);
            console.log("B: " + beacon.proximityUUID + " - " + beacon.major + " - " + beacon.minor);
        }
        if (this.delegate) {
            this.delegate.didRangeBeaconsInRegion(this.getBeaconRegion(region), jsBeacons);
        }
    }

    locationManagerRangingBeaconsDidFailForRegionWithError(manager: CLLocationManager, region: CLBeaconRegion, error: NSError): void {
        console.log("locationManagerRangingBeaconsDidFailForRegionWithError: " + region.identifier + ": " + error.description);
        if (this.delegate && error) {
            this.delegate.didFailRangingBeaconsInRegion(this.getBeaconRegion(region), error.code, error.description);
        }
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