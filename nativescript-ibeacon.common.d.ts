import { Observable } from 'data/observable';
export interface BeaconCallback {
    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Beacon[]): any;
    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): any;
}
export declare class Common extends Observable {
    constructor(beaconCallback: BeaconCallback);
    startRanging(beaconRegion: BeaconRegion): void;
    stopRanging(beaconRegion: BeaconRegion): void;
}
export declare class BeaconRegion {
    identifier: string;
    proximityUUID: string;
    major: number;
    minor: number;
    constructor(identifier: string, proximityUUID: string, major?: number, minor?: number);
}
export declare class Beacon {
    proximityUUID: string;
    major: number;
    minor: number;
    constructor(proximityUUID: string, major: number, minor: number);
}
