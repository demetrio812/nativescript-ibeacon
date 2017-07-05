import {
    Beacon, BeaconCallback, BeaconLocationOptions, BeaconLocationOptionsIOSAuthType, BeaconRegion,
    Common
} from './nativescript-ibeacon.common';

export class LocationService extends NSObject implements CLLocationManagerDelegate {

    public static ObjCProtocols = [CLLocationManagerDelegate];

    public delegate: BeaconCallback = null;

    private locationManager: CLLocationManager = null;

    private authorisationPromise: any = null;

    constructor() {
        super();
        console.log("constructor");
    }

    public requestAuthorization(type: BeaconLocationOptionsIOSAuthType): Promise<any> {
        console.log("requestAuthorization: start");
        let me = this;
        return new Promise(function (granted, failed) {
            console.log("requestAuthorization: in promise");
            if (type == BeaconLocationOptionsIOSAuthType.WhenInUse) {
                console.log("requestAuthorization: when in use");
                me.getLocationManager().requestWhenInUseAuthorization();
            } else {
                console.log("requestAuthorization: always");
                me.getLocationManager().requestAlwaysAuthorization();
            }

            me.authorisationPromise = {granted: granted, failed: failed};
        });
    }

    public isAuthorised(): boolean {
        let authstate = CLLocationManager.authorizationStatus();
        console.log("Auth state = " + authstate);
        return !(authstate == CLAuthorizationStatus.kCLAuthorizationStatusNotDetermined
            || authstate == CLAuthorizationStatus.kCLAuthorizationStatusRestricted
            || authstate == CLAuthorizationStatus.kCLAuthorizationStatusDenied
        );
    }

    private getLocationManager(): CLLocationManager {
        // console.log("getLocationManager: " + this.locationManager);
        if (!this.locationManager) {
            // console.log("getLocationManager2: " + this.locationManager);
            // this.locationManager = this.createiOSLocationManager(this, null);
            this.locationManager = new CLLocationManager();
            this.locationManager.delegate = this;
            // iosLocManager.desiredAccuracy = options ? options.desiredAccuracy : Accuracy.high;
            // iosLocManager.distanceFilter = options ? options.updateDistance : nativescript_geolocation_common_1.minRangeUpdate;
            // locationManagers[locListener.id] = iosLocManager;
            // locationListeners[locListener.id] = locListener;
        }
        // console.log("getLocationManager3: " + this.locationManager);
        return this.locationManager;
    }

    public bind() {
        // init the location manager (if it's not already created)
        this.getLocationManager();
        // send the onBeaconManagerReady event
        if (this.delegate && this.delegate.onBeaconManagerReady) {
            this.delegate.onBeaconManagerReady();
        }
    }

