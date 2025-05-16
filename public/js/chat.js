async function loadData() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      renderItems(data); // <- 데이터 렌더링 함수 호출
    } else {
      alert(data.message || "데이터 불러옴 실패");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }
}

function renderItems(items) {
  const container = document.getElementById("chat__box");
  container.innerHTML = ""; // 기존 요소 제거 (필요 시)

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "chat__item";

    div.innerHTML = `
      <div class="chat__item__img">
        <img
          src="${item.img}"
          alt="thumbnail"
          class="chat__item__img"
        />
      </div>
      <div class="chat__item__title">${item.tittle}</div>
      <div class="chat__info">
        <div class="chat__item__price">${item.price.toLocaleString()}원</div>
        <div><img src="./img/person.png" alt="" /></div>
      </div>
    `;

    div.addEventListener("click", () => {
      localStorage.setItem("postId", item._id);
      console.log("저장된 postId:", item._id);
      location.href = "/chatting.html";
    });

    container.appendChild(div);
  });
}

window.onload = function () {
  loadData();
};
