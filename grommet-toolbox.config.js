const path = require('path');

const root = path.resolve('src');
const argv = require('yargs').argv;
const pkg = require('./package.json');
const merge = require('lodash/merge');

let localConfig = {};
try {
  localConfig = require('./grommet-toolbox.config.local.js');
} catch (e) {} // eslint-disable-line no-unused-vars, no-empty

const { NODE_ENV, debug, port = 8014 } = argv;
const defaultProxy = 'localhost:8114';
const proxy = argv.proxy || localConfig.proxy || defaultProxy;

const HtmlPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackLoggerPlugin = require('webpack-logger-plugin');

const config = {
  base: '.',
  copyAssets: [
    'src/index.html',
    {
      asset: 'src/assets/images/**',
      dist: 'dist/icons/',
    },
  ],
  // The 8014 port number needs to align with hostName in index.js
  devServerPort: port,
  devServer: {
    compress: true,
    quiet: true,
    proxy: {
      '/rest/*': {
        target: `http://${proxy}`,
        logLevel: 'silent',
      },
      '/wss': {
        target: `http://${proxy}`,
        ws: true,
        logLevel: 'silent',
      },
    },
  },
  // allowing grommet gulp task to set and expose NODE_ENV through webpack
  jsAssets: ['src/**/*.js'],
  mainJs: 'src/index.js',
  mainScss: 'src/assets/scss/styles.scss',
  scssAssets: ['src/**/*.scss'],
  sync: {
    // hostname: 'grommet.us.rdlabs.hpecorp.net'
    // username: 'ligo',
    // remoteDestination: '/var/www/html/examples/phoenix/dist'
  },
  webpack: {
    entry: `${root}/index.js`,
    output: {
      path: `${__dirname}/dist`,
      filename: 'bundle.js',
    },
    resolve: {
      root,
      modulesDirectories: ['node_modules'],
      extensions: ['', '.js', '.jsx'],
      alias: {
        ReduxDevTools: debug ? 'elements/ReduxDevTools' : 'lodash/noop',
        persistState: debug ? 'redux-devtools' : 'lodash/noop',
      },
    },
    externals: {
      global: 'typeof window !== "undefined" ? window : {}',
    },
    module: {
      loaders: [
        { test: /\.svg$/, loader: 'babel?presets[]=es2015,presets[]=react!svg-react' },
      ],
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      new HtmlPlugin({
        template: 'src/index.html',
        inject: false,
        filename: 'index.html',
      }),
      new WebpackLoggerPlugin(),
    ],
    devtool: 'eval-source-map',
  },
  env: {
    'process.env': {
      API_VERSION: 1,
      APP_NAME: JSON.stringify('HCOE'),
      APP_VERSION: JSON.stringify(pkg.version),
      DEBUG: JSON.stringify(!!debug),
      NODE_ENV: JSON.stringify(NODE_ENV || process.env.NODE_ENV || 'development'),
    },
  },
  debug,
  testPaths: [`${root}/**/*.test.js`],
  pathToBabelRc: `${__dirname}/.babelrc`,
};


if (~argv._.indexOf('dist')) {
  // On gulp dist use a better, external sourcemap.
  config.webpack.output.sourceMapFilename = '[file].map';
  config.webpack.devtool = 'source-map';
}

module.exports = merge(config, localConfig);
