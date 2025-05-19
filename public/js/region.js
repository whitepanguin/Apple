const KAKAO_REST_API_KEY = "8a25aeba764fd1a8e820b3be0d71b686"; // 📌 REST API 키 입력
const BASE_URL = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json";

export async function fetchKakaoLocation(lat, lon) {
  try {
    const res = await fetch(`${BASE_URL}?x=${lon}&y=${lat}`, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.documents || data.documents.length === 0) {
      return "위치 정보 없음";
    }

    return data.documents[0].region_2depth_name || "위치 정보 없음";
  } catch (err) {
    console.error("지역명 가져오기 오류:", err.message);
    return "지역 정보 오류";
  }
}
