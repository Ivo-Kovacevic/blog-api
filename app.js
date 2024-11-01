import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { login } from "./middlewares/auth.js";
import { attachUserMiddleware } from "./middlewares/attachUser.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(attachUserMiddleware);

app.post("/login", login);

app.use("/users", routes.user);
app.use("/posts", routes.post);
app.use("/posts/:postId/comments", routes.comment);
app.use("/users/:userId/comments", routes.comment);

app.use("*", (req, res) => {
    res.status(404).json({ message: "Error: Invalid endpoint" });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`App is live at port ${PORT}`);
});
