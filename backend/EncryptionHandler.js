const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.SECRET;
const algorithm = "aes-256-ctr";

// Below here lies function to encrypt the password
const encrypt = (password) => {
  //Create a unique identifier
  const iv = Buffer.from(crypto.randomBytes(16));
  //Creates a cipher object
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);

  //Generate a encrypted password
  const encryptedPassword = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    password: encryptedPassword.toString("hex"),
  };
};

//Below here lies function for decryption
const decrypt = (encryptedPassword) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secret),
    Buffer.from(encryptedPassword.iv, "hex")
  );

  //Create the encrypted password back to original password
  const decryptedPassword = Buffer.concat([
    decipher.update(Buffer.from(encryptedPassword.password, "hex")),
    decipher.final(),
  ]);

  return decryptedPassword.toString();
};

module.exports = { encrypt, decrypt };
