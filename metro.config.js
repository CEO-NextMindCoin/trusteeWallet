const extraNodeModules = require('node-libs-browser')
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts
defaultSourceExts.push('cjs')
extraNodeModules.sourceExts = defaultSourceExts
module.exports = {
    resolver: {
        extraNodeModules,
        assetExts: ['png', 'jpeg', 'jpg']
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false
            }
        })
    }
}
