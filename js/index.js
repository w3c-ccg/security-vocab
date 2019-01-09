'use strict';

const fs = require('fs');
const path = require('path');

const v1 = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../contexts/security-v1.jsonld'),
    {encoding: 'utf8'}));

const v2 = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../contexts/security-v2.jsonld'),
    {encoding: 'utf8'}));

module.exports = {v1, v2};
