import { Router } from "express";
import * as controller from "../controllers/user.js";

const router = Router();

router.get("/", controller.allUsersGet);
router.get("/:userId", controller.userGet);
router.post("/", controller.createUserPost);
router.put("/:userId", controller.updateUserPut);
router.delete("/:userId", controller.deleteUserDelete);

export default router;
