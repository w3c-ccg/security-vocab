/* eslint-disable max-len */
const {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof,
} = require('@mattrglobal/jsonld-signatures-bbs');

const vcjs = require('@transmute/vc.js');

const vcld = vcjs.ld;

const credentialTemplate = require('../../__fixtures__/credentials/bls12381-g2/credentialTemplate.json');
let verifiableCredential;
const {documentLoader} = require('../../__fixtures__/documentLoader');

describe('BBS', () => {
  it('can issue, verify', async () => {
    const key = await Bls12381G2KeyPair.from(
      require('../../__fixtures__/keys/bls12381-g2.json')
    );
    const suite = new BbsBlsSignature2020({
      key,
      date: credentialTemplate.issuanceDate,
    });
    suite.date = credentialTemplate.issuanceDate;
    verifiableCredential = await vcld.issue({
      credential: {
        ...credentialTemplate,
        issuer: {
          id: key.controller,
        },
        credentialSubject: {
          ...credentialTemplate.credentialSubject,
          id: key.id,
        },
      },
      suite,
      documentLoader,
    });

    const credentialVerified = await vcld.verifyCredential({
      credential: {...verifiableCredential},
      suite: new BbsBlsSignature2020({}),
      documentLoader,
    });
    expect(credentialVerified.verified).toBe(true);
  });

  it('can derive, present', async () => {
    const deriveProofFrame = require('../../__fixtures__/credentials/bls12381-g2/deriveProofFrame.json');
    const derivedProofCredential = await deriveProof(
      verifiableCredential,
      deriveProofFrame,
      {
        suite: new BbsBlsSignatureProof2020(),
        documentLoader,
      }
    );
    const credentialVerified = await vcld.verifyCredential({
      credential: {...derivedProofCredential},
      suite: new BbsBlsSignatureProof2020({}),
      documentLoader,
    });
    expect(credentialVerified.verified).toBe(true);
  });
});
