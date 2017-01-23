

const babel = require('gulp-babel');
const filter = require('gulp-filter');
const translate = require('./lib/translate').default;

module.exports = (gulp) => {
  const intlBabel = {
    presets: ['es2015', 'react'],
    babelrc: false,
    plugins: [
      'transform-object-rest-spread',
      'add-module-exports',
      ['react-intl', { messagesDir: './dist/' }],
    ],
  };

  const intlBabelServer = {
    presets: ['es2015', 'react'],
    babelrc: false,
    plugins: [
      'transform-object-rest-spread',
      'add-module-exports',
      ['react-intl', { messagesDir: './server/messages/' }],
    ],
  };

  // Split into separate tasks so we can ensure generateMessages finishes before translate.
  // In the future, it would be great to create a gulp plugin function that does the work of translate.
  // That would eliminate writing any files to the file system except the generated en-US.json file.
  gulp.task('generateMessages', () => {
    const stream = gulp
      .src('src/**/messages.js')
      .pipe(babel(intlBabel))
      .pipe(filter('**/messages.json'))
      .pipe(gulp.dest('dist/src'));
    return stream;
  });

  // seperate output for server messages
  gulp.task('generateServerMessages', () => gulp
    .src('src/common/messages.js')
    .pipe(babel(intlBabelServer)));

  gulp.task('translate', ['generateMessages', 'generateServerMessages'], () => {
    translate();
  });

  gulp.task('intl', ['generateMessages', 'generateServerMessages', 'translate']);
};
