# ChurchTools Facts Reporter

This app provides an easy way to report facts about events in ChurchTools. The software is based on [Electron](http://electronjs.org) and can be used cross-platform on Windows, MacOS and Linux.

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

## Todos

* Architecture
    * Testing
	* Convert to [TypeScript](https://www.typescriptlang.org)
	* Convert to [React](https://reactjs.org) components
	