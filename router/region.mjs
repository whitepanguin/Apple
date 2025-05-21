import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/**
 * 📌 `/region` 경로에서 카카오 API를 사용해 지역 정보를 가져옴
 * @param {number} lat - 위도
 * @param {number} lon - 경도
 * @returns {string} - 지역명 또는 오류 메시지
 */
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  // 📌 입력값 검증 (위도와 경도 값이 없을 경우 오류 반환)
  if (!lat || !lon) {
    return res.status(400).json({ error: "위도와 경도를 제공해야 합니다." });
  }

  try {
    // 🛰️ 카카오 API 요청 URL 생성
    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`;
    console.log("카카오 API 요청 URL:", url);

    // 📌 카카오 API에 요청
    const kakaoRes = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`, // 환경 변수에서 API 키 로드
      },
    });

    // 📌 응답 검증
    if (!kakaoRes.ok) {
      console.error("카카오 응답 실패 상태코드:", kakaoRes.status);
      return res
        .status(kakaoRes.status)
        .json({ error: "카카오 API 응답 오류" });
    }

    // 📌 응답 데이터 JSON 변환
    const data = await kakaoRes.json();
    console.log("카카오 API 응답 데이터:", data);

    // 📌 지역 데이터 검증
    const regionData = data.documents?.[0];
    if (!regionData) {
      return res.status(404).json({ error: "지역 정보를 찾을 수 없습니다." });
    }

    // 📌 지역명을 클라이언트에 반환
    res.json({
      regionName: `${regionData.region_1depth_name} ${regionData.region_2depth_name}`,
    });
  } catch (err) {
    console.error("카카오 API 요청 중 오류 발생:", err);
    res
      .status(500)
      .json({ error: "카카오 API 요청 실패", detail: err.message });
  }
});

export default router;
