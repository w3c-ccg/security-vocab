const {
  documentLoaderFactory,
  contexts,
} = require('@transmute/jsonld-document-loader');
const fs = require('fs');
const path = require('path');

const didKeyEd25519 = require('@transmute/did-key-ed25519');
const didKeyWebCrypto = require('@transmute/did-key-web-crypto');

const documentLoader = documentLoaderFactory.pluginFactory
  .build({
    contexts: {
      ...contexts.W3C_Decentralized_Identifiers,
      ...contexts.W3ID_Security_Vocabulary,
    },
  })
  .addContext({
    // eslint-disable-next-line max-len
    'https://www.w3.org/2018/credentials/v2': require('../__fixtures__/contexts/credentials-v2-unstable.json'),
    'https://w3id.org/security/v3-unstable': JSON.parse(
      fs
        .readFileSync(
          path.resolve(
            __dirname,
            '../../contexts/security-v3-unstable.jsonld'
          )
        )
        .toString()
    ),
    // eslint-disable-next-line max-len
    'https://w3id.org/citizenship/v1': require('../__fixtures__/contexts/citizenship-v1.json')
  })
  .addResolver({
    'did:example:abc': {
      resolve: async () => {
        return require('./controllers/bls12381-g2.json');
      },
    },
    'did:example:def': {
      resolve: async () => {
        return require('./controllers/ed25519.json');
      },
    },
    'did:example:ghi': {
      resolve: async () => {
        return require('./controllers/p384.json');
      },
    },
    'did:key:z6': {
      resolve: async uri => {
        const {didDocument} = await didKeyEd25519.driver.resolve(uri, {
          accept: 'application/did+ld+json',
        });
        return didDocument;
      },
    },
    'did:key:zA': {
      resolve: async uri => {
        const {didDocument} = await didKeyWebCrypto.driver.resolve(uri, {
          accept: 'application/did+json',
        });
        return didDocument;
      },
    },
  })
  .buildDocumentLoader();

module.exports = {documentLoader};
