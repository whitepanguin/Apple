import { Schema, model } from "mongoose";

const placesSchema = new Schema(
  {
    userid: { type: String }, //닉네임
    postId: { type: Number }, //글id
    Latitude: { type: Number }, //위도
    Longitude: { type: Number }, //경도
  },
  { timestamps: true }
);

// model("객체명", 스키마, "컬렉션(테이블)명");
export default model("Place", placesSchema, "places");
