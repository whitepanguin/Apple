import post from "../models/postSchema.js";

//전체 글 불러오기
export async function getAll() {
  return await post.find().sort({ createdAt: -1 });
}

// 특정 유저(_id)의 글 불러오기
export async function getAllByUserid(userid) {
  return await post.find({ userid }).sort({ createdAt: -1 });
}

// id를 받아 하나의 포스트 가져오기
export async function getById(id) {
  return await post.findById(id);
}

// 새로운 글 작성
export async function createPost({
  text,
  userid,
  tittle,
  img,
  category,
  price,
}) {
  return await post.create({ text, userid, tittle, img, category, price });
}

// 수정하기
export async function update(id, updateFields) {
  return await post.findByIdAndUpdate(id, updateFields, { new: true });
}

// 삭제하기
export async function remove(id) {
  return await post.findByIdAndDelete(id);
}
