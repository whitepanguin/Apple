import * as mannerRepository from "../repositories/mannerRepository.mjs";

// 사용자 생성 (POST 요청)
export async function createUser(req, res, next) {
  try {
    const { userid, profilepic, address, temp } = req.body;

    if (!userid || !address || temp === undefined) {
      return res
        .status(400)
        .json({ message: "아이디와 주소, 온도를 입력하세요." });
    }

    const newUser = await mannerRepository.createUser({
      userid,
      profilepic,
      address,
      temp,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "사용자 생성 오류", error });
  }
}

// 사용자 조회 (아이디 기반 GET 요청)
export async function getUserById(req, res) {
  try {
    const { userid } = req.params;
    const user = await mannerRepository.getUserById(userid);

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "사용자 조회 오류", error });
  }
}

// 사용자 삭제 (아이디 기반 DELETE 요청)
export async function deleteUser(req, res) {
  try {
    const { userid } = req.params;
    const result = await mannerRepository.deleteUser(userid);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({ message: "사용자 삭제 완료" });
  } catch (error) {
    res.status(500).json({ message: "사용자 삭제 오류", error });
  }
}
