#!/usr/bin/env node

const fs = require('fs'),
  path = require('path');

const _getConfig = function (context) {
  const ConfigParser = context.requireCordovaModule('cordova-common').ConfigParser;
  const projectRoot = context.opts.projectRoot;
  const config = new ConfigParser(path.join(projectRoot, 'config.xml'));
  const packageName = config.packageName();
  const packagePath = packageName.replace(/\./g, path.sep);
  const activityPath = path.join(projectRoot, 'platforms/android/app/src/main/java', packagePath, 'MainActivity.java');
  return { packageName, activityPath };
};

const _getTemplate = function (context, config) {
  const templatePath = path.join(context.opts.plugin.dir, 'src/android/rmpandroidtv.java');
  return fs.readFileSync(templatePath, 'utf8')
    .replace(/__ID__/g, config.packageName)
    .replace(/__ACTIVITY__/g, 'MainActivity');
};

const _updateManifest = function (context) {
  const platformRoot = path.join(context.opts.projectRoot, 'platforms/android/app/src/main'),
    manifestFile = path.join(platformRoot, 'AndroidManifest.xml');
  console.log('existsSync: ' + manifestFile);
  if (fs.existsSync(manifestFile)) {
    console.log('readFile: ' + manifestFile);
    fs.readFile(manifestFile, 'utf8', function (err, data) {
      if (err) {
        throw new Error('Unable to find AndroidManifest.xml: ' + err);
      }
      if (!/<application android:banner="@drawable\/banner"/.test(data)) {
        data = data.replace(/<application/, '<application android:banner="@drawable/banner" android:isGame="false" ');
      }
      if (!/<activity android:screenOrientation="landscape"/.test(data)) {
        data = data.replace(/<activity/, '<activity android:screenOrientation="landscape" ');
      }
      data = data.replace(/android:configChanges="\D+?"/, 'android:configChanges="keyboard|keyboardHidden|navigation"');
      data = data.replace(/android:theme="\D+?"/, 'android:theme="@android:style/Theme.NoTitleBar"');
      fs.writeFile(manifestFile, data, 'utf8', function (err) {
        console.log('wrote AndroidManifest.xml');
        if (err) {
          throw new Error('Unable to write into AndroidManifest.xml: ' + err);
        }
      });
    });
  }
};

const _copyBanner = function (context) {
  const projectRoot = context.opts.projectRoot;
  const originPathToBanner = path.join(projectRoot, 'www/img/');
  const destinationPathToBanner = path.join(projectRoot, 'platforms/android/app/src/main/res/drawable/');
  // copy banner 
  if (!fs.existsSync(destinationPathToBanner)) {
    fs.mkdirSync(destinationPathToBanner);
  }
  fs.copyFile(originPathToBanner + 'banner.png', destinationPathToBanner + 'banner.png', (err) => {
    if (err) {
      throw new Error(err);
    }
    console.log(originPathToBanner + 'banner.png was copied to' + destinationPathToBanner + 'banner.png');
  });
};

module.exports = function (context) {
  // make sure android platform is part of build
  if (!context.opts.platforms.includes('android')) {
    return;
  }
  const config = _getConfig(context);
  const template = _getTemplate(context, config);
  _copyBanner(context);
  fs.writeFile(config.activityPath, template, 'utf8', function (err) {
    if (err) {
      throw new Error(err);
    }
    _updateManifest(context);
  });
};
