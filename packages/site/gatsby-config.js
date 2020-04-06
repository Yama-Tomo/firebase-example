const dotenv = require('dotenv')

const activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || 'development'
dotenv.config({ path: `.env.${activeEnv}` })

module.exports = {
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-graphql-codegen',
      options: {
        fileName: 'graphql.d.ts',
      }
    }
  ]
}
