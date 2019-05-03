'use strict';

const contexts = exports.contexts = new Map();
const constants = exports.constants = require('./constants.js');

contexts.set(
  constants.SECURITY_CONTEXT_V1_URL,
  require('../contexts/security-v1.jsonld'));
contexts.set(
  constants.SECURITY_CONTEXT_V2_URL,
  require('../contexts/security-v2.jsonld'));
