// 글 관련 작동
import express from "express";
import * as placeController from "../controller/place.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

/**
 * @swagger
 * /place:
 *   get:
 *     summary: 게시글 ID(postId)로 장소 조회
 *     tags: [Place]
 *     parameters:
 *       - name: postId
 *         in: query
 *         required: true
 *         description: 게시글 ID (예: postId=123)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 ID에 연결된 장소 정보 반환
 */
router.get("/", placeController.getPlaceByPostId);

/**
 * @swagger
 * /place:
 *   post:
 *     summary: 장소 정보 등록
 *     tags: [Place]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 example: "abc123"
 *               address:
 *                 type: string
 *                 example: "서울 강남구 테헤란로 123"
 *               latitude:
 *                 type: number
 *                 example: 37.5665
 *               longitude:
 *                 type: number
 *                 example: 126.9780
 *     responses:
 *       201:
 *         description: 장소 등록 성공
 */
router.post("/", placeController.createPlace);

/**
 * @swagger
 * /place/{id}:
 *   get:
 *     summary: 장소 ID로 조회
 *     tags: [Place]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 장소 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 장소 정보 반환 성공
 */
router.get("/:id", placeController.getPlaceById);

export default router;
