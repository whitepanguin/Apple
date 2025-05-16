// repositories/authRepository.js
import Realestate from "../models/realestateSchema.mjs";

// postId로 위치 찾기
export async function findByPostId(Id) {
  return Realestate.findOne({ Id });
}

// 위치 생성하기
export async function createRealestate(Data) {
  const realestate = new Realestate(Data);
  return realestate.save();
}

// id(idx)로 사용자 조회
export async function findrealestateid(id) {
  return Realestate.findById(id);
}

export async function getAllByUserid(userid) {
  return Realestate.find({ userid });
}

// 전체 장소 조회
export async function getAll() {
  return Realestate.find();
}
