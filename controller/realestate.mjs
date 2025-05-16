// controllers/placeController.js
import * as realestateRepository from "../repositories/realestateRepository.mjs";

// POST /places - 새로운 부동산 매물 등록
export async function createReal(req, res) {
  try {
    const placeData = req.body;
    const newPlace = await realestateRepository.createRealestate(placeData);
    res.status(201).json(newPlace);
  } catch (error) {
    console.error("매물 생성 중 오류 발생:", error);
    res.status(500).json({ message: "매물 생성에 실패했습니다." });
  }
}

// GET /places - 전체 매물 조회
export async function getAllReals(req, res) {
  try {
    const data = await realestateRepository.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("매물 목록 조회 중 오류:", error);
    res.status(500).json({ message: "매물 목록을 불러오지 못했습니다." });
  }
}

// GET /places/:id - 특정 매물 조회 (by ID)
export async function getRealById(req, res) {
  try {
    const { id } = req.params;
    const place = await realestateRepository.findById(id);
    if (!place) {
      return res
        .status(404)
        .json({ message: "해당 ID의 매물을 찾을 수 없습니다." });
    }
    res.status(200).json(place);
  } catch (error) {
    console.error("ID로 매물 조회 중 오류 발생:", error);
    res.status(500).json({ message: "매물 조회에 실패했습니다." });
  }
}

// GET /places/post/:postId - Post의 ID로 매물 조회
export async function getRealByPostId(req, res) {
  try {
    const { postId } = req.params;
    const place = await realestateRepository.findById(postId);
    if (!place) {
      return res
        .status(404)
        .json({ message: "해당 Post ID의 매물을 찾을 수 없습니다." });
    }
    res.status(200).json(place);
  } catch (error) {
    console.error("Post ID로 매물 조회 중 오류 발생:", error);
    res.status(500).json({ message: "Post ID로 매물 조회에 실패했습니다." });
  }
}
