import { config } from "../config.mjs";
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  const kakaoUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`;
  console.log("Kakao API 요청:", kakaoUrl);

  const kakaoRes = await fetch(kakaoUrl, {
    headers: {
      Authorization: `KakaoAK ${config.kakao.restApiKey}`, // ✅ 띄어쓰기 꼭!
    },
  });

  console.log("카카오 응답 상태:", kakaoRes.status); // ✅ 여기에 401이면 키 문제

  if (!kakaoRes.ok) {
    return res.status(kakaoRes.status).json({ error: "카카오 API 응답 오류" });
  }

  const data = await kakaoRes.json();
  res.json(data);
});
export default router;
