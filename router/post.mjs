// 글 관련 작동
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

// 모든 포스트 가져오기
// 해당 아이디에 대한 포스트 가져오기
// GET
// http://127.0.0.1:8080/posts/
// http://127.0.0.1:8080/posts?userid=apple
router.get("/", isAuth, postController.getPosts);

// 글번호에 대한 포스트 가져오기
// GET
// http://127.0.0.1:8080/posts/:id
router.get("/:id", isAuth, postController.getPostId);

// 포스트 쓰기
// POST
// http://127.0.0.1:8080/posts
// json 형태로 입력 후 저장
router.post("/", validatePost, isAuth, postController.createPost);

// 포스트 수정
// PUT
// http://127.0.0.1:8080/posts/:id
// json 형태로 입력 후 저장
router.put("/:id", validatePost, isAuth, postController.updatePost);

// 포스트 삭제
// DELETE
// http://127.0.0.1:8080/posts/:id
router.delete("/:id", isAuth, postController.deletePost);

export default router;
