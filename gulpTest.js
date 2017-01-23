
const spawn = require('cross-spawn').spawn;

function scriptRunner(name) {
  return (bin, args, cb, _opts = {}) => {
    const opts = Object.assign({ stdio: 'inherit' }, _opts);
    const child = spawn(bin, args, opts);
    process.on('SIGTERM', () => child.kill('SIGTERM'));
    child.on('close', (code) => {
      if (code > 0) return cb(new Error(`Error running ${name}`));
      cb();
    });
    return child;
  };
}

module.exports = function gulpTests(gulp) {
  const runSequence = require('run-sequence').use(gulp);
  const gulpBin = require.resolve('gulp/bin/gulp');
  let watch = false;

  gulp.task('test', (cb) => {
    const args = ['test'];
    if (watch) args.push('--', '--', '--watch');
    scriptRunner('Tests')('npm', args, cb);
  });

  gulp.task('test:coverage', (cb) => {
    scriptRunner('Coverage')('npm', ['test', '--', '--', '--coverage'], cb);
  });

  gulp.task('test:watch', (cb) => {
    watch = true;
    runSequence('test', cb);
  });

  gulp.task('jest', (cb) => {
    scriptRunner('Jest')('npm', ['run', '-s', 'jest'], cb);
  });

  gulp.task('jest:watch', (cb) => {
    scriptRunner('Jest')('npm', ['run', '-s', 'jest', '--', '--watch'], cb);
  });

  gulp.task('jest:changed', (cb) => {
    scriptRunner('Jest')('npm', ['run', '-s', 'jest', '--', '-o'], cb);
  });

  gulp.task('jslint:server', (cb) => {
    scriptRunner('Server Lint')(gulpBin, ['jslint'], cb, { cwd: './server' });
  });

  gulp.task('test:server', ['jslint:server'], (cb) => {
    scriptRunner('Server Tests')(gulpBin, ['test'], cb, { cwd: './server' });
  });
};
