import {Observable} from 'data/observable';
import * as app from 'application';
import * as dialogs from 'ui/dialogs';

export interface BeaconCallback {
    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Beacon[]): void;
    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): void;
    didEnterRegion?(region: BeaconRegion): void;
    didExitRegion?(region: BeaconRegion): void;
}

export enum BeaconLocationOptionsIOSAuthType {
    Always, WhenInUse
}
export enum BeaconLocationOptionsAndroidAuthType {
    Coarse, Fine
}

export interface BeaconLocationOptions {
    iOSAuthorisationType: BeaconLocationOptionsIOSAuthType;
    androidAuthorisationType: BeaconLocationOptionsAndroidAuthType;
    androidAuthorisationDescription: string;
}

export class Common extends Observable {

    protected options: BeaconLocationOptions = {
        iOSAuthorisationType: BeaconLocationOptionsIOSAuthType.WhenInUse,
        androidAuthorisationType: BeaconLocationOptionsAndroidAuthType.Coarse,
        androidAuthorisationDescription: "Location permission needed"
    };

    constructor(beaconCallback: BeaconCallback, options?: BeaconLocationOptions) {
        super();
        if (options) {
            this.options = options;
        }
    }

    public requestAuthorization(): Promise<any> {
        return null;
    }

    public isAuthorised() : boolean {
        return false;
    }

    public startRanging(beaconRegion: BeaconRegion) {

    }

    public stopRanging(beaconRegion: BeaconRegion) {

    }

    public startMonitoring(beaconRegion: BeaconRegion) {
        
    }

    public stopMonitoring(beaconRegion: BeaconRegion) {

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

    public distance_proximity: number;  // proximity in iOS
    public rssi: number;
    public txPower_accuracy: number;  // accuracy in iOS

    constructor(proximityUUID: string, major: number, minor: number) {
        this.proximityUUID = proximityUUID;
        this.major = major;
        this.minor = minor;
    }
}


