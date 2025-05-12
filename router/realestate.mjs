// 글 관련 작동
import express from "express";
import * as realestateController from "../controller/realestate.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/", isAuth, realestateController.getRealByPostId);

router.post("/", isAuth, realestateController.createReal);

router.get("/:id", isAuth, realestateController.getRealById);

export default router;
