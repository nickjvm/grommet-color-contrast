import git from 'gulp-git';

module.exports = function gulpCiCd(gulp) {
  const runSequence = require('run-sequence').use(gulp);
  const fs = require('fs');

  let version = '';
  let savedBranch = '';

  gulp.task('~saveBranch', (done) => {
    git.revParse({ args: '--abbrev-ref HEAD' }, (err, branchName) => {
      if (err) throw err;
      savedBranch = branchName;
      // eslint-disable-next-line no-console
      console.log(`Save current branch: ${savedBranch}`);
      done();
    });
  });

  gulp.task('checkout-dev', (done) => {
    git.checkout('dev', (err) => {
      if (err) throw done(err);
      done();
    });
  });

  gulp.task('~tag-dev', (done) => {
    const project = JSON.parse(fs.readFileSync('./package.json'));
    version = project.version;
    // eslint-disable-next-line no-console
    console.log(version);
    git.tag(version, `Release ${version}`, (err) => {
      if (err) throw err;
      done();
    });
  });

  gulp.task('~push-dev-tags', (done) => {
    git.push('origin', 'dev', { args: ' --tags' }, (err) => {
      if (err) throw err;
      done();
    });
  });

  gulp.task('~checkout-saved-branch', (done) => {
    git.checkout(savedBranch, (err) => {
      if (err) throw done(err);
      done();
    });
  });

  gulp.task('release', () => {
    runSequence(
      '~saveBranch',
      'checkout-dev',
      '~tag-dev',
      '~push-dev-tags',
      '~checkout-saved-branch',
    );
  });
};
