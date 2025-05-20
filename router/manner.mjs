import express from "express";
import * as mannerController from "../controller/manner.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/manner/auto/:userid", mannerController.getOrCreateUserById);
router.get("/", mannerController.getmanner);
router.post("/", isAuth, mannerController.createUser);
router.get("/:userid", mannerController.getUserById);
router.delete("/:userid", isAuth, mannerController.deleteUser);

export default router;
