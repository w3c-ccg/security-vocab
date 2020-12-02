const {
  documentLoaderFactory,
  contexts,
} = require('@transmute/jsonld-document-loader');
const fs = require('fs');
const path = require('path');
const didKeyEd25519 = require('@transmute/did-key-ed25519');
const didKeyWebCrypto = require('@transmute/did-key-web-crypto');

const securityV3Unstable = JSON.parse(
  fs
    .readFileSync(
      path.resolve(__dirname, '../../contexts/security-v3-unstable.jsonld')
    )
    .toString()
);

const credentialsV2 = JSON.parse(
  fs
    .readFileSync(
      path.resolve(__dirname, '../../contexts/credentials-v2-unstable.jsonld')
    )
    .toString()
);

const documentLoader = documentLoaderFactory.pluginFactory
  .build({
    contexts: {
      ...contexts.W3C_Decentralized_Identifiers,
      ...contexts.W3ID_Security_Vocabulary,
    },
  })
  .addContext({
    'https://www.w3.org/2018/credentials/v1': credentialsV2,
    'https://w3id.org/security/v3-unstable': securityV3Unstable,
  })
  .addResolver({
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
