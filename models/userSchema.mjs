import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.mjs";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true }, //이메일
    password: { type: String }, //비밀번호
    name: { type: String }, //이름
    userid: { type: String }, //닉네임
    birthDate: { type: Number }, //생일
    address: { type: String }, //주소
    profile: { type: String, default: "" }, //프로필
    hp: { type: String }, // 핸드폰 번호 추가
    provider: { type: String },
    createdAt: { type: String, default: getCurrentTime },
    updatedAt: { type: String, default: getCurrentTime },
  },
  { timestamps: true }
);

// model("객체명", 스키마, "컬렉션(테이블)명");
export default model("User", userSchema, "users");
