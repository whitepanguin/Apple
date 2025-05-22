// 글 관련 작동
import express from "express";
import * as realestateController from "../controller/realestate.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

/**
 * @swagger
 * /real:
 *   get:
 *     summary: 모든 부동산 정보 조회
 *     tags: [RealEstate]
 *     responses:
 *       200:
 *         description: 전체 부동산 목록 반환
 */
router.get("/", realestateController.getAllReals);

/**
 * @swagger
 * /real:
 *   post:
 *     summary: 부동산 정보 등록
 *     tags: [RealEstate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "강남 오피스텔 매매"
 *               price:
 *                 type: number
 *                 example: 350000000
 *               address:
 *                 type: string
 *                 example: "서울 강남구 테헤란로 123"
 *               area:
 *                 type: number
 *                 example: 84
 *     responses:
 *       201:
 *         description: 부동산 등록 성공
 */
router.post("/", isAuth, realestateController.createReal);

/**
 * @swagger
 * /real/{id}:
 *   get:
 *     summary: 부동산 ID로 상세 조회
 *     tags: [RealEstate]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 부동산 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 부동산 정보 반환 성공
 */
router.get("/:id", realestateController.getRealById);

// 수정 라우터
router.patch("/:id", isAuth, realestateController.updateReal);

// 삭제 라우터
router.delete("/:id", isAuth, realestateController.deleteReal);

export default router;
