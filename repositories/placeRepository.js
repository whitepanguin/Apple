// repositories/authRepository.js
import Place from "../models/placesSchema.js";

// postId로 위치 찾기
export async function findByPostId(postId) {
  return Place.findOne({ postId });
}

// 위치 생성하기
export async function createPlace(placeData) {
  const place = new Place(placeData);
  return place.save();
}

// id(idx)로 사용자 조회
export async function findPlaceid(id) {
  return Place.findPlaceid(id);
}
