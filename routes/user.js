const { Router } = require("express");
const router = Router();
const controller = require("../controllers/user");

router.get("/", controller.allUsersGet);
router.get("/:userId", controller.userGet);
router.put("/:userId", controller.updateUserPut);
router.delete("/:userId", controller.deleteUserDelete);

module.exports = router;
