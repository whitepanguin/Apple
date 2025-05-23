import express from "express";
// import fetch from "node-fetch";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
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
import { swaggerUi, swaggerSpec } from "./swagger.js"; // ✅ Swagger import 추가

connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
//---
const server = createServer(app);
const io = new Server(server);
const users = {};
//---
app.use(express.json());

app.use(cors());

// 1.ip당 15분에 100번 요청 가능
const limiter = rateLimit({
  windowMs: 15 * 1000, // 15분
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
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
    const allowedMime = ["image/jpeg", "image/png", "image/webp"];

    if (allowedExt.includes(ext) && allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("허용되지 않은 파일 형식입니다."), false);
    }
  },
}); //3.파일 크기5MB 파일 5개, 확장자 예외처리 및 파일 확장자 검사사
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

// ✅ Swagger UI 연결
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger UI
app.get("/swagger.json", (req, res) => {
  // Swagger 명세 JSON 경로
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// 카카오
// server.mjs
app.get("/api/region", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const kakaoRes = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );
    const data = await kakaoRes.json();
    res.json(data);
  } catch (error) {
    console.error("Kakao API error:", error);
    res.status(500).json({ error: "카카오 API 오류" });
  }
});

app.use(express.static("public"));

app.use((req, res, next) => {
  // 라우터에 있는 데이터가 안 읽힐 경우 실행
  res.sendStatus(404);
});

// 오류 처리리
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: "파일 업로드 오류: " + err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

//---
io.on("connection", (socket) => {
  socket.on("join", ({ nickname, postId }) => {
    socket.nickname = nickname;
    socket.postId = postId;
    users[socket.id] = { nickname, postId };
    socket.join(postId);
    // const msg = { user: "system", text: `` };
    // to 서버의 이벤트
    // io.to(postId).emit("message", msg);
    // console.log("nickname: ", nickname, ", postId: ", postId);
    // logMessage(postId, msg);

    // const previousLog = getLog(postId);
    // socket.emit("chatLog", previousLog);

    // updateUserList();
  });

  socket.on("chat", ({ text, to }) => {
    // console.log(text);
    // console.log(to);
    const sender = users[socket.id];
    // console.log(sender);
    if (!sender) return;
    const payload = { user: sender.nickname, text };

    // 귓속말 처리해야 함
    if (to) {
      const reciverSocket = Object.entries(users).find(
        ([id, u]) => u.nickname === to
      )?.[0];
      //[0] 소켓id,, -(?.) 뭔가 ES7이후에 나온 문법이다. (옵셔널 체이닝): 값이 undefined일 경우 에러 없이 넘어가게 함(사용자가 없을 수도 있으니 안전하게 접근) 유저가 갑자기 나가거나 할때
      if (reciverSocket) {
        io.to(reciverSocket).emit("whisper", payload);
        // 나한테도 보여지게 하는 방법
        socket.emit("whisper", payload);
      }
    } else {
      io.to(sender.postId).emit("message", payload);
      // logMessage(sender.postId, payload);
    }
  });

  socket.on("changepostId", ({ newpostId }) => {
    const oldpostId = socket.postId;
    const nickname = socket.nickname;
    socket.leave(oldpostId);
    // io.to(oldpostId).emit("message", {
    //   user: "system",
    //   text: `${nickname}님이 ${newpostId} 채널로 이동했습니다`,
    // });
    socket.postId = newpostId;
    console.log(users[socket.id].postId);
    users[socket.id].postId = newpostId;
    socket.join(newpostId);

    const joinMsg = { user: "system", text: `` };
    // io.to(newpostId).emit("message", joinMsg);
    // logMessage(newpostId, joinMsg);

    // const previousLog = getLog(newpostId);
    // socket.emit("chatLog", previousLog);

    // updateUserList();
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      const msg = {
        user: "system",
        text: ``,
      };
      io.to(user.postId).emit("message", msg);
      // logMessage(user.postId, msg);
      delete users[socket.id];

      // updateUserList();
    }
  });

  socket.on("refreshAll", () => {
    io.emit("refresh");
    location.reload();
  });

  socket.on("editChat", ({ postId, textId, newText, edited }) => {
    io.to(postId).emit("editChat", { textId, newText, edited });
  });

  socket.on("deleteChat", ({ postId, textId }) => {
    io.to(postId).emit("deleteChat", { textId });
  });

  function updateUserList() {
    const userList = Object.values(users); // [{nickname, postId},..]
    io.emit("userList", userList);
  }
});

//---

server.listen(config.host.port, () => {
  console.log("서버 실행 중");
});
