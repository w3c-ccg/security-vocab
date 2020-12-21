/* eslint-disable max-len */
const {Ed25519KeyPair} = require('@transmute/did-key-ed25519');
const {Ed25519Signature2018} = require('@transmute/ed25519-signature-2018');

const vcjs = require('@transmute/vc.js');

const {documentLoader} = require('../../__fixtures__/documentLoader');
const vcld = vcjs.ld;

const credentialTemplate = require('../../__fixtures__/credentials/ed25519/credentialTemplate.json');
let verifiableCredential;

it('can issue and verify', async () => {
  const key = await Ed25519KeyPair.from(
    require('../../__fixtures__/keys/ed25519.json')
  );
  const suite = new Ed25519Signature2018({
    key,
  });

  verifiableCredential = await vcld.issue({
    credential: {
      ...credentialTemplate,
      issuer: {
        id: key.controller,
      },
      credentialSubject: {
        ...credentialTemplate.credentialSubject,
        id: key.controller,
      },
    },
    suite,
    documentLoader,
  });

  const result = await vcld.verifyCredential({
    credential: verifiableCredential,
    suite: new Ed25519Signature2018(),
    documentLoader,
  });
  expect(result.verified).toBe(true);
});
