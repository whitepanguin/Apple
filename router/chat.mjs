import express from "express";
import * as chatController from "../controller/chat.mjs";
import { isAuth } from "../middleware/auth.mjs"; // 인증 미들웨어

const router = express.Router();

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: 모든 채팅룸 목록 조회
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: 모든 채팅룸 반환 성공
 */
router.get("/", chatController.getChats); // 모든 채팅룸 보기

/**
 * @swagger
 * /chat/{postid}:
 *   get:
 *     summary: 게시글 ID로 채팅방 조회 (없으면 생성)
 *     tags: [Chat]
 *     parameters:
 *       - name: postid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 채팅방 조회 또는 생성 성공
 */
router.get("/:postid", chatController.getChatByPostid); // postid로 찾기 & 없으면 생성해주기

/**
 * @swagger
 * /chat/{postid}:
 *   post:
 *     summary: 게시글 ID로 채팅룸 생성
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: postid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 채팅룸 생성 성공
 */
router.post("/:postid", isAuth, chatController.createChat); // postid로 채팅룸 생성

/**
 * @swagger
 * /chat/{chatLogId}/{userid}:
 *   post:
 *     summary: 채팅 메시지 생성
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatLogId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: userid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "안녕하세요, 채팅 메시지입니다."
 *     responses:
 *       201:
 *         description: 채팅 메시지 생성 성공
 */
router.post("/:chatLogId/:userid", isAuth, chatController.Chat); // 채팅 생성

/**
 * @swagger
 * /chat/{chatLogId}/{chatId}:
 *   put:
 *     summary: 채팅 메시지 수정
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatLogId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: chatId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "수정된 채팅 메시지입니다."
 *     responses:
 *       200:
 *         description: 채팅 메시지 수정 성공
 */
router.put("/:chatLogId/:chatId", isAuth, chatController.updateChat); // 채팅 수정

/**
 * @swagger
 * /chat/{chatId}:
 *   delete:
 *     summary: 채팅 메시지 삭제
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 채팅 메시지 삭제 성공
 */
router.delete("/:chatId", isAuth, chatController.deleteChat); // 채팅 내용 삭제

export default router;
