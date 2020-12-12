/* eslint-disable max-len */
const {
  JsonWebSignature,
  JsonWebKey,
} = require('@transmute/json-web-signature-2020');

const jsigs = require('jsonld-signatures');
const {AssertionProofPurpose} = jsigs.purposes;

const {documentLoader} = require('../../__fixtures__/documentLoader');

it('can sign and verify', async () => {
  const key = await JsonWebKey.from(require('../../__fixtures__/keys/p384.json'));
  const suite = new JsonWebSignature({
    key,
  });

  const signedDocument = await jsigs.sign(
    {
      '@context': ['https://w3id.org/security/v3-unstable', {
        schema: 'http://schema.org/',
        name: 'schema:name',
        homepage: 'schema:url',
      }],
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
