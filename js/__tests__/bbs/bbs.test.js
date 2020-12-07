/* eslint-disable max-len */
const {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof,
} = require('@mattrglobal/jsonld-signatures-bbs');

const fs = require('fs');
const path = require('path');
const vcjs = require('@transmute/vc.js');

const vcld = vcjs.ld;

const didKeyFixture = require('../../__fixtures__/did-key-bls12381.json');

const k0 = didKeyFixture[0].g2['application/did+ld+json'];
k0.id = k0.controller + k0.id;

const credentialTemplate = require('../../__fixtures__/credentials/bbs/credentialTemplate.json');
let verifiableCredential;

const documentLoader = url => {

  if(url === 'https://www.w3.org/2018/credentials/v2') {
    return {
      documentUrl: url,
      document: require('../../__fixtures__/contexts/credentials-v2-unstable.json'),
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

  // This won't be necessary soon
  // see https://github.com/mattrglobal/jsonld-signatures-bbs/issues/93
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

  if(url === 'https://www.w3.org/ns/did/v1') {
    return {
      documentUrl: url,
      document: require('../../__fixtures__/contexts/did-v1.json'),
    };
  }

  if(url === 'https://w3id.org/citizenship/v1') {
    return {
      documentUrl: url,
      document: require('../../__fixtures__/contexts/citizenship-v1.json'),
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

  throw new Error('Unsupported context ' + url);
};

describe('BBS', () => {

  it('can issue, verify', async () => {
    const keyPair = await new Bls12381G2KeyPair(k0);
    const suite = new BbsBlsSignature2020({key: keyPair, date: credentialTemplate.issuanceDate});
    suite.date = credentialTemplate.issuanceDate;
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

    const credentialVerified = await vcld.verifyCredential({
      credential: {...verifiableCredential},
      suite: new BbsBlsSignature2020({}),
      documentLoader,
    });

    expect(credentialVerified.verified).toBe(true);
  });

  it('can derive, present', async () => {
    //Derive a proof
    const deriveProofFrame = require('../../__fixtures__/credentials/bbs/deriveProofFrame.json');
    const derivedProofCredential = await deriveProof(
      verifiableCredential,
      deriveProofFrame,
      {
        suite: new BbsBlsSignatureProof2020(),
        documentLoader,
      }
    );
    // console.log(JSON.stringify(derivedProofCredential, null, 2))
    const credentialVerified = await vcld.verifyCredential({
      credential: {...derivedProofCredential},
      suite: new BbsBlsSignatureProof2020({}),
      documentLoader,
    });
    // console.log(JSON.stringify(credentialVerified, null, 2))
    expect(credentialVerified.verified).toBe(true);
  });

});
