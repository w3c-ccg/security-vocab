const {
  JsonWebSignature,
  JsonWebKey,
} = require('@transmute/json-web-signature-2020');

const vcjs = require('@transmute/vc.js');
const {documentLoader} = require('../__fixtures__/documentLoader');
const keyJson = require('../__fixtures__/did-key-p384.json');

it('can issue / verify with JsonWebSignature2020', async () => {
  const key = await JsonWebKey.from(keyJson);
  const verifiableCredential = await vcjs.ld.issue({
    credential: {
      // in this case, the document loader is
      // https://www.w3.org/2018/credentials/v1 ->
      // https://www.w3.org/2018/credentials/v2
      // note that vc-js does not allow the context to be changed,
      // its hard coded...
      // so this is the best we can do to test credentials-v2
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'https://example.com/123',
      type: ['VerifiableCredential'],
      issuer: {
        id: key.controller,
      },
      issuanceDate: '2020-03-10T04:24:12.164Z',
      expirationDate: '2029-03-10T04:24:12.164Z',
      credentialSubject: {
        id: 'did:example:123',
      },
    },
    suite: new JsonWebSignature({
      key,
    }),
    documentLoader,
  });
  const result = await vcjs.ld.verifyCredential({
    credential: verifiableCredential,
    suite: new JsonWebSignature(),
    documentLoader,
  });
  expect(result.verified).toBe(true);
});
