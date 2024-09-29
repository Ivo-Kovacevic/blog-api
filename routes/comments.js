const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    return res.sendStatus(200);
});

router.get("/:commentId", (req, res) => {
    return res.sendStatus(200);
});

router.post("/", (req, res) => {
    return res.sendStatus(200);
});

router.put("/:commentId", (req, res) => {
    return res.sendStatus(200);
});

router.delete("/:commentId", (req, res) => {
    return res.sendStatus(200);
});

module.exports = router;
