import { BeaconCallback, BeaconRegion, Common } from './nativescript-ibeacon.common';
export declare class LocationService extends NSObject implements CLLocationManagerDelegate {
    static ObjCProtocols: {
        prototype: CLLocationManagerDelegate;
    }[];
    delegate: BeaconCallback;
    private locationManager;
    constructor();
    private getLocationManager();
    startRanging(beaconRegion: BeaconRegion): void;
    stopRanging(beaconRegion: BeaconRegion): void;
    private getCLBeaconRegion(beaconRegion);
    private getBeaconRegion(clBeaconRegion);
    private getBeacon(clBeacon);
    locationManagerDidRangeBeaconsInRegion(manager: CLLocationManager, beacons: NSArray<CLBeacon>, region: CLBeaconRegion): void;
    locationManagerRangingBeaconsDidFailForRegionWithError(manager: CLLocationManager, region: CLBeaconRegion, error: NSError): void;
}
export declare class NativescriptIbeacon extends Common {
    private locationService;
    constructor(beaconCallback: BeaconCallback);
    startRanging(beaconRegion: BeaconRegion): void;
    stopRanging(beaconRegion: BeaconRegion): void;
}
