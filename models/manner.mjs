import { Schema, model } from "mongoose";

const mannersSchema = new Schema({
  userid: { type: String, required: true, unique: true }, // 닉네임
  profilepic: { type: String }, // 프로필 사진
  address: { type: String, required: true }, // 주소
  temp: { type: Number, required: true, default: 36.5, min: 0 }, // 온도
});

// model("객체명", 스키마, "컬렉션(테이블)명");

export default model("Manner", mannersSchema, "manners");
