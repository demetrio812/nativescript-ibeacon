[![npm](https://img.shields.io/npm/v/nativescript-ibeacon.svg)](https://www.npmjs.com/package/nativescript-ibeacon)
[![npm](https://img.shields.io/npm/dt/nativescript-ibeacon.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-ibeacon)

# NativeScript iBeacon
Let you range for iBeacons, managing permissions. iOS and Android.

### Install it
```
tns plugin add nativescript-ibeacon
```

### Use it

##### Add permissions on Android Manifest
```
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
```

you can also use `android.permission.ACCESS_FINE_LOCATION` instead of `android.permission.ACCESS_COARSE_LOCATION`
##### Add keys on iOS Info.plist

###### Background usage
```
<key>NSLocationAlwaysUsageDescription</key>
<string>My description explaining why I need it</string>
```
###### Foreground usage
```
<key>NSLocationWhenInUseUsageDescription</key>
<string>My description explaining why I need it</string>
```
##### Use it

###### Create the object passing the callback and the options

```typescript
import {NativescriptIbeacon, BeaconCallback, BeaconLocationOptions, BeaconLocationOptionsIOSAuthType, BeaconLocationOptionsAndroidAuthType, BeaconRegion, Beacon } from 'nativescript-ibeacon';

let callback: BeaconCallback = {
    didRangeBeaconsInRegion: function(region: BeaconRegion, beacons: Beacon[]) {

    },
    didFailRangingBeaconsInRegion: function(region: BeaconRegion, errorCode: number, errorDescription: string) {

    }
}

let options: BeaconLocationOptions = {
    iOSAuthorisationType: BeaconLocationOptionsIOSAuthType.Always,
    androidAuthorisationType: BeaconLocationOptionsAndroidAuthType.Coarse,
    androidAuthorisationDescription: "Location permission needed"
};

let nativescriptIbeacon = new NativescriptIbeacon(callback, options);

let region = new BeaconRegion("HelloID", "2f234454-cf6d-4a0f-adf2-f4911ba9ffa6");

```

###### Request for permissions and Start ranging

```typescript
if (!nativescriptIbeacon.isAuthorised()) {
    console.log("NOT Authorised");
    nativescriptIbeacon.requestAuthorization()
        .then(() => {
            console.log("Authorised by the user");
            nativescriptIbeacon.startRanging(region);

        }, (e) => {
            console.log("Authorisation denied by the user");
        })
} else {
    console.log("Authorised");
}

###### Request for permissions and Start monitoring

```typescript
if (!nativescriptIbeacon.isAuthorised()) {
    console.log("NOT Authorised");
    nativescriptIbeacon.requestAuthorization()
        .then(() => {
            console.log("Authorised by the user");
            nativescriptIbeacon.startMonitoring(region);

        }, (e) => {
            console.log("Authorisation denied by the user");
        })
} else {
    console.log("Authorised");
}
```
###### Stop ranging

```typescript
nativescriptIbeacon.stopRanging(region);
```

### Note on the Beacon class
The shared `Beacon` class contain the following values:
    
    public proximityUUID: string;
    public major: number;
    public minor: number;

    public rssi: number;
    public distance_proximity: number;  // distance in Android, proximity in iOS
    public txPower_accuracy: number;  // txPower in Android, accuracy in iOS
    
As you can see there is some difference on iOS and Android platform regarding the last 2 values. Keep this in mind while using the class.

On iOS, the values for proximity are:

    public enum CLProximity : Int {
        case unknown  // =0
        case immediate  // =1
        case near  // =2
        case far  // =3
    }    
    
    The value in this property gives a general sense of the relative distance to the beacon. 
    Use it to quickly identify beacons that are nearer to the user rather than farther away.
    
On iOS, accuracy is described like:

    Indicates the one sigma horizontal accuracy in meters. Use this property to differentiate between beacons with the same proximity value. Do not use it to identify a precise location for the beacon. Accuracy values may fluctuate due to RF interference.
    A negative value in this property signifies that the actual accuracy could not be determined.
    
    public typealias CLLocationAccuracy = Double

### Run the demo

Please note that you need a real device to test beacon ranging (you will receive an error otherwise).

To run the demo you can use one of the following commands:

    npm run demo.ios.device

or

    npm run demo.android.device
    
### TODO
* Better Demo
* Debug
* More options