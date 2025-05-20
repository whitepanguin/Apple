import * as mannerRepository from "../repositories/mannerRepository.mjs";

//  전체 사용자 조회 (GET)
export async function getmanner(req, res) {
  try {
    const data = await mannerRepository.getAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "전체 사용자 조회 오류", error });
  }
}

//  사용자 조회 (GET)
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

//  사용자 조회 or 자동 생성 (GET)
export async function getOrCreateUserById(req, res) {
  try {
    const { userid } = req.params;
    let user = await mannerRepository.getUserById(userid);

    if (!user) {
      user = await mannerRepository.createUser({
        userid,
        address: "주소 미입력",
        profilepic: "",
        temp: 36.5,
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "사용자 조회 또는 생성 오류", error });
  }
}

//  사용자 생성 (POST)
export async function createUser(req, res) {
  try {
    const { userid, profilepic, address, temp } = req.body;

    if (!userid || !address || temp === undefined) {
      return res
        .status(400)
        .json({ message: "아이디와 주소, 온도를 입력하세요." });
    }

    const existing = await mannerRepository.getUserById(userid);
    if (existing) {
      return res.status(409).json({ message: "이미 존재하는 사용자입니다." });
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

// ✅ 사용자 삭제 (DELETE /api/manner/:userid)
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
