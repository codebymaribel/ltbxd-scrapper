const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ltbxdScrapper',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@/types': path.resolve(__dirname, './types/index.d.ts'),
      '@/scrapper': path.resolve(__dirname, './src/shared/scrapper.ts'),
      '@/helpers': path.resolve(__dirname, './src/shared/function-helpers.ts'),
      '@/config': path.resolve(__dirname, './src/config/constants.ts'),
    },
  },

  target: 'node', // Ensure Webpack bundles for Node.js
  externals: {
    puppeteer: 'commonjs puppeteer',
  },
};
