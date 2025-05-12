import jwt from "jsonwebtoken";
import * as authRepository from "../repositories/authRepository.mjs";
import { config } from "../config.mjs";

const AUTH_ERROR = { message: "인증 에러" };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log(authHeader);
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    console.log("헤더 에러");
    return res.status(401).json(AUTH_ERROR);
  }
  const token = authHeader.split(" ")[1];
  console.log(token);

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      console.log("토큰 에러");
      return res.status(401).json(AUTH_ERROR);
    }
    console.log(decoded.idx);
    const user = await authRepository.findByid(decoded.idx);
    if (!user) {
      console.log("아이디 없음");
      return res.status(401).json(AUTH_ERROR);
    }

    console.log("user.idx: ", user._id);
    console.log("user.userid: ", user.userid);
    req.useridx = user._id.toString();
    req.useremail = user.email;
    req.userid = user.userid;
    next();
  });
};
