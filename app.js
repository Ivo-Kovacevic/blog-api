require("dotenv").config();
const express = require("express");
const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.use("/users", routes.users);
app.use("/posts", routes.posts);
app.use("/comments", routes.comments);

app.listen(PORT, () => console.log(`App is live at port ${PORT}`));
