import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.mjs";
const realeatateSchema = new Schema(
  {
    img: { type: String },
    userid: { type: String, required: true }, // 이름,ID
    Type: { type: String, required: true }, // 방구조
    sale: { type: Number, required: true }, // 매매
    deposit: { type: Number, required: true }, // 보증금
    monthly_rent: { type: Number, required: true }, // 월세
    price_type: { type: String, required: true }, //거래유형
    extend: { type: Number, required: true }, // 평수
    floors: { type: Number, required: true }, // 층수
    condition: { type: [String] }, // 조건
    createdAt: { type: String, default: getCurrentTime },
  },
  { timestamps: true }
);

// model("객체명", 스키마, "컬렉션(테이블)명");
export default model("Realestate", realeatateSchema, "realestate");
