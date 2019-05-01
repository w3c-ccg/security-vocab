'use strict';

import {constants} from './constants.js';
const contexts = new Map();

contexts.set(
  constants.SECURITY_CONTEXT_V1_URL,
  require('../contexts/security-v1.jsonld'));
contexts.set(
  constants.SECURITY_CONTEXT_V2_URL,
  require('../contexts/security-v2.jsonld'));

export {constants, contexts};
