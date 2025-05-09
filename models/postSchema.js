import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.js";
const postSchema = new Schema(
  {
    img: { type: String, required: true }, // 사진
    tittle: { type: String, required: true }, // 글 제목
    category: { type: String, required: true }, // 글 카테고리
    price: { type: Number, required: true }, // 가격
    userid: { type: String, required: true }, // 이름,ID
    text: { type: String, required: true }, // 글 내용
    createdAt: { type: String, default: getCurrentTime },
  },
  { timestamps: true }
);

// model("객체명", 스키마, "컬렉션(테이블)명");
export default model("Post", postSchema, "posts");
