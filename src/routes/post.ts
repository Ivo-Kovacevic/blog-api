import { Router } from "express";
import * as controller from "../controllers/post.js";

const router = Router();

router.get("/", controller.allPostsGet);
router.get("/:postId", controller.postGet);
router.post("/", controller.createPostPost);
router.put("/:postId", controller.updatePostPut);
router.delete("/:postId", controller.deletePostDelete);

export default router;
