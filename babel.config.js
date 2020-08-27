module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime'
  ]
};
