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
 * /chat/{chatLogId}/read:
 *   post:
 *     summary: 채팅 메시지를 읽음으로 표시
 *     tags: [Chat]
 *     description: 지정한 채팅 로그 ID(chatLogId)에 대해 현재 사용자의 메시지를 읽음으로 표시합니다.
 *     parameters:
 *       - name: chatLogId
 *         in: path
 *         required: true
 *         description: 채팅 로그 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *                 description: 읽음 처리할 사용자 ID
 *     responses:
 *       200:
 *         description: 읽음 처리 완료
 *       400:
 *         description: userid가 누락되었거나 잘못된 요청
 *       404:
 *         description: 채팅 로그를 찾을 수 없음
 *       500:
 *         description: 서버 내부 오류
 */

router.post("/:chatLogId/read", chatController.markAsRead);

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
