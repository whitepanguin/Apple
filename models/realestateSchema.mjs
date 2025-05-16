import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.mjs";

const realestateSchema = new Schema(
  {
    sale_date: { type: String, required: true }, // 예: "10일 전"
    sales_status: { type: String, required: true }, // 예: "판매중"
    apartment: { type: String, required: true }, // 예: "강남파라곤아파트"
    building_usage: { type: String, required: true }, // 예: "아파트"
    supply_area: { type: String, required: true }, // 예: "143m² (43.26평)"
    exclusive_area: { type: String, required: true }, // 예: "120m² (36.30평)"
    number_of_rooms: { type: String, required: true }, // 예: "방 3개"
    floor: { type: String, required: true }, // 예: "11층"
    maintenance_fee: { type: String }, // 예: "45만원"
    approved_date: { type: String }, // 예: "2007년"
    condition: {
      loan_available: { type: Boolean, default: false },
      pet_allowed: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      elevator: { type: Boolean, default: false },
    },
    internal_facilities: { type: String }, // 예: "에어컨, 거실뷰"
    price: { type: String, required: true }, // 예: "매매"
    sale: { type: String }, // 예: "27억"
    deposit: { type: String }, // null 가능
    monthly_rent: { type: String }, // null 가능
    details: [{ type: String }], // 상세 설명 리스트
    createdAt: { type: String, default: getCurrentTime },
  },
  { timestamps: true }
);

export default model("Realestate", realestateSchema, "realestate");
