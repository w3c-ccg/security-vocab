/* eslint-disable max-len */
const {
  JsonWebSignature,
  JsonWebKey,
} = require('@transmute/json-web-signature-2020');

const vcjs = require('@transmute/vc.js');

const {documentLoader} = require('../../__fixtures__/documentLoader');

const vcld = vcjs.ld;

const credentialTemplate = require('../../__fixtures__/credentials/p384/credentialTemplate.json');
let verifiableCredential;

describe('P384', () => {
  it('can issue and verify', async () => {
    const key = await JsonWebKey.from(require('../../__fixtures__/keys/p384.json'));
    const suite = new JsonWebSignature({
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
      documentLoader
    });

    const result = await vcld.verifyCredential({
      credential: verifiableCredential,
      suite: new JsonWebSignature(),
      documentLoader,
    });
    // console.log(JSON.stringify(verifiableCredential, null, 2))
    expect(result.verified).toBe(true);
  });
});
