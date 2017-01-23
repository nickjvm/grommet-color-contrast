
import gulp from 'gulp';
import toolbox from 'grommet-toolbox';
import { argv } from 'yargs';

import gulpIntl from './gulpIntl';
import gulpTest from './gulpTest';
import gulpCiCd from './gulpCiCd';

// TEMP fix to enable babel-resolver for grommet gulp tests
if (/test|dist/.test(argv._[0])) {
  process.env.BABEL_ENV = 'gulptest';
}

gulpIntl(gulp);

toolbox(gulp);

gulpTest(gulp);

gulpCiCd(gulp);
