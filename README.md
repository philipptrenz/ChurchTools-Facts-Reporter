# ChurchTools Facts Reporter

This desktop application provides an easy way to report facts about events in [ChurchTools](http://church.tools). The software is based on [Electron](http://electronjs.org) and can be used cross-platform on Windows, MacOS and Linux.

![Screenshot](assets/screenshots/02.png)

Thanks to [keytar](https://www.npmjs.com/package/keytar) the password gets securely stored in system's keychain. On macOS the passwords are managed by the Keychain, on Linux by the Secret Service API/libsecret and on Windows by Credential Vault. 

If you like my project and want to keep me motivated:

<a href='https://ko-fi.com/U7U6COXD' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi2.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Install

```
# Install dependencies
yarn install

# Run the app
yarn start
```

*Note:* If you are on Linux install the `libsecret` library first ([see here](https://www.npmjs.com/package/keytar#on-linux)).


### Package application

```
# Package the application
yarn dist
```
	