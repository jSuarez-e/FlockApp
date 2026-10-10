const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

console.log("Public Key Generated");

const plainText = "DKg@020487";

// Simulate frontend encrypt (JSEncrypt uses PKCS1)
const buffer = Buffer.from(plainText, 'utf8');
const encrypted = crypto.publicEncrypt(
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  },
  buffer
);

const encryptedBase64 = encrypted.toString('base64');
console.log("Encrypted:", encryptedBase64);

// Simulate backend decrypt
try {
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(encryptedBase64, 'base64')
  );
  console.log("Decrypted successfully:", decryptedBuffer.toString('utf8'));
} catch (e) {
  console.error("Decryption failed:", e);
}
