import {
    Beacon, BeaconCallback, BeaconLocationOptions, BeaconLocationOptionsAndroidAuthType, BeaconRegion,
    Common, BeaconParserTypes
} from './nativescript-ibeacon.common';
import * as utils from "utils/utils";
import {setActivityCallbacks, AndroidActivityCallbacks} from "ui/frame";

var permissions = require( "nativescript-permissions" );

declare let org: any;
declare let android:any;

@Interfaces([org.altbeacon.beacon.BeaconConsumer])
export class LocationService extends java.lang.Object {
    private beaconManager: any = null;
    public delegate: BeaconCallback = null;

    private context: android.content.Context;

    private beaconManagerReady: boolean = false;
    private rangeNotifierAdded: boolean = false;
    private monitorNotifierAdded: boolean = false;

    private pendingBeaconRegion: BeaconRegion = null;
    private pendingBeaconMonitor: BeaconRegion = null;

    private options: BeaconLocationOptions = null;
    private beaconParserTypes: BeaconParserTypes = new BeaconParserTypes();

    constructor(context: android.content.Context, options: BeaconLocationOptions) {
        super();
        console.log("constructor");
        this.context = context;
        this.options = options;
        return global.__native(this);
    }

    public bind() {
        this.getBeaconManager().bind(this);
    }

    public unbind() {
        this.beaconManagerReady = false;
        this.getBeaconManager().unbind(this);
    }

    private getBeaconManager() {
        if (this.beaconManager == null) {
            this.beaconManager = org.altbeacon.beacon.BeaconManager.getInstanceForApplication(this.context/*utils.ad.getApplicationContext()*/);
            this.beaconManager.getBeaconParsers().clear();
            // no parsers defined? Add all default types
            if (this.options.parserTypes == null 
                || this.options.parserTypes == null 
                || this.options.parserTypes.length < 1) {
                this.beaconParserTypes.getTypes().forEach(type => {
                    this.beaconManager.getBeaconParsers().add(
                        new org.altbeacon.beacon.BeaconParser().
                        setBeaconLayout(type)
                        );
                });
                console.log(this.beaconParserTypes.getTypes().length + " default parsers added");
            }
            // else add all passed parser types
            else {
                this.options.parserTypes.forEach(typeId => {
                    this.beaconManager.getBeaconParsers().add(
                        new org.altbeacon.beacon.BeaconParser().
                        setBeaconLayout(this.beaconParserTypes.getType(typeId))
                        );
                });
                console.log(this.options.parserTypes.length + " parsers added");
            }
            console.log("beaconManager created");
        }
        return this.beaconManager;
    }

    public startRanging(beaconRegion: BeaconRegion) {
        if (this.beaconManagerReady) {
            console.log("startRanging");
            try {
                if (beaconRegion.rangingOptions.foregroundScanInterval != null 
                    && beaconRegion.rangingOptions.foregroundScanInterval > 0) {
                    this.beaconManager.setForegroundBetweenScanPeriod(beaconRegion.rangingOptions.foregroundScanInterval);
                    console.log("foregroundScanInterval: " + beaconRegion.rangingOptions.foregroundScanInterval);
                }
                if (beaconRegion.rangingOptions.backgroundScanInterval != null 
                    && beaconRegion.rangingOptions.backgroundScanInterval > 0) {
                    this.beaconManager.setBackgroundBetweenScanPeriod(beaconRegion.rangingOptions.backgroundScanInterval);
                    console.log("backgroundScanInterval: " + beaconRegion.rangingOptions.backgroundScanInterval);
                }
                console.log("startRangingBeaconsInRegion");
                this.getBeaconManager().startRangingBeaconsInRegion(this.getRegionFromBeaconRegion(beaconRegion)); //
                //console.log("startRangingBeaconsInRegion2");
            } catch (e) {
                //e.printStackTrace();
            }
        } else {
            console.log("startRanging stopped: beacon manager not ready");
            this.pendingBeaconRegion = beaconRegion;
            this.bind(); // init the beacon manager
        }
    }

    public stopRanging(beaconRegion: BeaconRegion) {
        if (this.beaconManagerReady) {
            console.log("stopRanging");
            this.getBeaconManager().stopRangingBeaconsInRegion(this.getRegionFromBeaconRegion(beaconRegion));
        } else {
            console.log("stopRanging stopped: beacon manager not ready");
        }
    }

    public startMonitoring(beaconRegion: BeaconRegion) {
        if (this.beaconManagerReady) {
            console.log("startMonitoring");
            this.getBeaconManager().startMonitoringBeaconsInRegion(this.getRegionFromBeaconRegion(beaconRegion));
        } else {
            console.log("startMonitoring stopped: beacon manager not ready");
            this.pendingBeaconMonitor = beaconRegion;
            this.bind(); // init the beacon manager
        }
    }

    public stopMonitoring(beaconRegion: BeaconRegion) {
        if (this.beaconManagerReady) {
            console.log("stopMonitoring");
            this.getBeaconManager().stopMonitoringBeaconsInRegion(this.getRegionFromBeaconRegion(beaconRegion));
        } else {
            console.log("stopMonitoring stopped: beacon manager not ready");
        }
    }

