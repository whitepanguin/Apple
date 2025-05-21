// controller/auth.mjs
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
import * as authRepository from "../repositories/authRepository.mjs";

const secretKey = config.jwt.secretKey;
const bcryptSaltRounds = config.bcrypt.saltRounds;
const jwtExpiresInDays = config.jwt.expiresInSec;

async function createJwtToken(idx) {
  return jwt.sign({ idx }, secretKey, { expiresIn: jwtExpiresInDays });
}

export async function signup(req, res, next) {
  const { email, password, name, userid, birthDate, address, profile, hp } = req.body;

  const found = await authRepository.findByUserid(email);
  if (found) {
    return res.status(409).json({ message: `${email}은(는) 이미 사용 중입니다.` });
  }

  const hashed = await bcrypt.hash(password, bcryptSaltRounds);

  const user = await authRepository.createUser({
    email,
    password: hashed,
    name,
    userid,
    birthDate,
    address,
    profile,
    hp,
  });

  const token = await createJwtToken(user._id);
  res.status(201).json({ token, email });
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await authRepository.findByUserid(email);
  if (!user) {
    return res.status(404).json({ message: `${email} 계정을 찾을 수 없습니다.` });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
  }

  const token = await createJwtToken(user._id);
  res.status(200).json({ token, email });
}

export async function me(req, res, next) {
  try {
    const userId = req.useridx || req.userid || req.id;
    const user = await authRepository.findByid(userId);
    if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

    res.status(200).json({
      email: user.email,
      userid: user.userid,
      profile: user.profile,
    });
  } catch (error) {
    res.status(500).json({ message: "서버 오류", error: error.message });
  }
}

// 🔹 프로필 변경 전용 핸들러
export async function updateProfile(req, res) {
  const file = req.file;
  const userid = req.userid;

  if (!file) {
    return res.status(400).json({ message: "프로필 파일이 없습니다." });
  }

  const profilePath = `/uploads/${file.filename}`;

  try {
    await authRepository.updateUser(userid, { profile: profilePath });
    res.status(200).json({ message: "프로필 변경 완료", profile: profilePath });
  } catch (err) {
    res.status(500).json({ message: "프로필 변경 실패", error: err.message });
  }
}

// 🔹 비밀번호 변경 전용 핸들러
export async function updatePassword(req, res) {
  const { password } = req.body;
  const userid = req.userid;

  if (!password) {
    return res.status(400).json({ message: "비밀번호가 제공되지 않았습니다." });
  }

  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);

  try {
    await authRepository.updateUser(userid, { password: hashed });
    res.status(200).json({ message: "비밀번호 변경 완료" });
  } catch (err) {
    res.status(500).json({ message: "비밀번호 변경 실패", error: err.message });
  }
}

// 🔹 휴대전화번호 변경 전용 핸들러
export async function updatePhone(req, res) {
  const { hp } = req.body;
  const userid = req.userid;

  if (!hp) {
    return res.status(400).json({ message: "휴대전화번호가 제공되지 않았습니다." });
  }

  try {
    await authRepository.updateUser(userid, { hp });
    res.status(200).json({ message: "휴대전화번호 변경 완료" });
  } catch (err) {
    res.status(500).json({ message: "휴대전화번호 변경 실패", error: err.message });
  }
}
