import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/**
 * @swagger
 * /region:
 *   get:
 *     summary: 위도(lat)와 경도(lon)를 이용한 지역명 조회 (카카오 API 사용)
 *     tags: [Region]
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: true
 *         description: 위도 값
 *         schema:
 *           type: number
 *           example: 37.5665
 *       - name: lon
 *         in: query
 *         required: true
 *         description: 경도 값
 *         schema:
 *           type: number
 *           example: 126.9780
 *     responses:
 *       200:
 *         description: 지역명 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 regionName:
 *                   type: string
 *                   example: "서울특별시 중구"
 *       400:
 *         description: 위도 또는 경도가 빠졌을 때 오류
 *       404:
 *         description: 지역 정보를 찾을 수 없을 때
 *       500:
 *         description: 카카오 API 요청 실패
 */
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "위도와 경도를 제공해야 합니다." });
  }

  try {
    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`;
    console.log("카카오 API 요청 URL:", url);

    const kakaoRes = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    });

    if (!kakaoRes.ok) {
      console.error("카카오 응답 실패 상태코드:", kakaoRes.status);
      return res
        .status(kakaoRes.status)
        .json({ error: "카카오 API 응답 오류" });
    }

    const data = await kakaoRes.json();
    console.log("카카오 API 응답 데이터:", data);

    const regionData = data.documents?.[0];
    if (!regionData) {
      return res.status(404).json({ error: "지역 정보를 찾을 수 없습니다." });
    }

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
