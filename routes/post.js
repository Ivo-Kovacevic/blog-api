const { Router } = require("express");
const router = Router();
const controller = require("../controllers/post");

router.get("/", controller.allPostsGet);
router.get("/:postId", controller.postGet);
router.post("/", controller.postPost);
router.put("/:postId", controller.postPut);
router.delete("/:postId", controller.postDelete);

module.exports = router;
