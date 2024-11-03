import { Router } from "express";
import * as controller from "../controllers/comment.js";
const router = Router({ mergeParams: true });
router.get("/", controller.allCommentsGet);
router.get("/:commentId", controller.commentGet);
router.post("/", controller.createCommentPost);
router.put("/:commentId", controller.updateCommentPut);
router.delete("/:commentId", controller.deleteCommentDelete);
export default router;
//# sourceMappingURL=comment.js.map