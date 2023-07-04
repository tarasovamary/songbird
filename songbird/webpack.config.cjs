const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    main: ['./public/index.js', './sass/style.scss'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html'),
      filename: 'index.html',
    }),
    new CopyPlugin({
      patterns: [
          {
              from: path.resolve(__dirname, './assets'),
              to: path.resolve(__dirname, './dist/assets'),
            },
      ],
    }),
  ],
  devServer: {
      watchFiles: path.join(__dirname, 'public'),
      port: 9000,
    },
  module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: ['./sass'],
                },
              },
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ]
    },
    resolve: {
      extensions: ['.js'],
    },
};