    public unbind() {
        this.locationManager = null;
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

    public startMonitoring(beaconRegion: BeaconRegion) {
        console.log("startMonitoring");
        let region = this.getCLBeaconRegion(beaconRegion);
        this.getLocationManager().startMonitoringForRegion(region);
    }

    public stopMonitoring(beaconRegion: BeaconRegion) {
        console.log("stopMonitoring");
        let region = this.getCLBeaconRegion(beaconRegion);
        this.getLocationManager().stopMonitoringForRegion(region);
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
        beacon.distance_proximity = clBeacon.proximity;
        beacon.rssi = clBeacon.rssi;
        beacon.txPower_accuracy = clBeacon.accuracy;
        return beacon;
    }

    // Callbacks

    public locationManagerDidEnterRegion(manager: CLLocationManager, region: CLBeaconRegion) {
        console.log("locationManagerDidEnterRegion");
        if (this.delegate && this.delegate.didEnterRegion) {
            this.delegate.didEnterRegion(this.getBeaconRegion(region));
        }
    };

    public locationManagerDidExitRegion(manager: CLLocationManager, region: CLBeaconRegion) {
        console.log("locationManagerDidExitRegion");
        if (this.delegate && this.delegate.didExitRegion) {
            this.delegate.didExitRegion(this.getBeaconRegion(region));
        }
    };

    locationManagerDidRangeBeaconsInRegion(manager: CLLocationManager, beacons: NSArray<CLBeacon>, region: CLBeaconRegion): void {
        // console.log("locationManagerDidRangeBeaconsInRegion:" + region.identifier + ": " + beacons.count);
        // for (let beacon of beacons.iter) {
        let jsBeacons: Beacon[] = [];
        for (let i = 0; i < beacons.count; i++) {
            let beacon = this.getBeacon(beacons[i]);
            jsBeacons.push(beacon);
            // console.log("B: " + beacon.proximityUUID + " - " + beacon.major + " - " + beacon.minor + " - " + beacon.distance_proximity + " - " + beacon.rssi + " - " + beacon.txPower_accuracy);
        }
        if (this.delegate && this.delegate.didRangeBeaconsInRegion) {
            this.delegate.didRangeBeaconsInRegion(this.getBeaconRegion(region), jsBeacons);
        }
    }

    locationManagerRangingBeaconsDidFailForRegionWithError(manager: CLLocationManager, region: CLBeaconRegion, error: NSError): void {
        console.log("locationManagerRangingBeaconsDidFailForRegionWithError: " + region.identifier + ": " + error.description);
        if (this.delegate && this.delegate.didFailRangingBeaconsInRegion && error) {
            this.delegate.didFailRangingBeaconsInRegion(this.getBeaconRegion(region), error.code, error.description);
        }
    }

    locationManagerDidChangeAuthorizationStatus?(manager: CLLocationManager, status: CLAuthorizationStatus): void {
        console.log("requestAuthorization: init: " + status);
        if (this.authorisationPromise != null && status != CLAuthorizationStatus.kCLAuthorizationStatusNotDetermined) {
            // TODO this code runs immediately and gives error: Use the delegate method locationManager:didChangeAuthorizationStatus: to run your code when the user allows or disallows the location request.
            console.log("requestAuthorization: check");
            // If the user accepted
            if (status == CLAuthorizationStatus.kCLAuthorizationStatusRestricted
                || status == CLAuthorizationStatus.kCLAuthorizationStatusDenied) {
                console.log("requestAuthorization: failed");
                this.authorisationPromise.failed();
            } else {
                console.log("requestAuthorization: granted");
                this.authorisationPromise.granted();
            }
            console.log("requestAuthorization: reset");
            this.authorisationPromise = null;
        }
    }
}

export class NativescriptIbeacon extends Common {

    private locationService: LocationService = null;

    constructor(beaconCallback: BeaconCallback, options?: BeaconLocationOptions) {
        super(beaconCallback, options);
        this.locationService = new LocationService();
        this.locationService.delegate = beaconCallback;
    }

    public requestAuthorization(): Promise<any> {
        console.log("requestAuthorization: " + this.options);
        if (this.options) {
            console.log("requestAuthorization from options: " + this.options.iOSAuthorisationType.toString());
            return this.locationService.requestAuthorization(this.options.iOSAuthorisationType);
        } else {
            console.log("requestAuthorization default (WhenInUse)");
            return this.locationService.requestAuthorization(BeaconLocationOptionsIOSAuthType.WhenInUse);
        }
    }

    public isAuthorised(): boolean {
        return this.locationService.isAuthorised();
    }

    public bind() {
        this.locationService.bind();
    }

    public unbind() {
        this.locationService.unbind();
    }

    public startRanging(beaconRegion: BeaconRegion) {
        this.locationService.startRanging(beaconRegion);
    }

    public stopRanging(beaconRegion: BeaconRegion) {
        this.locationService.stopRanging(beaconRegion);
    }

    public startMonitoring(beaconRegion: BeaconRegion) {
        this.locationService.startMonitoring(beaconRegion);
    }

    public stopMonitoring(beaconRegion: BeaconRegion) {
        this.locationService.stopMonitoring(beaconRegion);
    }

}