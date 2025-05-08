// 사용자 api
import express from "express";
import * as authController from "../controller/auth.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";

const router = express.Router();

// 서버로 바로 왔을 때 데이터 확인하는 방법
// isLength 최소가 4자 이상이니? true false , withMessage 앞에 있는 것에 대한 에러 출력,
const validateLogin = [
  body("userid")
    .trim()
    .isLength({ min: 4 })
    .withMessage("최소 4자 이상 입력")
    .matches(/^[a-zA-Z0-9]*$/)
    .withMessage("특수문자는 사용불가"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("최소 8자 이상 입력"),
  validate,
];

const validateSignup = [
  ...validateLogin,
  body("name").trim().notEmpty().withMessage("name을 입력"),
  body("email").trim().isEmail().withMessage("이베일 형식 확인"),
  validate,
];

// 회원가입
// POST
// http://127.0.0.1:8080/auth/signup
router.post("/signup", validateSignup, authController.signup);

// 로그인
// POST
// http://127.0.0.1:8080/auth/login
router.post("/login", validateLogin, authController.login);

// 로그인 유지

export default router;
