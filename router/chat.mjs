import express from "express";
import * as chatController from "../controller/chat.mjs";
import { isAuth } from "../middleware/auth.mjs"; // 인증 미들웨어

const router = express.Router();

router.get("/", chatController.getChats);
router.get("/:id", chatController.getChatId);
router.post("/", isAuth, chatController.createChat); // 사용자 생성
router.put("/:id", isAuth, chatController.updateChat); // 사용자 조회 (아이디 기반)
// 라우터 설정
router.delete("/:chatLogId/:chatId", isAuth, chatController.deleteChat);
// 사용자 삭제 (아이디 기반)

export default router;
