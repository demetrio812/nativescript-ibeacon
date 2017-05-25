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
```
###### Stop ranging

```typescript
nativescriptIbeacon.stopRanging(region);
```
### TODO
* Better Demo
* Region monitoring
* Debug
* More options