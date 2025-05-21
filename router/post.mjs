import express from "express";
import * as postController from "../controller/post.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

const validatePost = [
  body("text").trim().isLength({ min: 5 }).withMessage("최소 5자 이상 입력"),
  validate,
];

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: "모든 게시글 조회 (쿼리: userid 가능)"
 *     tags: [Posts]
 *     parameters:
 *       - name: userid
 *         in: query
 *         description: 사용자 ID로 필터링
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 목록 가져오기 성공
 */
router.get("/", postController.getPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: 게시글 ID로 조회
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글 상세정보 반환
 */
router.get("/:id", postController.getPostId);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: 새 게시글 작성
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "안녕하세요, 새 글입니다."
 *     responses:
 *       201:
 *         description: 게시글 작성 성공
 */
router.post("/", validatePost, isAuth, postController.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: 게시글 전체 수정
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "수정된 글 내용입니다."
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 */
router.put("/:id", validatePost, isAuth, postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: 게시글 일부 수정
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글 일부 수정 성공
 */
router.patch("/:id", isAuth, postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글 삭제 성공
 */
router.delete("/:id", isAuth, postController.deletePost);

export default router;
