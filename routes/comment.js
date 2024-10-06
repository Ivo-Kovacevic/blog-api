const { Router } = require("express");
const router = Router({ mergeParams: true });
const controller = require("../controllers/comment");

router.get("/", controller.allCommentsGet);
router.get("/:commentId", controller.commentGet);
router.post("/", controller.createCommentPost);
router.put("/:commentId", controller.updateCommentPut);
router.delete("/:commentId", controller.deleteCommentDelete);

module.exports = router;
