import { Router } from "express";
import { login, registerUser, transaction, Report } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/transaction").post(verifyJWT, transaction);
router.route("/report").get(verifyJWT, Report);
export default router