import { Observable } from 'data/observable';
import { BeaconRegion } from "nativescript-ibeacon/nativescript-ibeacon.common";
import { Beacon, BeaconCallback } from "../../nativescript-ibeacon.common";
export declare class HelloWorldModel extends Observable implements BeaconCallback {
    private nativescriptIbeacon;
    message: string;
    private region;
    constructor();
    start(): void;
    stop(): void;
    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Beacon[]): void;
    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): void;
}
