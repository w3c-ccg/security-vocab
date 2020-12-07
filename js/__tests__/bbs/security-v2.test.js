/* eslint-disable max-len */
const {
  Bls12381G2KeyPair,
  BbsBlsSignature2020
} = require('@mattrglobal/jsonld-signatures-bbs');

const jsigs = require('jsonld-signatures');
const { AssertionProofPurpose } = jsigs.purposes;

const fs = require('fs');
const path = require('path');

const didKeyFixture = require('../../__fixtures__/did-key-bls12381.json');

const k0 = didKeyFixture[0].g2['application/did+ld+json'];
k0.id = k0.controller + k0.id;

const documentLoader = url => {

  // notice that both are required because of the suite
  if(url === 'https://w3id.org/security/v3-unstable') {
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

  if(url === 'https://www.w3.org/ns/did/v1') {
    return {
      documentUrl: url,
      document: require('../../__fixtures__/contexts/did-v1.json'),
    };
  }

  if(
    url.indexOf(
      'did:key:z5TcESXuYUE9aZWYwSdrUEGK1HNQFHyTt4aVpaCTVZcDXQmUheFwfNZmRksaAbBneNm5KyE52SdJeRCN1g6PJmF31GsHWwFiqUDujvasK3wTiDr3vvkYwEJHt7H5RGEKYEp1ErtQtcEBgsgY2DA9JZkHj1J9HZ8MRDTguAhoFtR4aTBQhgnkP4SwVbxDYMEZoF2TMYn3s'
    ) === 0
  ) {
    const didDoc =
      didKeyFixture[0].resolution['application/did+ld+json'].didDocument;

    return {
      documentUrl: url,
      document: didDoc,
    };
  }

  console.error(url);
  throw new Error('Unsupported context ' + url);
};

it('can sign and verify', async () => {
  const key = await Bls12381G2KeyPair.from(k0);
  const suite = new BbsBlsSignature2020({
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
    suite: new BbsBlsSignature2020(),
    purpose: new AssertionProofPurpose()
  });

  expect(result.verified).toBe(true); 
});
