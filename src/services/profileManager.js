const fs = require('fs').promises;
const path = require('path');
const { faker } = require('@faker-js/faker');
const { FingerprintGenerator } = require('fingerprint-generator');

async function createProfileFileSystem(profileId) {
  const profileDir = path.join(__dirname, '..', '..', 'data', 'profiles', profileId);
  await fs.mkdir(profileDir, { recursive: true });

  // Generate fingerprint
  const fingerprintGenerator = new FingerprintGenerator({
    devices: ['desktop'],
    operatingSystems: ['windows'],
    browsers: ['chrome'],
  });
  const fingerprint = fingerprintGenerator.getFingerprint();
  await fs.writeFile(path.join(profileDir, 'fingerprint.json'), JSON.stringify(fingerprint, null, 2));

  // Generate identity
  const identity = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      zipCode: faker.address.zipCode(),
    },
  };
  await fs.writeFile(path.join(profileDir, 'identity.json'), JSON.stringify(identity, null, 2));

  // Create empty state file
  await fs.writeFile(path.join(profileDir, 'state.json'), JSON.stringify({}));

  return profileDir;
}

module.exports = {
  createProfileFileSystem,
};
