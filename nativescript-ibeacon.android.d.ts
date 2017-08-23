import { Beacon, BeaconCallback, BeaconLocationOptions, BeaconRegion, Common } from './nativescript-ibeacon.common';
export declare class LocationService extends java.lang.Object {
    private beaconManager;
    delegate: BeaconCallback;
    private context;
    private beaconManagerReady;
    private rangeNotifierAdded;
    private monitorNotifierAdded;
    private pendingBeaconRegion;
    private pendingBeaconMonitor;
    private options;
    private beaconParserTypes;
    constructor(context: android.content.Context, options: BeaconLocationOptions);
    bind(): void;
    unbind(): void;
    private getBeaconManager();
    startRanging(beaconRegion: BeaconRegion): void;
    stopRanging(beaconRegion: BeaconRegion): void;
    startMonitoring(beaconRegion: BeaconRegion): void;
    stopMonitoring(beaconRegion: BeaconRegion): void;
    onBeaconServiceConnect(): void;
    getRegionFromBeaconRegion(beaconRegion: BeaconRegion): any;
    getBeaconRegionFromRegion(region: any): BeaconRegion;
    getBeaconFromNativeBeacon(nativeBeacon: any): Beacon;
    getApplicationContext(): android.content.Context;
    unbindService(serviceConnection: android.content.ServiceConnection): void;
    bindService(intent: android.content.Intent, serviceConnection: android.content.ServiceConnection, i: number): boolean;
}
export declare class NativescriptIbeacon extends Common {
    private locationService;
    constructor(beaconCallback: BeaconCallback, options?: BeaconLocationOptions);
    requestAuthorization(): Promise<any>;
    isAuthorised(): boolean;
    private getPermission();
    bind(): void;
    unbind(): void;
    startRanging(beaconRegion: BeaconRegion): void;
    stopRanging(beaconRegion: BeaconRegion): void;
    startMonitoring(beaconRegion: BeaconRegion): void;
    stopMonitoring(beaconRegion: BeaconRegion): void;
}
