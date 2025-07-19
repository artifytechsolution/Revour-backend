import * as crypto from 'crypto';
class encryptPassword {
  static Encrypt(password: string) {
    const Salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto
      .pbkdf2Sync(password, Salt, 1000, 64, 'sha512')
      .toString('hex');
    return {
      password: hashedPassword,
      salt: Salt,
    };
  }
  static Decrypt(newPassword: string, oldPassword: String, oldSalt: string) {
    const hashedPassword = crypto
      .pbkdf2Sync(newPassword, oldSalt, 1000, 64, 'sha512')
      .toString('hex');
    if (hashedPassword === oldPassword) {
      return true;
    } else {
      return false;
    }
  }
}

export default encryptPassword;
