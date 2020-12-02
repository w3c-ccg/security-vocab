const {
  JsonWebSignature,
  JsonWebKey,
} = require('@transmute/json-web-signature-2020');
const {Ed25519KeyPair} = require('@transmute/did-key-ed25519');
const {Ed25519Signature2018} = require('@transmute/ed25519-signature-2018');
const {documentLoader} = require('../__fixtures__/documentLoader');

const jsigs = require('jsonld-signatures');
const {AssertionProofPurpose} = jsigs.purposes;

const doc = {
  '@context': [
    'https://w3id.org/security/v3-unstable',
    {
      schema: 'http://schema.org/',
      name: 'schema:name',
      homepage: 'schema:url',
      image: 'schema:image',
    },
  ],
  name: 'Manu Sporny',
  homepage: 'https://manu.sporny.org/',
  image: 'https://manu.sporny.org/images/manu.png',
};

it('can sign / verify with JsonWebSignature2020', async () => {
  const key = await JsonWebKey.from(
    require('../__fixtures__/did-key-p384.json')
  );
  const signed = await jsigs.sign(
    {...doc},
    {
      suite: new JsonWebSignature({
        key,
      }),
      documentLoader,
      purpose: new AssertionProofPurpose(),
    }
  );
  const result = await jsigs.verify(signed, {
    documentLoader,
    suite: new JsonWebSignature(),
    purpose: new AssertionProofPurpose(),
  });
  expect(result.verified).toBe(true);
  expect(signed.proof.type).toBe('JsonWebSignature2020');
});

it.skip('can sign / verify with Ed25519Signature2018', async () => {
  const key = await Ed25519KeyPair.from(
    require('../__fixtures__/did-key-ed25519.json')
  );
  // this test fails, because
  // security-v2 defines protected terms, and security-v3 attempts
  // to redefine them.
  // this can only be resolved by upgrading the jsonld-signatures
  // library to support
  // security-v3 or by only defining new terms in security-v3
  // (which we don't want to do).

  const signed = await jsigs.sign(
    {...doc},
    {
      suite: new Ed25519Signature2018({
        key,
      }),
      documentLoader,
      purpose: new AssertionProofPurpose(),
    }
  );
  const result = await jsigs.verify(signed, {
    documentLoader,
    suite: new Ed25519Signature2018(),
    purpose: new AssertionProofPurpose(),
  });
  expect(result.verified).toBe(true);
  expect(signed.proof.type).toBe('Ed25519Signature2018');
});
