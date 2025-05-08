import express from "express";
import postsRouter from "./router/post.mjs";
import authRouter from "./router/auth.mjs";
import { config } from "./config.mjs";
import { db } from "./db/database.mjs";

const app = express();

app.use(express.json());

app.use("/posts", postsRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  // 라우터에 있는 데이터가 안 읽힐 경우 실행
  res.sendStatus(404);
});

// db.getConnection().then((connection) => console.log(connection));
app.listen(config.host.port, () => {
  console.log("서버 실행 중");
});
