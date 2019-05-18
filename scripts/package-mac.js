const packager = require('electron-packager');
const rebuild = require('electron-rebuild');

packager({

    // electron-packager . "ChurchTools Facts Reporter" --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=release-builds
    dir: '.',
    name: 'ChurchTools Facts Reporter',
    out: 'release-builds',

    platform: 'darwin',
    arch: 'x64',
    icon: 'assets/icons/mac/icon.icns',

    prune: true,
    overwrite: true,
    asar: true,

    // … other options
    afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
        rebuild.rebuild({ buildPath, electronVersion, arch })
            .then(() => callback())
            .catch((error) => callback(error));
    }],
    // … other options
});