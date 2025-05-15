import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import { Server } from "socket.io";
import { createServer } from "http";
import postsRouter from "./router/post.mjs";
import authRouter from "./router/auth.mjs";
import placeRouter from "./router/place.mjs";
import { config } from "./config.mjs";
import connect from "./connect/connect.mjs";
import mannerRouter from "./router/manner.mjs";
import realRouter from "./router/realestate.mjs";

connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
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
app.use("/api", mannerRouter);
app.use("/real", realRouter);

app.use((req, res, next) => {
  // 라우터에 있는 데이터가 안 읽힐 경우 실행
  res.sendStatus(404);
});

const users = {};

io.on("connection", (socket) => {
  socket.on("join", ({ userid, channel }) => {
    socket.userid = userid;
    socket.channel = channel;
    users[socket.id] = { userid, channel };
    socket.join(channel);
    const msg = { user: "system", text: `${userid}님이 입장했습니다.` };
    // to 서버의 이벤트
    io.to(channel).emit("message", msg);
    // console.log("userid: ", userid, ", channel: ", channel);
    // logMessage(channel, msg);

    const previousLog = getLog(channel);
    socket.emit("chatLog", previousLog);

    updateUserList();
  });

  socket.on("chat", ({ text, to }) => {
    // console.log(text);
    // console.log(to);
    const sender = users[socket.id];
    // console.log(sender);
    if (!sender) return;
    const payload = { user: sender.userid, text };

    // 귓속말 처리해야 함
    if (to) {
      const reciverSocket = Object.entries(users).find(
        ([id, u]) => u.userid === to
      )?.[0];
      //[0] 소켓id,, -(?.) 뭔가 ES7이후에 나온 문법이다. (옵셔널 체이닝): 값이 undefined일 경우 에러 없이 넘어가게 함(사용자가 없을 수도 있으니 안전하게 접근) 유저가 갑자기 나가거나 할때
      if (reciverSocket) {
        io.to(reciverSocket).emit("whisper", payload);
        // 나한테도 보여지게 하는 방법
        socket.emit("whisper", payload);
      }
    } else {
      io.to(sender.channel).emit("message", payload);
      // logMessage(sender.channel, payload);
    }
  });

  socket.on("changeChannel", ({ newChannel }) => {
    const oldChannel = socket.channel;
    const userid = socket.userid;
    socket.leave(oldChannel);
    io.to(oldChannel).emit("message", {
      user: "system",
      text: `${userid}님이 ${newChannel} 채널로 이동했습니다`,
    });
    socket.channel = newChannel;
    console.log(users[socket.id].channel);
    users[socket.id].channel = newChannel;
    socket.join(newChannel);

    const joinMsg = { user: "system", text: `${userid}님이 입장했습니다` };
    io.to(newChannel).emit("message", joinMsg);
    // logMessage(newChannel, joinMsg);

    const previousLog = getLog(newChannel);
    socket.emit("chatLog", previousLog);

    updateUserList();
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      const msg = {
        user: "system",
        text: `${user.userid}님이 퇴장했습니다`,
      };
      io.to(user.channel).emit("message", msg);
      // logMessage(user.channel, msg);
      delete users[socket.id];

      updateUserList();
    }
  });

  function updateUserList() {
    // 특정 배열에 요소만 꺼내서 다시 제저장을 한다
    const userList = Object.values(users); // [{userid, channel},..]
    io.emit("userList", userList);
  }
});

app.listen(config.host.port, () => {
  console.log("서버 실행 중");
});
