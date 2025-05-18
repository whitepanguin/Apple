async function loadData() {
  const token = localStorage.getItem("token");
  const postId = localStorage.getItem("postId");

  try {
    const response = await fetch(`/posts/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      renderItems(data); // <- 데이터 렌더링 함수 호출
      localStorage.setItem("userid", data.userid);
    } else {
      alert(data.message || "데이터 불러옴 실패");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }
}

function renderItems(item) {
  // 각 요소에 데이터 삽입
  const imgElement = document.querySelector(".chat__item__img img");
  const titleElement = document.getElementById("chat__item__title");
  const priceElement = document.getElementById("chat__item__price");
  const chatUserid = document.getElementById("chat__userid");

  if (imgElement) {
    imgElement.src = item.img;
  }

  if (titleElement) {
    titleElement.textContent = item.tittle;
  }
  if (chatUserid) {
    chatUserid.textContent = item.userid;
  }

  if (priceElement) {
    priceElement.textContent = `${item.price.toLocaleString()}원`;
  }
}

async function initChat() {
  const postId = localStorage.getItem("postId");
  const token = localStorage.getItem("token");

  console.log("[DEBUG] postId:", postId);
  console.log("[DEBUG] token:", token);

  if (!postId || !token) {
    alert("로그인이 필요하거나 postId가 없습니다.");
    return;
  }

  try {
    // 사용자 정보 가져오기
    const userRes = await fetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) throw new Error("사용자 정보를 불러올 수 없습니다.");
    const currentUser = await userRes.json();

    console.log("[DEBUG] currentUser:", currentUser);
    const myId = currentUser.userid;

    // 채팅 내용 가져오기
    const chatRes = await fetch(`/chat/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!chatRes.ok) throw new Error("채팅을 불러올 수 없습니다.");
    const chatArray = await chatRes.json(); // 🔹 배열로 받음

    console.log("[DEBUG] chatArray:", chatArray);

    if (!Array.isArray(chatArray) || chatArray.length === 0) {
      alert("채팅 데이터가 없습니다.");
      return;
    }

    const chatData = chatArray[0]; // 🔹 첫 번째 객체 사용
    localStorage.setItem("chatid", chatData._id);

    // 메시지 렌더링
    const messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML = ""; // 초기화

    if (!chatData.text || chatData.text.length === 0) {
      messagesContainer.innerHTML = "<div>채팅 내용이 없습니다.</div>";
      return;
    }

    console.log("[DEBUG] chatData.text:", chatData.text);

    // 날짜 헤더 (첫 메시지 기준)
    const dateDiv = document.createElement("div");
    dateDiv.className = "chat_date";
    dateDiv.textContent = formatDate(chatData.text[0].createdAt); // 🔹 수정
    messagesContainer.appendChild(dateDiv);

    chatData.text.forEach((msg) => {
      const isMe = msg.userid === myId;
      const chatDiv = document.createElement("div");
      chatDiv.className = isMe ? "chat__me" : "chat__oppent";

      chatDiv.innerHTML = `
        <div class="chat_user">${msg.chat}</div>
        <div class="chat_time">${formatTime(msg.createdAt)}</div>
      `;

      messagesContainer.appendChild(chatDiv);
    });
  } catch (err) {
    console.error("[ERROR] 채팅 로딩 실패:", err);
    alert("채팅 데이터를 불러오는 중 오류가 발생했습니다.");
  }
}
// 시간 포맷 함수 (오후 2:36 형식)
function formatTime(dateStr) {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 || 12;
  return `${period} ${displayHour}:${minutes.toString().padStart(2, "0")}`;
}

// 날짜 포맷 함수 (2020년 10월 10일 형식)
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}
//---

document.getElementById("send").addEventListener("click", async () => {
  const chatid = localStorage.getItem("chatid");
  const token = localStorage.getItem("token");
  const messageInput = document.getElementById("message");
  const chat = messageInput.value.trim();

  console.log("[DEBUG] chatid:", chatid);
  console.log("[DEBUG] token:", token);
  console.log("[DEBUG] chat input:", chat);

  if (!chat) {
    console.log("[DEBUG] 입력값이 비어있어 메시지를 전송하지 않음");
    return;
  }

  try {
    // 1. 내 user 정보 가져오기
    const meRes = await fetch("http://localhost:8080/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("[DEBUG] /auth/me status:", meRes.status);
    const me = await meRes.json();
    console.log("[DEBUG] /auth/me 응답 데이터:", me);

    const userid = me.userid;

    // 2. 채팅 전송
    const res = await fetch(`http://localhost:8080/chat/${chatid}/${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chat }),
    });

    console.log("[DEBUG] POST /chat 응답 status:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error("[ERROR] 채팅 전송 실패:", errText);
      throw new Error("채팅 전송 실패");
    }

    const updatedChatLog = await res.json();
    console.log("[DEBUG] updatedChatLog:", updatedChatLog);

    // 마지막 메시지를 updatedChatLog.text에서 가져오기
    const lastMessage = updatedChatLog.text.at(-1);

    console.log("[DEBUG] 마지막 메시지:", lastMessage);

    // 메시지 보낸 사람이 본인인지 체크해서 클래스 지정
    const chatBox = document.getElementById("messages");
    const chatDiv = document.createElement("div");
    chatDiv.className =
      lastMessage.userid === userid ? "chat__me" : "chat__oppent";
    chatDiv.innerHTML = `
      <div class="chat_user">${lastMessage.chat}</div>
      <div class="chat_time">${formatTime(lastMessage.createdAt)}</div>
    `;
    chatBox.appendChild(chatDiv);

    messageInput.value = ""; // 입력창 초기화
    chatBox.scrollTop = chatBox.scrollHeight; // 스크롤 맨 아래로
  } catch (error) {
    console.error("[ERROR] 메시지 전송 실패:", error);
    alert("메시지 전송에 실패했습니다.");
  }
});

function formatTime(dateString) {
  const date = new Date(dateString);
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h > 12 ? "오후" : "오전"} ${h % 12 || 12}:${m}`;
}
window.onload = function () {
  loadData();
  initChat();
};
