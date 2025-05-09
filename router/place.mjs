// 글 관련 작동
import express from "express";
import * as placeController from "../controller/place.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/", isAuth, placeController.getPlaceByPostId);

router.post("/", isAuth, placeController.createPlace);

router.get("/:id", isAuth, placeController.getPlaceById);

export default router;
