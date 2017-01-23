'use strict';

const _ = require('lodash');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');

var MESSAGES_PATTERN = './dist/src/**/*.json';
var LANG_DIR = './src/messages';

exports.default = function () {

  // Aggregates the default messages that were extracted from the example app's
  // React components via the React Intl Babel plugin. An error will be thrown if
  // there are messages in different components that use the same `id`. The result
  // is a flat collection of `id: message` pairs for the app's default locale.
  var defaultMessages = glob.sync(MESSAGES_PATTERN).map(function (filename) {
    return fs.readFileSync(filename, 'utf8');
  }).map(function (file) {
    return JSON.parse(file);
  }).reduce(function (collection, descriptors) {
    descriptors.forEach(function (descriptor) {
      var id = descriptor.id;
      var defaultMessage = descriptor.defaultMessage;

      if (collection.hasOwnProperty(id)) {
        throw new Error('Duplicate message id: ' + id);
      }

      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

  // For the purpose of this example app a fake locale: `en-UPPER` is created and
  // the app's default messages are "translated" into this new "locale" by simply
  // UPPERCASING all of the message text. In a real app this would be through some
  // offline process to get the app's messages translated by machine or
  // processional translators.
  function uppercaseTranslator(text) {
    return text.toUpperCase();
  }

  var uppercaseMessages = _.keys(defaultMessages).map(function (id) {
    return [id, defaultMessages[id]];
  }).reduce(function (collection, message) {
    var id = message[0];
    var defaultMessage = message[1];

    collection[id] = uppercaseTranslator(defaultMessage);
    return collection;
  }, {});

  console.log(`Generated ${_.size(defaultMessages)} messages`);

  mkdirp.sync(LANG_DIR);
  fs.writeFileSync(`${LANG_DIR}/en-US.json`, JSON.stringify(defaultMessages, null, 2));
  fs.writeFileSync(`${LANG_DIR}/en.json`, JSON.stringify(defaultMessages, null, 2));
  fs.writeFileSync(`${LANG_DIR}/en-UPPER.json`, JSON.stringify(uppercaseMessages, null, 2));
};
