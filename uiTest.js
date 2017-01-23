/* eslint-disable */
let page = require('webpage').create(),
  system = require('system'),
  t,
  address;

if (system.args.length === 1) {
  console.log('Usage: loadspeed.js <some URL>');
  phantom.exit(1);
} else {
  t = Date.now();
  address = system.args[1];
  page.open(address, (status) => {
    if (status !== 'success') {
      console.log(`Failed to load: ${address}`);
    } else {
      t = Date.now() - t;
      const title = page.evaluate(() => document.title);
      if (title === 'Network Error') {
        console.log(`Failed to load: ${address}`);
      }
      console.log(`Page title is ${title}`);
      console.log(`Loading time for: '${address}\' is :${t} msec`);
    }
    phantom.exit();
  });
}
