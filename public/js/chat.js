/*
async function loadData() {
  const token = sessionStorage.getItem("token");

  try {
    // 1. 먼저 채팅 데이터 가져오기
    const chatResponse = await fetch("/chat", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const chatData = await chatResponse.json();

    if (!chatResponse.ok) {
      alert(chatData.message || "채팅 데이터를 불러올 수 없습니다.");
      return;
    }

    const postItems = [];

    // 2. 각 채팅의 postId를 통해 포스트 데이터 요청
    for (const chat of chatData) {
      const postId = chat.postId;
      if (!postId) continue;

      try {
        const postResponse = await fetch(`/posts/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (postResponse.ok) {
          const postData = await postResponse.json();
          postItems.push(postData); // 포스트 데이터 저장
        } else {
          console.warn(`postId ${postId}에 대한 데이터를 가져오지 못했습니다.`);
        }
      } catch (postError) {
        console.error(`postId ${postId}에 대한 요청 실패:`, postError);
      }
    }

    renderItems(postItems);
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }
}

function renderItems(items) {
  const container = document.getElementById("chat__box");
  container.innerHTML = "";

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "chat__item";

    div.innerHTML = `
      <div class="chat__item__img">
        <img
          src="${item.img || "/img/placeholder.png"}"
          alt="thumbnail"
          class="chat__item__img"
        />
      </div>
      <div class="chat__item__title">${item.tittle || "제목 없음"}</div>
      <div class="chat__info">
        <div class="chat__item__price">${
          item.price?.toLocaleString() || "가격 없음"
        }원</div>
        <div><img src="./img/person.png" alt="person" /></div>
      </div>
    `;

    div.addEventListener("click", () => {
      localStorage.setItem("postId", item._id);
      console.log("이동할할 postId:", item._id);
      location.href = `/chatting.html?id=${item._id}`;
    });

    container.appendChild(div);
  });
}

window.onload = function () {
  loadData();
};
*/
let allItems = []; // 모든 아이템 저장 (필터링용)

async function loadData() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    location.href = "/login.html";
    return;
  }
  try {
    const userRes = await fetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) throw new Error("사용자 정보를 불러올 수 없습니다.");
    const user = await userRes.json();
    const myUserid = user.userid;

    const chatResponse = await fetch("/chat", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const chatData = await chatResponse.json();
    if (!chatResponse.ok) {
      alert(chatData.message || "채팅 데이터를 불러올 수 없습니다.");
      return;
    }

    const postItems = [];

    for (const chat of chatData) {
      const postId = chat.postId;
      if (!postId) continue;

      try {
        const postResponse = await fetch(`/posts/${postId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (postResponse.ok) {
          const postData = await postResponse.json();
          let types = [];
          if (chat.owner?.trim() === myUserid?.trim()) types.push("판매");
          else types.push("구매");

          const hasUnread = chat.text?.some(
            (msg) => !(msg.seenBy || []).includes(myUserid)
          );
          if (hasUnread) types.push("안 읽은 채팅방");

          postItems.push({ ...postData, types, chatLogId: chat._id });
        }
      } catch (err) {
        console.error(`postId ${postId} 요청 실패:`, err);
      }
    }

    allItems = postItems; // 전역 변수에 저장
    renderItems(allItems); // 전체 렌더링
  } catch (err) {
    console.error("에러 발생:", err);
    alert("데이터를 불러오는 중 오류가 발생했습니다.");
  }
}

function renderItems(items) {
  const container = document.getElementById("chat__box");
  container.innerHTML = "";

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "chat__item";

    div.innerHTML = `
      <div class="chat__item__img-wrapper">
        <img
          src="${item.img || "/img/placeholder.png"}"
          alt="thumbnail"
          class="chat__item__img"
        />
      </div>
      <div class="chat__item__title">${item.tittle || "제목 없음"}</div>
      <div class="chat__info">
        <div class="chat__type">${item.types.join(" || ")}</div>
      </div>
    `;

    div.addEventListener("click", () => {
      location.href = `/chatting.html?id=${item._id}`;
    });

    container.appendChild(div);
  });
}
// 필터 버튼 이벤트
function setupFilters() {
  document.getElementById("filter-all").addEventListener("click", () => {
    renderItems(allItems);
  });

  document.getElementById("filter-sell").addEventListener("click", () => {
    renderItems(allItems.filter((item) => item.types.includes("판매")));
  });

  document.getElementById("filter-buy").addEventListener("click", () => {
    renderItems(allItems.filter((item) => item.types.includes("구매")));
  });

  document.getElementById("filter-unread").addEventListener("click", () => {
    renderItems(
      allItems.filter((item) => item.types.includes("안 읽은 채팅방"))
    );
  });
}

window.onload = function () {
  loadData();
  setupFilters();
};
