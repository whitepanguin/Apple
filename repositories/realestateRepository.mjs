// repositories/authRepository.js
import Realestate from "../models/realestateSchema.mjs";

// ID(_id)로 부동산 정보 찾기
export async function findById(id) {
  return Realestate.findById(id);
}

// 부동산 정보 생성
export async function createRealestate(data) {
  const realestate = new Realestate(data);
  return realestate.save();
}

// 전체 부동산 정보 가져오기
export async function getAll() {
  return Realestate.find();
}
