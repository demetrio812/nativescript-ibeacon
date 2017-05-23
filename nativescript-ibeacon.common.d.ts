import { Observable } from 'data/observable';
export interface BeaconCallback {
    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Beacon[]): void;
    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): void;
}
export declare class Common extends Observable {
    constructor(beaconCallback: BeaconCallback);
    startRanging(beaconRegion: BeaconRegion): void;
    stopRanging(beaconRegion: BeaconRegion): void;
}
export declare class BeaconRegion {
    identifier: string;
    proximityUUID: string;
    major?: number;
    minor?: number;
    constructor(identifier: string, proximityUUID: string, major?: number, minor?: number);
}
export declare class Beacon {
    proximityUUID: string;
    major: number;
    minor: number;
    private distance;
    private rssi;
    private txPower;
    constructor(proximityUUID: string, major: number, minor: number);
    setDistance(distance: number): void;
    setRssi(rssi: number): void;
    setTxPower(txPower: number): void;
}
