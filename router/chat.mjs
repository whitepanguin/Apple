import express from "express";
import * as chatController from "../controller/chat.mjs";
import { isAuth } from "../middleware/auth.mjs"; // 인증 미들웨어

const router = express.Router();

router.get("/", chatController.getChats); // 모든 채팅룸 보기
router.get("/:postid", chatController.getChatByPostid); // postid로 찾기 & 없으면 생성해주기

router.post("/:postid", isAuth, chatController.createChat); // postid로 채팅룸 생성
router.post("/:chatLogId/:userid", isAuth, chatController.Chat); // 채팅 생성

router.put("/:chatLogId/:chatId", isAuth, chatController.updateChat); // 채팅 수정

router.delete("/:chatId", isAuth, chatController.deleteChat); // 채팅 내용 삭제

export default router;
