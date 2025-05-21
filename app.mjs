import express from "express";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import postsRouter from "./router/post.mjs";
import authRouter from "./router/auth.mjs";
import placeRouter from "./router/place.mjs";
import { config } from "./config.mjs";
import connect from "./connect/connect.mjs";
import mannerRouter from "./router/manner.mjs";
import realRouter from "./router/realestate.mjs";
import chatRouter from "./router/chat.mjs";
import regionRouter from "./router/region.mjs"; // regionRouter
import cors from "cors";
import "dotenv/config";

connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  fs.readFile(__dirname + "/public/main.html", (err, data) => {
    if (err) {
      res.status(500);
      return res.send("파일 읽기 오류");
    }
    res.status(200).set({ "Content-Type": "text/html" });
    res.send(data);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = `${__dirname}/public/uploads/`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.json({
    message: "단일파일 업로드 성공",
    file: req.file,
  });
});

app.post("/upload-multiple", upload.array("files", 30), (req, res) => {
  console.log(req.files);
  res.json({
    message: "다중 파일 업로드 성공",
    files: req.files,
  });
});

app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/place", placeRouter);
app.use("/api", mannerRouter);
app.use("/real", realRouter);
app.use("/chat", chatRouter);
app.use("/region", regionRouter);
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/public/uploads"));

app.use((req, res, next) => {
  // 라우터에 있는 데이터가 안 읽힐 경우 실행
  res.sendStatus(404);
});

app.listen(config.host.port, () => {
  console.log("서버 실행 중");
});
