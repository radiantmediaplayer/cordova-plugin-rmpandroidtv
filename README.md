# cordova-plugin-rmpandroidtv

Cordova plugin to prepare an Android app for Android TV deployment while using Radiant Media Player

## Install

`cordova plugin add https://github.com/radiantmediaplayer/cordova-plugin-rmpandroidtv.git`

## Remove

`cordova plugin rm "cordova-plugin-rmpandroidtv"`

## What does this plugin do?

This plugin prepares an Android application built with Cordova for deployment for Android TV devices. It provides [all requirements](https://developer.android.com/training/tv/start/start) for an app to be published on the Google Play store for Android TV. More specifically:

- it copies Leanback launcher home screen banner (banner.png expected to be found in www/img/ from your Cordova project) into the appropriate folder so that it can be referenced in AndroidManifest.xml
- it overwrites MainActivity.java produces with the `cordova prepare android` command to use display in [native resolution on Android TV](https://github.com/apache/cordova-android/issues/870) based on Google recommandation for [Pixel-Perfect UI in the WebView](https://developer.chrome.com/multidevice/webview/pixelperfect)
- it updates AndroidManifest.xml to add key components for the app to be Android TV ready

This plugin is mainly intended to work with [rmp-android-tv](https://github.com/radiantmediaplayer/rmp-android-tv), a demo app for using [Radiant Media Player](https://www.radiantmediaplayer.com) in a web-based app built for Android TV with Cordova.
