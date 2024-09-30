require("dotenv").config();
const express = require("express");
const routes = require("./routes/index");
const auth = require("./middlewares/auth");
const { attachUserMiddleware } = require("./middlewares/attachUser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(attachUserMiddleware);

app.post("/register", auth.register);
app.post("/login", auth.login);

app.use("/users", routes.user);
app.use("/posts", routes.post);
app.use("/comments", routes.comment);

app.listen(PORT, () => console.log(`App is live at port ${PORT}`));
