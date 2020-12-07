/* eslint-disable max-len */
const {Ed25519KeyPair} = require('@transmute/did-key-ed25519');
const {Ed25519Signature2018} = require('@transmute/ed25519-signature-2018');

const fs = require('fs');
const path = require('path');

const vcjs = require('@transmute/vc.js');

const didKeyFixture = require('../../__fixtures__/did-key-ed25519.json');

const vcld = vcjs.ld;

const k0 = didKeyFixture[0].keypair['application/did+ld+json'];
k0.id = k0.controller + k0.id;

const credentialTemplate = require('../../__fixtures__/credentials/ed25519/credentialTemplate.json');
let verifiableCredential;

const documentLoader = url => {
  if(url === 'https://www.w3.org/2018/credentials/v2') {
    return {
      documentUrl: url,
      document: require('../../__fixtures__/contexts/credentials-v2-unstable.json'),
    };
  }

  if(url === 'https://www.w3.org/ns/odrl.jsonld') {
    return {
      documentUrl: url,
      document: require('../../__fixtures__/contexts/odrl.json'),
    };
  }

  if(url === 'https://www.w3.org/2018/credentials/examples/v1') {
    return {
      documentUrl: url,
      document: require('../../__fixtures__/contexts/example-v1.json'),
    };
  }

  if(url === 'https://w3id.org/security/v2') {
    return {
      documentUrl: url,
      document: JSON.parse(
        fs
          .readFileSync(
            path.resolve(
              __dirname,
              '../../../contexts/security-v3-unstable.jsonld'
            )
          )
          .toString()
      ),
    };
  }
  if(url === 'https://w3id.org/citizenship/v1') {
    return {
      documentUrl: url,
      document: require('../../__fixtures__/contexts/citizenship-v1.json'),
    };
  }

  if(url.indexOf('did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL') === 0) {
    return {
      documentUrl: url,
      document: didKeyFixture[0].resolution['application/did+ld+json'].didDocument,
    };
  }

  if(url === 'https://www.w3.org/ns/did/v1') {
    return {
      documentUrl: url,
      document: require('../../__fixtures__/contexts/did-v1.json'),
    };
  }
  console.error(url);
  throw new Error('Unsupported context ' + url);
};

it('can issue and verify', async () => {
  const key = await Ed25519KeyPair.from(k0);
  const suite = new Ed25519Signature2018({
    key,
  });

  verifiableCredential = await vcld.issue({
    credential: {
      ...credentialTemplate,
      issuer: {
        id: k0.controller,
      },
      credentialSubject: {
        ...credentialTemplate.credentialSubject,
        id: k0.id,
      },
    },
    suite,
    documentLoader
  });

  const result = await vcld.verifyCredential({
    credential: verifiableCredential,
    suite: new Ed25519Signature2018(),
    documentLoader,
  });

  // console.log(JSON.stringify(verifiableCredential, null, 2))
  expect(result.verified).toBe(true);
});
