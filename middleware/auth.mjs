import jwt from "jsonwebtoken";
import * as authRepository from "../repositories/authRepository.js";
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
<<<<<<< HEAD
    console.log("user.idx: ", user._id);
    console.log("user.userid: ", user.userid);
    req.useridx = user._id.toString();
=======
    console.log("user.idx: ", user.idx);
    console.log("user.userid: ", user.userid);
    req.useridx = user.idx;
>>>>>>> 435f98a40471afb06284d245c0bfc900293f7219
    next();
  });
};
