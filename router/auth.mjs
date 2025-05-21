import express from "express";
import path from "path";
import multer from "multer";
import * as authController from "../controller/auth.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

const router = express.Router();

const validateLogin = [
  body("password").trim().isLength({ min: 8 }).withMessage("최소 8자 이상 입력"),
  validate,
];

const validateSignup = [
  ...validateLogin,
  body("name").trim().notEmpty().withMessage("name을 입력"),
  body("email").trim().isEmail().withMessage("이메일 형식 확인"),
  validate,
];

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: 사용자 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "apple@example.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *               name:
 *                 type: string
 *                 example: "훤님"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 */
router.post("/signup", validateSignup, authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "apple@example.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: 로그인 성공 (JWT 토큰 반환)
 */
router.post("/login", validateLogin, authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: 로그인한 사용자 정보 조회
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 반환 성공
 */
router.get("/me", isAuth, authController.me);

/**
 * @swagger
 * /auth/update:
 *   patch:
 *     summary: 프로필 이미지 수정
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 사용자 정보 수정 성공
 */
router.patch("/update", isAuth, upload.single("profile"), authController.updateUser);

export default router;
