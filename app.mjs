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
import rateLimit from "express-rate-limit";

connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.use(cors());

// 1.ip당 15분에 100번 요청 가능
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 요청 수
  message: {
    status: 429,
    message: "요청이 너무 많습니다. 나중에 다시 시도하세요.",
  },
  standardHeaders: true, // 표준 속도 제한 헤더를 응답에 포함하겠다는 뜻
  legacyHeaders: false, // 예전 레거시 방식의 헤더를 사용하지 않겠다
});
// app.use(limiter);
//----
// 2.Postman 또는 흔한 봇 필터링
/*
app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  if (/postman|curl|axios|bot|python/i.test(userAgent)) {
    return res.status(403).json({ message: "허용되지 않은 클라이언트입니다." });
  }
  next();
});
*/
//---

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

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
}); //3.파일 크기5MB 파일 5개
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.json({
    message: "단일파일 업로드 성공",
    file: req.file,
  });
});
app.post("/upload-multiple", upload.array("files", 5), (req, res) => {
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