    public onBeaconServiceConnect() {
        console.log("onBeaconServiceConnect");
        this.beaconManagerReady = true;
        let me = this;

        if (!this.rangeNotifierAdded) {
            this.rangeNotifierAdded = true;
            this.getBeaconManager().addRangeNotifier(new org.altbeacon.beacon.RangeNotifier({

                didRangeBeaconsInRegion: function (beacons: /*java.util.Collection<org.altbeacon.beacon.Beacon>*/any, region: /*org.altbeacon.beacon.Region*/any) {
                    //console.log("didRangeBeaconsInRegion");
                    //if (beacons.size() > 0) {
                    if (me.delegate) {
                        let beaconsArray = beacons.toArray();
                        let beaconsList: Beacon[] = [];
                        for (let c = 0; c < beaconsArray.length; c++) {
                            let beacon = beaconsArray[c];
                            beaconsList.push(me.getBeaconFromNativeBeacon(beacon));
                            //console.log("TEST", "LS: The first beacon " + beacon.getId1().toUuid().toString() + " I see is about " + beacon.getDistance() + " meters away.");
                        }
                        me.delegate.didRangeBeaconsInRegion(me.getBeaconRegionFromRegion(region), beaconsList);
                    }
                    //}
                }
            }));
        }

        if (!this.monitorNotifierAdded) {
            this.monitorNotifierAdded = true;
            this.getBeaconManager().addMonitorNotifier(new org.altbeacon.beacon.MonitorNotifier({

                didEnterRegion: function (region: any) {
                    console.log("didEnterRegion", me.delegate, region);
                    if (me.delegate && me.delegate.didEnterRegion) {
                        me.delegate.didEnterRegion(me.getBeaconRegionFromRegion(region));
                    }
                },
                didExitRegion: function (region: any) {
                    console.log("didExitRegion");
                    if (me.delegate && me.delegate.didExitRegion) {
                        me.delegate.didExitRegion(me.getBeaconRegionFromRegion(region));
                    }
                },
                didDetermineStateForRegion: function (state: number, region: any) {
                    console.log("didDetermineStateForRegion");
                    console.log(state);
                    console.log(region);
                }
            }));
        }

        // Beacon manager ready
        if (me.delegate && me.delegate.onBeaconManagerReady) {
            me.delegate.onBeaconManagerReady();
        }

        // Checking pending reagions

        if (this.pendingBeaconRegion != null) {
            this.startRanging(this.pendingBeaconRegion);
            this.pendingBeaconRegion = null;
        }

        if (this.pendingBeaconMonitor != null) {
            this.startMonitoring(this.pendingBeaconMonitor);
            this.pendingBeaconMonitor = null;
        }

    }

    getRegionFromBeaconRegion(beaconRegion: BeaconRegion): any {

        let minor = null;
        if (beaconRegion.minor) {
            minor = org.altbeacon.beacon.Identifier.fromInt(beaconRegion.minor);
        }

        let major = null;
        if (beaconRegion.major) {
            major = org.altbeacon.beacon.Identifier.fromInt(beaconRegion.major);
        }

        if (beaconRegion.proximityUUID) {
            return new org.altbeacon.beacon.Region(beaconRegion.identifier, org.altbeacon.beacon.Identifier.fromUuid(java.util.UUID.fromString(beaconRegion.proximityUUID)), major, minor);
        }
        else {
            return new org.altbeacon.beacon.Region(beaconRegion.identifier, null, major, minor);
        }

    }

    getBeaconRegionFromRegion(region: any /*org.altbeacon.beacon.Region*/): BeaconRegion {
        let uuid = null;
        if (region.getId1()) {
            uuid = region.getId1().toString();
        }
        let major = null;
        if (region.getId2()) {
            major = Number(region.getId2().toString())
        }
        let minor = null;
        if (region.getId3()) {
            minor = Number(region.getId3().toString())
        }
        let bregion = new BeaconRegion(region.getUniqueId(), uuid, major, minor);
        return bregion;
    }

    getBeaconFromNativeBeacon(nativeBeacon: any): Beacon {
        let beacon = new Beacon(nativeBeacon.getId1().toString(), nativeBeacon.getId2().toInt(), nativeBeacon.getId3().toInt());
        beacon.distance_proximity = nativeBeacon.getDistance();
        beacon.rssi = nativeBeacon.getRssi();
        beacon.txPower_accuracy = nativeBeacon.getTxPower();
        return beacon;
    }

    public getApplicationContext() {
        return this.context;
    }


    public unbindService(serviceConnection: android.content.ServiceConnection) {
        this.context.unbindService(serviceConnection);
    }


    public bindService(intent: android.content.Intent, serviceConnection: android.content.ServiceConnection, i: number): boolean {
        return this.context.bindService(intent, serviceConnection, i);
    }
}

export class NativescriptIbeacon extends Common {
    private locationService: LocationService = null;

    constructor(beaconCallback: BeaconCallback, options?: BeaconLocationOptions) {
        super(beaconCallback);
        this.locationService = new LocationService(utils.ad.getApplicationContext(), options);
        this.locationService.delegate = beaconCallback;
    }

    public requestAuthorization(): Promise<any> {
        return permissions.requestPermission(this.getPermission(), this.options.androidAuthorisationDescription);
    }

    public isAuthorised() : boolean {
        return permissions.hasPermission(this.getPermission());
    }

    private getPermission() {
        let permission = null;
        if (this.options.androidAuthorisationType==BeaconLocationOptionsAndroidAuthType.Coarse) {
            permission = android.Manifest.permission.ACCESS_COARSE_LOCATION;
        } else {
            permission = android.Manifest.permission.ACCESS_FINE_LOCATION;
        }
        return permission;
    }

    public bind() {
        this.locationService.bind();
    }

    public unbind() {
        this.locationService.unbind();
    }

    public startRanging(beaconRegion: BeaconRegion) {
        this.locationService.startRanging(beaconRegion);
    }

    public stopRanging(beaconRegion: BeaconRegion) {
        this.locationService.stopRanging(beaconRegion);
    }

    public startMonitoring(beaconRegion: BeaconRegion) {
        this.locationService.startMonitoring(beaconRegion);
    }

    public stopMonitoring(beaconRegion: BeaconRegion) {
        this.locationService.stopMonitoring(beaconRegion);
    }

}