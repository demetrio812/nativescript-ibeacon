import {Observable} from 'data/observable';
import * as app from 'application';
import * as dialogs from 'ui/dialogs';

export interface BeaconCallback {
    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Beacon[]): void;
    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): void;
}

export class Common extends Observable {

    constructor(beaconCallback: BeaconCallback) {
        super();
    }

    public startRanging(beaconRegion: BeaconRegion) {

    }

    public stopRanging(beaconRegion: BeaconRegion) {

    }
}

export class BeaconRegion {
    public identifier: string;
    public proximityUUID: string;
    public major?: number;
    public minor?: number;

    constructor(identifier: string, proximityUUID: string, major?: number, minor?: number) {
        this.identifier = identifier;
        this.proximityUUID = proximityUUID;
        if (major) this.major = major;
        if (minor) this.minor = minor;
    }
}

export class Beacon {
    public proximityUUID: string;
    public major: number;
    public minor: number;

    private distance: number;
    private rssi: number;
    private txPower: number;

    constructor(proximityUUID: string, major: number, minor: number) {
        this.proximityUUID = proximityUUID;
        this.major = major;
        this.minor = minor;
    }

    public setDistance(distance: number) {
        this.distance = distance;
    }
    public setRssi(rssi: number) {
        this.rssi = rssi;
    }
    public setTxPower(txPower: number) {
        this.txPower = txPower;
    }
}


