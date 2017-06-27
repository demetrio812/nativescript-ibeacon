import { BeaconCallback, BeaconLocationOptions, BeaconLocationOptionsIOSAuthType, BeaconRegion, Common } from './nativescript-ibeacon.common';
export declare class LocationService extends NSObject implements CLLocationManagerDelegate {
    static ObjCProtocols: {
        prototype: CLLocationManagerDelegate;
    }[];
    delegate: BeaconCallback;
    private locationManager;
    private authorisationPromise;
    constructor();
    requestAuthorization(type: BeaconLocationOptionsIOSAuthType): Promise<any>;
    isAuthorised(): boolean;
    private getLocationManager();
    startRanging(beaconRegion: BeaconRegion): void;
    stopRanging(beaconRegion: BeaconRegion): void;
    startMonitoring(beaconRegion: BeaconRegion): void;
    stopMonitoring(beaconRegion: BeaconRegion): void;
    locationManagerDidEnterRegion(manager: CLLocationManager, region: CLBeaconRegion): void;
    locationManagerDidExitRegion(manager: CLLocationManager, region: CLBeaconRegion): void;
    private getCLBeaconRegion(beaconRegion);
    private getBeaconRegion(clBeaconRegion);
    private getBeacon(clBeacon);
    locationManagerDidRangeBeaconsInRegion(manager: CLLocationManager, beacons: NSArray<CLBeacon>, region: CLBeaconRegion): void;
    locationManagerRangingBeaconsDidFailForRegionWithError(manager: CLLocationManager, region: CLBeaconRegion, error: NSError): void;
    locationManagerDidChangeAuthorizationStatus?(manager: CLLocationManager, status: CLAuthorizationStatus): void;
}
export declare class NativescriptIbeacon extends Common {
    private locationService;
    constructor(beaconCallback: BeaconCallback, options?: BeaconLocationOptions);
    requestAuthorization(): Promise<any>;
    isAuthorised(): boolean;
    startRanging(beaconRegion: BeaconRegion): void;
    stopRanging(beaconRegion: BeaconRegion): void;
    startMonitoring(beaconRegion: BeaconRegion): void;
    stopMonitoring(beaconRegion: BeaconRegion): void;
}
