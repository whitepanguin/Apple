import express from "express";
import * as mannerController from "../controller/manner.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

/**
 * @swagger
 * /api/manner/auto/{userid}:
 *   get:
 *     summary: 유저 ID로 매너 정보 조회 또는 자동 생성
 *     tags: [Manner]
 *     parameters:
 *       - name: userid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 매너 정보 조회 또는 생성 성공
 */
router.get("/manner/auto/:userid", mannerController.getOrCreateUserById);

/**
 * @swagger
 * /api:
 *   get:
 *     summary: 전체 매너 정보 조회
 *     tags: [Manner]
 *     responses:
 *       200:
 *         description: 전체 사용자 매너 정보 반환
 */
router.get("/", mannerController.getmanner);

/**
 * @swagger
 * /api:
 *   post:
 *     summary: 매너 사용자 생성
 *     tags: [Manner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *                 example: "apple123"
 *     responses:
 *       201:
 *         description: 매너 사용자 생성 성공
 */
router.post("/", isAuth, mannerController.createUser);

/**
 * @swagger
 * /api/{userid}:
 *   get:
 *     summary: 특정 유저의 매너 정보 조회
 *     tags: [Manner]
 *     parameters:
 *       - name: userid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 매너 사용자 정보 반환
 */
router.get("/:userid", mannerController.getUserById);

/**
 * @swagger
 * /api/{userid}:
 *   delete:
 *     summary: 특정 유저의 매너 정보 삭제
 *     tags: [Manner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 매너 사용자 삭제 성공
 */
router.delete("/:userid", isAuth, mannerController.deleteUser);

export default router;
