/* eslint-disable max-len */
const {
  Bls12381G2KeyPair,
  BbsBlsSignature2020
} = require('@mattrglobal/jsonld-signatures-bbs');

const jsigs = require('jsonld-signatures');
const {AssertionProofPurpose} = jsigs.purposes;

const {documentLoader} = require('../../__fixtures__/documentLoader');

it('can sign and verify', async () => {
  const key = await Bls12381G2KeyPair.from(require('../../__fixtures__/keys/bls12381-g2.json'));
  const suite = new BbsBlsSignature2020({
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
    suite: new BbsBlsSignature2020(),
    purpose: new AssertionProofPurpose()
  });

  expect(result.verified).toBe(true);
});
