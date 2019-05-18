const packager = require('electron-packager');
const rebuild = require('electron-rebuild');

packager({

    // electron-packager . "ChurchTools Facts Reporter" --overwrite --asar --platform=win32 --arch=x64 --icon=assets/icons/win/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName="ChurchTools Facts Reporter"
    dir: '.',
    name: 'ChurchTools Facts Reporter',
    out: 'release-builds',

    platform: 'win32',
    arch: 'x64',
    icon: 'assets/icons/win/icon.ico',
    companyName: "CE",
    FileDescription: "CE",
    ProductName: "ChurchTools Facts Reporter",

    prune: true,
    overwrite: true,
    asar: false,

    // … other options
    afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
        rebuild.rebuild({ buildPath, electronVersion, arch })
            .then(() => callback())
            .catch((error) => callback(error));
    }],
    // … other options
});