import express from "express";
import * as mannerController from "../controller/manner.mjs";
import { isAuth } from "../middleware/auth.mjs"; // 인증 미들웨어

const router = express.Router();

router.post("/", isAuth, mannerController.createUser); // 사용자 생성
router.get("/:userid", isAuth, mannerController.getUserById); // 사용자 조회 (아이디 기반)
router.delete("/:userid", isAuth, mannerController.deleteUser); // 사용자 삭제 (아이디 기반)

export default router;
