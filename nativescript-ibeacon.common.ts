import {Observable} from 'data/observable';
import * as app from 'application';
import * as dialogs from 'ui/dialogs';

export interface BeaconCallback {
    onBeaconManagerReady(): void;
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
export enum BeaconParserType {
    AltBeacon, EddystoneTLM, EddystoneUID, EddystoneURL, IBeacon
}

export interface BeaconLocationOptions {
    iOSAuthorisationType: BeaconLocationOptionsIOSAuthType;
    androidAuthorisationType: BeaconLocationOptionsAndroidAuthType;
    androidAuthorisationDescription: string
    parserTypes: number[];
}

export interface RangingOptions {
    foregroundScanInterval: number;
    backgroundScanInterval: number;
}

export class Common extends Observable {

    protected options: BeaconLocationOptions = {
        iOSAuthorisationType: BeaconLocationOptionsIOSAuthType.WhenInUse,
        androidAuthorisationType: BeaconLocationOptionsAndroidAuthType.Coarse,
        androidAuthorisationDescription: "Location permission needed",
        parserTypes: []
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

    public bind() {

    }

    public unbind() {

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
    public proximityUUID?: string;
    public major?: number;
    public minor?: number;
    public rangingOptions?: RangingOptions;

    constructor(identifier: string, proximityUUID?: string, major?: number, minor?: number, rangingOptions?: RangingOptions) {
        this.identifier = identifier;
        if (proximityUUID) this.proximityUUID = proximityUUID;
        if (major) this.major = major;
        if (minor) this.minor = minor;
        if (rangingOptions) this.rangingOptions = rangingOptions;
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

export class BeaconParserTypes {
    private types: string[];
    private altBeacon: string = "m:2-3=beac,i:4-19,i:20-21,i:22-23,p:24-24,d:25-25";
    private eddystoneTLM: string = "x,s:0-1=feaa,m:2-2=20,d:3-3,d:4-5,d:6-7,d:8-11,d:12-15";
    private eddystoneUID: string = "s:0-1=feaa,m:2-2=00,p:3-3:-41,i:4-13,i:14-19";
    private eddystoneURL: string = "s:0-1=feaa,m:2-2=10,p:3-3:-41,i:4-20v";
    private iBeacon: string = "m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24";
    constructor() {
        this.types = [];
        this.types[BeaconParserType.AltBeacon] = this.altBeacon;
        this.types[BeaconParserType.EddystoneTLM] = this.eddystoneTLM;
        this.types[BeaconParserType.EddystoneUID] = this.eddystoneUID;
        this.types[BeaconParserType.EddystoneURL] = this.eddystoneURL;
        this.types[BeaconParserType.IBeacon] = this.iBeacon;
    }
    public getTypes(): string[] {
        return this.types;
    }
    public getType(id: number): string {
        return this.types[id];
    }
}
