import { Router } from "express";
import MainController from "../controllers/main";

const router = Router();

router.get("/", MainController.home);

export default router;
