const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

module.exports = {
  ignore: isTest ? [] : ['**/__test__/**/*'],
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: 2,
        targets: {
          browsers: 'last 2 versions, not dead', // Ref: https://github.com/browserslist/browserslist#best-practices
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        development: !isProduction,
      },
    ],
  ],
  plugins: [
    'react-hot-loader/babel',
    [
      'babel-plugin-styled-components',
      {
        displayName: !isProduction,
        pure: isProduction,
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ],
}
