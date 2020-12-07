/* eslint-disable max-len */
const {Ed25519KeyPair} = require('@transmute/did-key-ed25519');
const {Ed25519Signature2018} = require('@transmute/ed25519-signature-2018');
const jsigs = require('jsonld-signatures');

const fs = require('fs');
const path = require('path');
const { AssertionProofPurpose } = jsigs.purposes;

const didKeyFixture = require('../../__fixtures__/did-key-ed25519.json');
const k0 = didKeyFixture[0].keypair['application/did+ld+json'];
k0.id = k0.controller + k0.id;


const documentLoader = url => {
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

it('can sign and verify', async () => {
  const key = await Ed25519KeyPair.from(k0);
  const suite = new Ed25519Signature2018({
    key,
  });

  const signedDocument = await jsigs.sign(
    {
        '@context': {
          schema: 'http://schema.org/',
          name: 'schema:name',
          homepage: 'schema:url',
        },
        name: 'Orie Steele',
        homepage: 'https://en.wikipedia.org/wiki/Orie_Steele',
      },
    {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader,
    }
  );

  const result = await jsigs.verify(signedDocument, {
    documentLoader,
    suite: new Ed25519Signature2018(),
    purpose: new AssertionProofPurpose()
  });

  expect(result.verified).toBe(true); 
});
