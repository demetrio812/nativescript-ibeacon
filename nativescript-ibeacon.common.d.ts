import { Observable } from 'data/observable';
export interface BeaconCallback {
    onBeaconManagerReady(): void;
    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Beacon[]): void;
    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): void;
    didEnterRegion?(region: BeaconRegion): void;
    didExitRegion?(region: BeaconRegion): void;
}
export declare enum BeaconLocationOptionsIOSAuthType {
    Always = 0,
    WhenInUse = 1,
}
export declare enum BeaconLocationOptionsAndroidAuthType {
    Coarse = 0,
    Fine = 1,
}
export declare enum BeaconParserType {
    AltBeacon = 0,
    EddystoneTLM = 1,
    EddystoneUID = 2,
    EddystoneURL = 3,
    IBeacon = 4,
}
export interface BeaconLocationOptions {
    iOSAuthorisationType: BeaconLocationOptionsIOSAuthType;
    androidAuthorisationType: BeaconLocationOptionsAndroidAuthType;
    androidAuthorisationDescription: string;
    parserTypes: number[];
}
export interface RangingOptions {
    foregroundScanInterval: number;
    backgroundScanInterval: number;
}
export declare class Common extends Observable {
    protected options: BeaconLocationOptions;
    constructor(beaconCallback: BeaconCallback, options?: BeaconLocationOptions);
    requestAuthorization(): Promise<any>;
    isAuthorised(): boolean;
    bind(): void;
    unbind(): void;
    startRanging(beaconRegion: BeaconRegion): void;
    stopRanging(beaconRegion: BeaconRegion): void;
    startMonitoring(beaconRegion: BeaconRegion): void;
    stopMonitoring(beaconRegion: BeaconRegion): void;
}
export declare class BeaconRegion {
    identifier: string;
    proximityUUID?: string;
    major?: number;
    minor?: number;
    rangingOptions?: RangingOptions;
    constructor(identifier: string, proximityUUID?: string, major?: number, minor?: number, rangingOptions?: RangingOptions);
}
export declare class Beacon {
    proximityUUID: string;
    major: number;
    minor: number;
    distance_proximity: number;
    rssi: number;
    txPower_accuracy: number;
    constructor(proximityUUID: string, major: number, minor: number);
}
export declare class BeaconParserTypes {
    private types;
    private altBeacon;
    private eddystoneTLM;
    private eddystoneUID;
    private eddystoneURL;
    private iBeacon;
    constructor();
    getTypes(): string[];
    getType(id: number): string;
}
