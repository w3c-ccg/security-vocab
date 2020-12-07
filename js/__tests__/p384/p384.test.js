/* eslint-disable max-len */
const {
  JsonWebSignature,
  JsonWebKey,
} = require('@transmute/json-web-signature-2020');

const fs = require('fs');
const path = require('path');
const vcjs = require('@transmute/vc.js');

const didKeyFixture = require('../../__fixtures__/did-key-p384.json');

const vcld = vcjs.ld;

const k0 = didKeyFixture[0].keypair['application/did+json'];
k0.id = k0.controller + k0.id;

const credentialTemplate = require('../../__fixtures__/credentials/p384/credentialTemplate.json');
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

  if(url === 'https://w3id.org/security/v1') {
    return {
      documentUrl: url,
      document: JSON.parse(
        fs
          .readFileSync(
            path.resolve(
              __dirname,
              '../../../contexts/security-v1.jsonld'
            )
          )
          .toString()
      ),
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
              '../../../contexts/security-v2.jsonld'
            )
          )
          .toString()
      ),
    };
  }

  if(url === 'https://www.w3.org/ns/did/v1') {
    return {
      documentUrl: url,
      document: require('../../__fixtures__/contexts/did-v1.json'),
    };
  }

  if(
    url.indexOf(
      'did:key:zACHdsDxFYhAtvHaBEoQbRwjvfBmnMTojArVxjFdTYgyXsw11YiNqcwK1VkYuKj7P9YSoCzXYL1WX8Z1GAHYinztHn9z91oerTi1fp6pUGEr7BPJ562vSiL93NHJCM81JS8j19rT'
    ) === 0
  ) {
    const didDoc =
      didKeyFixture[0].resolution['application/did+json'].didDocument;

    return {
      documentUrl: url,
      document: didDoc,
    };
  }

  console.error(url);
  throw new Error('Unsupported context ' + url);
};

// this test is broken, JsonWebSignature2020
// suite needs to be updated.
describe('P384', () => {

  it('can issue and verify', async () => {
    const key = await JsonWebKey.from(k0);
    const suite = new JsonWebSignature({
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
      suite: new JsonWebSignature(),
      documentLoader,
    });

    expect(result.verified).toBe(true);
  });
});
