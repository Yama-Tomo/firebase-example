const dotenv = require('dotenv')
const path = require('path')

const activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || 'development'
dotenv.config({ path: `.env.${activeEnv}` })

module.exports = {
  siteMetadata: {
    title: `Gatsby`,
    siteUrl: `https://www.gatsbyjs.org`,
    description: `Blazing fast modern site generator for React`,
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-graphql-codegen',
      options: {
        fileName: 'graphql.d.ts',
        documentPaths: [
          './src/**/*.{ts,tsx}',
          './node_modules/gatsby-*/**/*.js',
          '../../node_modules/gatsby-*/**/*.js',
          './.cache/fragments/*.js',
        ],
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ]
}
