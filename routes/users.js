const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    return res.sendStatus(200);
});

router.get("/:userId", (req, res) => {
    return res.sendStatus(200);
});

router.post("/", (req, res) => {
    return res.sendStatus(200);
});

router.put("/:userId", (req, res) => {
    return res.sendStatus(200);
});

router.delete("/:userId", (req, res) => {
    return res.sendStatus(200);
});

module.exports = router;
