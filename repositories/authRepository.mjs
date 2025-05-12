// repositories/authRepository.js
import User from "../models/userSchema.mjs";

// 사용자 조회 (userid → email 기반 가정)
export async function findByUserid(email) {
  return User.findOne({ email });
}

// 사용자 생성
export async function createUser(userData) {
  const user = new User(userData);
  return user.save();
}

// id(idx)로 사용자 조회
export async function findByid(id) {
  return User.findById(id);
}
