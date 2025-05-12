import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import postsRouter from "./router/post.mjs";
import authRouter from "./router/auth.mjs";
import placeRouter from "./router/place.mjs";
import { config } from "./config.mjs";
import connect from "./connect/connect.mjs";

connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  fs.readFile(__dirname + "/index.html", (err, data) => {
    if (err) {
      res.status(500);
      return res.send("파일 읽기 오류");
    }
    res.status(200).set({ "Content-Type": "text/html" });
    res.send(data);
  });
});

app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/place", placeRouter);

app.use((req, res, next) => {
  // 라우터에 있는 데이터가 안 읽힐 경우 실행
  res.sendStatus(404);
});

app.listen(config.host.port, () => {
  console.log("서버 실행 중");
});
