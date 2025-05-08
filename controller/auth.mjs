import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
import * as authRepository from "../repositories/authRepository.js";

const secretKey = config.jwt.secretKey;
const bcryptSaltRounds = config.bcrypt.saltRounds;
const jwtExpiresInDays = config.jwt.expiresInSec;

async function createJwtToken(idx) {
  return jwt.sign({ idx }, secretKey, { expiresIn: jwtExpiresInDays });
}

// 회원가입 put create
export async function signup(req, res, next) {
  const { email, password, name, nickName, birthDate, address, profile } =
    req.body;

  const found = await authRepository.findByUserid(email);
  if (found) {
    return res
      .status(409)
      .json({ message: `${email}은(는) 이미 사용 중입니다.` });
  }

  const hashed = await bcrypt.hash(password, bcryptSaltRounds);

  const user = await authRepository.createUser({
    email,
    password: hashed,
    name,
    nickName,
    birthDate,
    address,
    profile,
  });

  const token = await createJwtToken(user._id);
  res.status(201).json({ token, email });
}

// 로그인 post
export async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await authRepository.findByUserid(email);
  if (!user) {
    return res
      .status(404)
      .json({ message: `${email} 계정을 찾을 수 없습니다.` });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res
      .status(401)
      .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
  }

  const token = await createJwtToken(user._id);
  res.status(200).json({ token, email });
}

export async function verify(req, res, next) {
  const id = req.id;
  if (id) {
    res.status(200).json(id);
  } else {
    res.status(401).json({ message: "사용자 인증 실패" });
  }
}

export async function me(req, res, next) {
  const user = await authRepository.findByid(req.id);
  if (!user) {
    return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
  }
  res.status(200).json({ token: req.token, email: user.email });
}
