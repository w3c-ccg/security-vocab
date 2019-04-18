'use strict';

const contexts = exports.contexts = new Map();

contexts.set(
  'https://w3id.org/security/v1',
  require('../contexts/security-v1.jsonld'));
contexts.set(
  'https://w3id.org/security/v2',
  require('../contexts/security-v2.jsonld'));
