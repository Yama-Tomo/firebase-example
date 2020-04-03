const path = require('path')
const glob = require('glob')
const firebase = require('firebase-admin');

require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'esnext',
  },
  files: true,
})

exports.onCreateWebpackConfig = ({ actions, loaders, getConfig }) => {
  const config = getConfig()
  config.resolve.alias['~'] = path.resolve('./src')

  actions.replaceWebpackConfig(config)
}

exports.createPages = async ({ actions }) => {
  const app = firebase.initializeApp()
  const store = app.firestore()

  const pages = glob.sync('./src/templates/**.tsx').map(file => require(file))
  const callbacks = pages
    .filter(page => typeof page.createPageCb === 'function')
    .map(page => page.createPageCb(actions, store))

  // TODO: 同時に処理する数を制限できるように
  await Promise.all(callbacks)
}
