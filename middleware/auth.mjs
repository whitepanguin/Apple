/*
    Authorization
    본인의 신원을 증명하는 과정

    Authorization 헤더
    http 요청을 보낼 때 헤더(Headers)라는 곳에 "추가 정보"를 담을 수 있음
    인증 정보를 담는 표준 위치가 Authorization 헤더임

    Bearer
    Authorization에 실을 수 있는 방식(타입) 중 하나
    Bearer는 토큰(token)을 가지고 있다는 것 자체로 인증함
        Authorization: Bearer <토큰>   

*/

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
    console.log("user.idx: ", user.idx);
    console.log("user.userid: ", user.userid);
    req.useridx = user.idx;
    next();
  });
};
