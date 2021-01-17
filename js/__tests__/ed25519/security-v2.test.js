/* eslint-disable max-len */
const {Ed25519KeyPair} = require('@transmute/did-key-ed25519');
const {Ed25519Signature2018} = require('@transmute/ed25519-signature-2018');
const jsigs = require('jsonld-signatures');

const {AssertionProofPurpose} = jsigs.purposes;

const {documentLoader} = require('../../__fixtures__/documentLoader');

it('can sign and verify', async () => {
  const key = await Ed25519KeyPair.from(require('../../__fixtures__/keys/ed25519.json'));
  const suite = new Ed25519Signature2018({
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
    suite: new Ed25519Signature2018(),
    purpose: new AssertionProofPurpose()
  });

  expect(result.verified).toBe(true);
});
