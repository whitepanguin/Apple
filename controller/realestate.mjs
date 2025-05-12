// controllers/placeController.js
import * as realestateRepository from "../repositories/realestateRepository.js";

// /places - 새로운 장소 생성
export async function createReal(req, res) {
  try {
    const placeData = req.body;
    const newPlace = await realestateRepository.createRealestate(placeData);
    res.status(201).json(newPlace);
  } catch (error) {
    console.error("장소 생성 중 오류 발생:", error);
    res.status(500).json({ message: "장소 생성에 실패했습니다." });
  }
}

export async function getRealByPostId(req, res, next) {
  try {
    const userid = req.query.userid;
    const data = await (userid
      ? realestateRepository.getAllByUserid(userid)
      : realestateRepository.getAll());
    res.status(200).json(data);
  } catch (error) {
    console.error("장소 목록 조회 중 오류:", error);
    res.status(500).json({ message: "장소 목록을 불러오지 못했습니다." });
  }
}

// GET /places/:id - id(idx)로 장소 조회
export async function getRealById(req, res) {
  try {
    const { id } = req.params;
    const place = await realestateRepository.findrealestateid(id);
    if (!place) {
      return res
        .status(404)
        .json({ message: "해당 id의 장소를 찾을 수 없습니다." });
    }
    res.status(200).json(place);
  } catch (error) {
    console.error("ID로 장소 조회 중 오류 발생:", error);
    res.status(500).json({ message: "장소 조회에 실패했습니다." });
  }
}
