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
      renderItems(data);
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
  const imgElement = document.querySelector(".chat__item__img img");
  const titleElement = document.getElementById("chat__item__title");
  const priceElement = document.getElementById("chat__item__price");
  const chatUserid = document.getElementById("chat__userid");

  if (imgElement) {
    imgElement.src = item.img;
  }

  if (titleElement) {
    titleElement.textContent = item.tittle; // 타이틀 오타 확인 필요
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

  if (!postId || !token) {
    alert("로그인이 필요하거나 postId가 없습니다.");
    location.href = "/chat.html";
    return;
  }

  try {
    const userRes = await fetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) throw new Error("사용자 정보를 불러올 수 없습니다.");
    const currentUser = await userRes.json();
    const myId = currentUser.userid;

    const chatRes = await fetch(`/chat/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!chatRes.ok) throw new Error("채팅을 불러올 수 없습니다.");
    let chatArray = await chatRes.json();
    if (!Array.isArray(chatArray)) {
      chatArray = [chatArray];
    }

    const chatData = chatArray[0];
    localStorage.setItem("chatid", chatData._id);

    const messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML = "";

    if (!chatData.text || chatData.text.length === 0) {
      messagesContainer.innerHTML = "<div>채팅 내용이 없습니다.</div>";
      return;
    }

    const dateDiv = document.createElement("div");
    dateDiv.className = "chat_date";
    dateDiv.textContent = formatDate(chatData.text[0].createdAt);
    messagesContainer.appendChild(dateDiv);

    chatData.text.forEach((msg) => {
      const isMe = msg.userid === myId;
      const chatDiv = document.createElement("div");

      chatDiv.className = isMe ? "chat__me" : "chat__opponent";
      chatDiv.dataset.textId = msg._id;
      chatDiv.dataset.chatDataId = chatData._id;
      chatDiv.innerHTML = `
        <div class="chat_user">
          ${msg.chat}
          ${
            msg.edited
              ? '<span style="font-size: 0.8em; color: gray;">(수정됨)</span>'
              : ""
          }
        </div>
        <div class="chat_time">${formatTime(msg.createdAt)}</div>
        ${
          isMe
            ? `<div class="chat_actions" style="display: none;">
                 <button class="edit_btn">수정</button>
                 <button class="delete_btn">삭제</button>
               </div>`
            : ""
        }
      `;

      messagesContainer.appendChild(chatDiv);
    });
  } catch (err) {
    console.error("[ERROR] 채팅 로딩 실패:", err);
    alert("채팅 데이터를 불러오는 중 오류가 발생했습니다.");
    location.href = "/chat.html";
  }
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 || 12;
  return `${period} ${displayHour}:${minutes.toString().padStart(2, "0")}`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

document.getElementById("send").addEventListener("click", async () => {
  const chatid = localStorage.getItem("chatid");
  const token = localStorage.getItem("token");
  const messageInput = document.getElementById("message");
  const chat = messageInput.value.trim();

  if (!chat) return;

  try {
    const meRes = await fetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!meRes.ok) throw new Error("사용자 정보를 불러올 수 없습니다.");
    const me = await meRes.json();
    const userid = me.userid;

    const res = await fetch(`/chat/${chatid}/${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chat }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error("채팅 전송 실패: " + errText);
    }

    messageInput.value = "";
    await initChat();
    document.getElementById("messages").scrollTop =
      document.getElementById("messages").scrollHeight;
  } catch (error) {
    console.error("[ERROR] 메시지 전송 실패:", error);
    alert("메시지 전송에 실패했습니다.");
  }
});

document.getElementById("messages").addEventListener("click", async (e) => {
  const target = e.target;
  const token = localStorage.getItem("token");

  if (target.classList.contains("edit_btn")) {
    const chatDiv = target.closest(".chat__me");
    const textId = chatDiv.dataset.textId;
    const chatDataId = chatDiv.dataset.chatDataId;
    const chatUserDiv = chatDiv.querySelector(".chat_user");

    const originalTextWithEdited = chatUserDiv.textContent;
    const originalText = originalTextWithEdited
      .replace(/\(수정됨\)\s*$/, "")
      .trim();

    if (chatDiv.querySelector("input.edit_input")) return;

    chatUserDiv.style.display = "none";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit_input";
    input.value = originalText;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "저장";
    saveBtn.className = "save_btn";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "취소";
    cancelBtn.className = "cancel_btn";

    const btnContainer = document.createElement("div");
    btnContainer.className = "edit_btn_container";
    btnContainer.appendChild(saveBtn);
    btnContainer.appendChild(cancelBtn);

    chatDiv.insertBefore(input, chatUserDiv.nextSibling);
    chatDiv.insertBefore(btnContainer, input.nextSibling);

    const actions = chatDiv.querySelector(".chat_actions");
    if (actions) actions.style.display = "none";

    saveBtn.addEventListener("click", async () => {
      const newText = input.value.trim();
      if (!newText || newText === originalText) {
        cancelEdit();
        return;
      }

      try {
        const res = await fetch(`/chat/${chatDataId}/${textId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chat: newText }),
        });

        if (!res.ok) throw new Error("수정 실패");

        const updated = await res.json();
        const isEdited = updated.edited;

        chatUserDiv.innerHTML = `${updated.chat || newText} ${
          isEdited
            ? '<span style="font-size: 0.8em; color: gray;">(수정됨)</span>'
            : ""
        }`;
        cancelEdit();
      } catch (err) {
        alert("수정 실패");
        console.error(err);
      }
    });

    cancelBtn.addEventListener("click", () => {
      cancelEdit();
    });

    function cancelEdit() {
      input.remove();
      btnContainer.remove();
      chatUserDiv.style.display = "";
    }
  }

  if (target.classList.contains("delete_btn")) {
    const chatDiv = target.closest(".chat__me");
    const textId = chatDiv.dataset.textId;

    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        const res = await fetch(`/chat/${textId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("삭제 실패");

        chatDiv.remove();
      } catch (err) {
        alert("삭제 실패");
        console.error(err);
      }
    }
  }

  if (
    target.closest(".chat__me") &&
    !target.classList.contains("edit_btn") &&
    !target.classList.contains("delete_btn")
  ) {
    const chatDiv = target.closest(".chat__me");
    if (chatDiv.querySelector("input.edit_input")) return;
    const actions = chatDiv.querySelector(".chat_actions");
    if (actions) {
      actions.style.display =
        actions.style.display === "none" ? "block" : "none";
    }
  }
});

window.onload = function () {
  const postId = localStorage.getItem("postId");
  const token = localStorage.getItem("token");

  if (!postId || !token) {
    alert("로그인이 필요하거나 postId가 없습니다.");
    location.href = "/chat.html";
    return;
  }

  loadData();
  initChat();
};
