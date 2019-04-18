'use strict';

const fs = require('fs');
const path = require('path');

const contexts = exports.contexts = new Map();

function _read(_path) {
  return JSON.parse(
    fs.readFileSync(
      path.join(__dirname, _path),
      {encoding: 'utf8'}));
}

contexts.set(
  'https://w3id.org/security/v1',
  _read('../contexts/security-v1.jsonld'));
contexts.set(
  'https://w3id.org/security/v2',
  _read('../contexts/security-v2.jsonld'));
