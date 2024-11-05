import dotenv from "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { login } from "./middlewares/auth.js";
import { attachUserMiddleware } from "./middlewares/attachUser.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3000");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(attachUserMiddleware);

app.post("/login", login);

app.use("/users", routes.user);
app.use("/posts", routes.post);
app.use("/posts/:postId/comments", routes.comment);
app.use("/users/:userId/comments", routes.comment);

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Error: Invalid endpoint" });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`App is live at port ${PORT}`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});
