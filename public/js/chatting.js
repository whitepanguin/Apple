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

window.onload = function () {
  loadData();
};
