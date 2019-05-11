# ChurchTools Facts Reporter

This app provides an easy way to report facts about events in [ChurchTools](http://church.tools). The software is based on [Electron](http://electronjs.org) and can be used cross-platform on Windows, MacOS and Linux.

If you like my project and want to keep me motivated:

<a href='https://ko-fi.com/U7U6COXD' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi2.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Install

```
# Install dependencies
npm install

# Run the app
npm start
```

*Note:* If you are on Linux install the `libsecret` library first ([see here](https://www.npmjs.com/package/keytar#on-linux)).


### Package application

```
# Install electron packager
npm install -g electron-packager

# Package the application
npm run-script package-mac
npm run-script package-win
npm run-script package-linux
```
	