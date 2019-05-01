module.exports = {
  output: {
    library: 'securityvocab'
  },
  mode: 'production',
  entry: './js/browser.js',
  module: {
    rules: [
      {
        test: /\.jsonld$/,
        loader: 'json-loader'
      }
    ]
  }
};
