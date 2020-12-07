/* eslint-disable max-len */
const {
  JsonWebSignature,
  JsonWebKey,
} = require('@transmute/json-web-signature-2020');

const jsigs = require('jsonld-signatures');
const { AssertionProofPurpose } = jsigs.purposes;

const fs = require('fs');
const path = require('path');

const didKeyFixture = require('../../__fixtures__/did-key-p384.json');
const k0 = didKeyFixture[0].keypair['application/did+json'];
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
  if(url.indexOf('did:key:zACHdsDxFYhAtvHaBEoQbRwjvfBmnMTojArVxjFdTYgyXsw11YiNqcwK1VkYuKj7P9YSoCzXYL1WX8Z1GAHYinztHn9z91oerTi1fp6pUGEr7BPJ562vSiL93NHJCM81JS8j19rT') === 0) {
    return {
      documentUrl: url,
      document: didKeyFixture[0].resolution['application/did+json'].didDocument,
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
  const key = await JsonWebKey.from(k0);
  const suite = new JsonWebSignature({
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
    suite: new JsonWebSignature(),
    purpose: new AssertionProofPurpose()
  });

  expect(result.verified).toBe(true); 
});
