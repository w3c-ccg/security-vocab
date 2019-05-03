'use strict';

const constants = require('./constants');
const fs = require('fs');
const path = require('path');

exports.constants = constants;
const contexts = exports.contexts = new Map();

function _read(_path) {
  return JSON.parse(
    fs.readFileSync(
      path.join(__dirname, _path),
      {encoding: 'utf8'}));
}

contexts.set(
  constants.SECURITY_CONTEXT_V1_URL,
  _read('../contexts/security-v1.jsonld'));
contexts.set(
  constants.SECURITY_CONTEXT_V2_URL,
  _read('../contexts/security-v2.jsonld'));
