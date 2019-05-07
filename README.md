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
electron-packager . "ChurchTools Facts Reporter" --ignore="\.gitignore" --out="out/"
```

## Todos

* Change credential-manager to secure [keytar](https://www.npmjs.com/package/keytar)
* Convert to [TypeScript](https://www.typescriptlang.org)
* Convert to [React](https://reactjs.org) components
* Add [Materialize](http://materializecss.com)
* Make it fancy ✨