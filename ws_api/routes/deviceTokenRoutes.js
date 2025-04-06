import express from "express";
import { DeviceTokenController } from "../controllers/index.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = express.Router();

router.get("/", checkAuth, DeviceTokenController.getTokens);

router.delete("/:id", checkAuth, DeviceTokenController.deleteToken);

router.put("/", checkAuth, DeviceTokenController.createOrUpdateToken);

export default router;
