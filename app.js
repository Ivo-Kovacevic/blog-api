require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const auth = require("./middlewares/auth");
const { attachUserMiddleware } = require("./middlewares/attachUser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(attachUserMiddleware);

app.post("/login", auth.login);

app.use("/users", routes.user);
app.use("/posts", routes.post);
app.use("/posts/:postId/comments", routes.comment);
app.use("/users/:userId/comments", routes.comment);

app.use("*", (req, res) => {
    res.status(404).json({ message: "Error: Invalid endpoint" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`App is live at port ${PORT}`);
});
