import dotenv from "dotenv";

dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`키는 ${key}는 undefined!!`);
  }
  return value;
}
// 앞 값을 주고, 앞에 값이 없으면 defaultValue값을 준다
// expiresInSec뒤에 86400은 값이 없으면 하루를 기본값으로 준다

export const config = {
  jwt: {
    secretKey: required("JWT_SECRET"),
    expiresInSec: parseInt(required("JWT_EXPIRES_SEC", 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 10)),
  },
  host: {
    port: parseInt(required("HOST_PORT", 8080)),
  },
  db: {
    host: required("DB_HOST"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    database: required("DB_DATABASE"),
    port: parseInt(required("DB_PORT", 3306)),
  },
  mongodb: {
    url: required("MONGODB"),
  },
};
