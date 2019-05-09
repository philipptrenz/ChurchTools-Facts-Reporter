# ChurchTools Facts Reporter

This app provides an easy way to report facts about events in ChurchTools. The software is based on [Electron](http://electronjs.org) and can be used cross-platform on Windows, MacOS and Linux.

## Install

```
# Install dependencies
npm install

# Run the app
npm start
```
### Package application

```
# Install electron packager
npm install -g electron-packager

# Package the application
npm run-script package
```

## Todos

* Login
	* Add auto-logout on quit
	* Add password delete button
* Usability
	* Display overwrite warning, if event already has values for its facts
	* Display if reporting facts worked or not
	* Auto-select latest event
* Architecture
	* Convert to [TypeScript](https://www.typescriptlang.org)
	* Convert to [React](https://reactjs.org) components
	* Add [Materialize](http://materializecss.com)
* Make it fancy ✨