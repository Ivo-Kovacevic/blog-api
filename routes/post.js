const { Router } = require("express");
const router = Router();
const controller = require("../controllers/post");

router.get("/", controller.allPostsGet);
router.get("/:postId", controller.postGet);
router.post("/", controller.createPostPost);
router.put("/:postId", controller.updatePostPut);
router.delete("/:postId", controller.deletePostDelete);

module.exports = router;
