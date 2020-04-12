const path = require('path')
const glob = require('glob')
const firebase = require('firebase-admin')

let isFirebaseInit = false

require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'ES2018',
  },
  files: true,
})


exports.onCreateWebpackConfig = ({ actions, loaders, getConfig }) => {
  const config = getConfig()
  config.resolve.alias['~'] = path.resolve('./src')

  actions.replaceWebpackConfig(config)
}

const initializeFirebase = () => {
  if (isFirebaseInit) {
    return
  }

  firebase.initializeApp()
  isFirebaseInit = true
}

exports.createPages = async (arg) => {
  initializeFirebase()
  const store = firebase.firestore()

  const pages = glob.sync('./src/templates/**/*.tsx').map(file => require(file))
  const callbacks = pages
    .filter(page => typeof page.createPageCb === 'function')
    .map(page => page.createPageCb(arg, store))

  // TODO: 同時に処理する数を制限できるように
  await Promise.all(callbacks)
}

exports.sourceNodes = async (arg) => {
  const fireStore = require('./src/gatsby-node/firestore')
  initializeFirebase()

  await Promise.all([fireStore.sourceNodes(arg)])
}
