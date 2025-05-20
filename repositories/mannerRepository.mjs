import Manner from "../models/manner.mjs"; // 모델 가져오기

// 모든 사용자 가져오기
export async function getAll() {
  return await Manner.find();
}

// 사용자 생성
export async function createUser(data) {
  return await Manner.create(data);
}

// 사용자 조회 (아이디 기반)
export async function getUserById(userid) {
  return await Manner.findOne({ userid });
}

// 사용자 삭제 (아이디 기반)
export async function deleteUser(userid) {
  return await Manner.deleteOne({ userid });
}
